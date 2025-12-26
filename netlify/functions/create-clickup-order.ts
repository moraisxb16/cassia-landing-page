import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

/**
 * Função serverless para criar task no ClickUp após pagamento confirmado.
 * Não depende do frontend para montar payload de ClickUp além de disparar a chamada.
 */
export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  // SEMPRE retornar 200 para não quebrar o checkout
  // Mesmo se ClickUp falhar, o pagamento foi bem-sucedido
  try {
    const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;
    let CLICKUP_LIST_ID_RAW = process.env.CLICKUP_LIST_ID || '6-901323245019-1';

    if (!CLICKUP_API_TOKEN || !CLICKUP_LIST_ID_RAW) {
      console.error('❌ Variáveis do ClickUp ausentes');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, clickup: 'failed', error: 'Configuração do ClickUp ausente' }),
      };
    }

    // Extrair apenas o ID numérico da lista (remover formato com hífen)
    // Formato esperado: "6-901323245019-1" → "901323245019"
    const CLICKUP_LIST_ID = CLICKUP_LIST_ID_RAW.includes('-')
      ? CLICKUP_LIST_ID_RAW.split('-')[1] // Pega o meio: "6-901323245019-1" → "901323245019"
      : CLICKUP_LIST_ID_RAW.replace(/\D/g, ''); // Remove tudo que não é número

    let data: any;
    try {
      data = JSON.parse(event.body || '{}');
    } catch (error) {
      console.error('❌ Body inválido:', error);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, clickup: 'failed', error: 'Body inválido' }),
      };
    }

    const {
      order_id,
      nome_cliente,
      email,
      telefone,
      data_nascimento,
      endereco_completo,
      produtos = [],
      valor_total,
      forma_pagamento,
      data_compra,
    } = data;

    if (!order_id || !nome_cliente) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, clickup: 'failed', error: 'order_id e nome_cliente são obrigatórios' }),
      };
    }

    // Formatar lista de produtos para description
    const listaProdutos = Array.isArray(produtos) && produtos.length > 0
      ? produtos.map((p: any) => `${p.nome} - R$ ${p.valor}`).join('\n')
      : 'Produto não especificado';

    // Montar description no formato solicitado
    const description = `Pedido realizado no site Cassia Corviniy

Cliente: ${nome_cliente}
Email: ${email || 'Não informado'}
Telefone: ${telefone || 'Não informado'}
Data de nascimento: ${data_nascimento || 'Não informado'}

Endereço:
${endereco_completo || 'Não informado'}

Produto:
${listaProdutos}

Forma de pagamento: ${forma_pagamento || 'Não informado'}
Data da compra: ${data_compra || 'Não informado'}`;

    // Preparar token: Personal API Token (pk_...) deve ser usado DIRETAMENTE, SEM Bearer
    // NÃO usar "Bearer " antes do token
    const authHeader = CLICKUP_API_TOKEN.trim().replace(/\s+/g, '');

    const clickupUrl = `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`;

    // ============================================
    // BUSCAR CUSTOM FIELDS DA LISTA
    // ============================================
    console.log('🔍 [CLICKUP] Buscando custom fields da lista...');
    const customFieldsMap = new Map<string, { id: string; type: string }>();
    try {
      const fieldsResponse = await fetch(
        `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/field`,
        {
          method: 'GET',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
        }
      );

      if (fieldsResponse.ok) {
        const fieldsData = await fieldsResponse.json();
        if (fieldsData.fields && Array.isArray(fieldsData.fields)) {
          fieldsData.fields.forEach((field: any) => {
            const fieldName = field.name?.toLowerCase() || '';
            // Mapear nomes dos campos (case-insensitive)
            if (fieldName.includes('cpf')) {
              customFieldsMap.set('cpf', { id: field.id, type: field.type });
            } else if (fieldName.includes('data') && fieldName.includes('nascimento')) {
              customFieldsMap.set('data_nascimento', { id: field.id, type: field.type });
            } else if (fieldName.includes('endereço') || fieldName.includes('endereco')) {
              customFieldsMap.set('endereco', { id: field.id, type: field.type });
            } else if (fieldName.includes('forma') && fieldName.includes('pagamento')) {
              customFieldsMap.set('forma_pagamento', { id: field.id, type: field.type });
            } else if (fieldName.includes('produto')) {
              customFieldsMap.set('produtos', { id: field.id, type: field.type });
            } else if (fieldName.includes('telefone')) {
              customFieldsMap.set('telefone', { id: field.id, type: field.type });
            } else if (fieldName.includes('valor')) {
              customFieldsMap.set('valor', { id: field.id, type: field.type });
            }
          });
        }
      }
      console.log('✅ [CLICKUP] Custom fields encontrados:', customFieldsMap.size);
    } catch (error) {
      console.warn('⚠️ [CLICKUP] Erro ao buscar custom fields:', error);
    }

    // ============================================
    // BUSCAR ÚLTIMA TASK PARA EXTRAIR NÚMERO SEQUENCIAL
    // ============================================
    let orderNumber = 1; // Default: começar em 1
    try {
      console.log('🔍 [CLICKUP] Buscando última task para número sequencial...');
      const tasksResponse = await fetch(
        `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task?order_by=created&reverse=true&page=0&limit=1`,
        {
          method: 'GET',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
        }
      );

      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        if (tasksData.tasks && tasksData.tasks.length > 0) {
          const lastTaskName = tasksData.tasks[0].name || '';
          const match = lastTaskName.match(/Pedido (\d+)/);
          if (match && match[1]) {
            orderNumber = parseInt(match[1], 10) + 1;
            console.log('✅ [CLICKUP] Último pedido encontrado:', match[1], '→ Novo:', orderNumber);
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ [CLICKUP] Erro ao buscar última task, usando número 1:', error);
    }

    // Converter data de nascimento para timestamp em milissegundos (se existir)
    let birthDateTimestamp: number | undefined;
    if (data_nascimento) {
      try {
        // Aceitar formato YYYY-MM-DD ou DD/MM/YYYY
        const dateStr = data_nascimento.includes('/')
          ? data_nascimento.split('/').reverse().join('-') // DD/MM/YYYY → YYYY-MM-DD
          : data_nascimento;
        birthDateTimestamp = new Date(dateStr).getTime();
        if (isNaN(birthDateTimestamp)) {
          birthDateTimestamp = undefined;
        }
      } catch (e) {
        console.warn('⚠️ [CLICKUP] Erro ao converter data de nascimento:', e);
      }
    }

    // Nome da task: "Pedido X - Nome do Cliente" (sem UUID)
    const taskName = `Pedido ${orderNumber} - ${nome_cliente}`;
    
    // Adicionar UUID na descrição (campo técnico, não no nome)
    const descriptionWithUuid = `${description}

🧾 Código Técnico (UUID): ${order_id}`;

    // Montar payload mínimo conforme documentação ClickUp
    const payload: any = {
      name: taskName,
      description: descriptionWithUuid,
      status: 'EM PRODUÇÃO', // Status como string simples
      priority: 3, // Normal priority
    };

    // Headers da requisição
    // Authorization: token direto, SEM "Bearer "
    const requestHeaders = {
      Authorization: authHeader, // Token direto: pk_xxx
      'Content-Type': 'application/json',
    };

    // Logs obrigatórios antes da chamada
    console.log('🚀 [CLICKUP] Iniciando criação de task');
    console.log('🌐 [CLICKUP] URL final:', clickupUrl);
    console.log('📋 [CLICKUP] List ID:', CLICKUP_LIST_ID);
    console.log('🔐 [CLICKUP] Headers:', JSON.stringify({
      Authorization: authHeader.substring(0, 10) + '...',
      'Content-Type': 'application/json',
    }));
    console.log('📦 [CLICKUP] Payload enviado:', JSON.stringify(payload, null, 2));

    const response = await fetch(clickupUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(payload),
    });

    // Ler resposta como texto primeiro
    const responseText = await response.text();
    let result: any;
    try {
      result = JSON.parse(responseText);
    } catch {
      result = { raw: responseText };
    }

    // Logs obrigatórios da resposta
    console.log('📥 [CLICKUP] Status HTTP:', response.status);
    console.log('📥 [CLICKUP] Status Text:', response.statusText);
    console.log('📥 [CLICKUP] Resposta bruta do ClickUp:', responseText);

    if (!response.ok) {
      // SEMPRE retornar 200 - checkout não pode quebrar
      console.error('❌ [CLICKUP] Erro ao criar task:', {
        status: response.status,
        statusText: response.statusText,
        error: result,
      });

      // Se erro 400 e for relacionado ao status, tentar sem status
      if (response.status === 400 && result.err && typeof result.err === 'string' && result.err.includes('status')) {
        console.log('⚠️ [CLICKUP] Status não existe na lista, tentando sem status...');
        delete payload.status;
        
        const retryResponse = await fetch(clickupUrl, {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify(payload),
        });

        const retryText = await retryResponse.text();
        let retryResult: any;
        try {
          retryResult = JSON.parse(retryText);
        } catch {
          retryResult = { raw: retryText };
        }

        console.log('📥 [CLICKUP] Retry - Status HTTP:', retryResponse.status);
        console.log('📥 [CLICKUP] Retry - Resposta bruta:', retryText);

        if (!retryResponse.ok) {
          // SEMPRE retornar 200 mesmo se retry falhar
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              clickup: 'failed',
              error: retryResult.err || retryResult.error || 'Erro ao criar task no ClickUp',
              clickup_response: retryResult,
            }),
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            task_id: retryResult.id,
            task_name: retryResult.name,
          }),
        };
      }

      // SEMPRE retornar 200 - checkout não pode quebrar
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          clickup: 'failed',
          error: result.err || result.error || 'Erro ao criar task no ClickUp',
          clickup_response: result,
        }),
      };
    }

    // Sucesso - Task criada
    console.log('✅ [CLICKUP] Task criada com sucesso:', result.id);

    // ============================================
    // PREENCHER CUSTOM FIELDS
    // ============================================
    if (customFieldsMap.size > 0 && result.id) {
      console.log('🔧 [CLICKUP] Preenchendo custom fields...');
      const taskId = result.id;

      // Função auxiliar para preencher um custom field
      const setCustomField = async (fieldKey: string, value: any) => {
        const field = customFieldsMap.get(fieldKey);
        if (!field) return;

        try {
          const fieldValue = typeof value === 'object' ? value : { value };
          const fieldResponse = await fetch(
            `https://api.clickup.com/api/v2/task/${taskId}/field/${field.id}`,
            {
              method: 'POST',
              headers: {
                Authorization: authHeader,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(fieldValue),
            }
          );

          if (fieldResponse.ok) {
            console.log(`✅ [CLICKUP] Campo "${fieldKey}" preenchido`);
          } else {
            console.warn(`⚠️ [CLICKUP] Erro ao preencher campo "${fieldKey}":`, await fieldResponse.text());
          }
        } catch (error) {
          console.warn(`⚠️ [CLICKUP] Erro ao preencher campo "${fieldKey}":`, error);
        }
      };

      // Preencher cada campo conforme o tipo
      if (customFieldsMap.has('cpf')) {
        // CPF: text
        // Buscar CPF nos dados recebidos (pode vir em vários formatos)
        // O frontend pode não estar enviando CPF ainda, então tentamos buscar de várias formas
        const cpfRaw = data.cpf || data.cpf_cliente || '';
        if (cpfRaw) {
          const cpfValue = cpfRaw.replace(/\D/g, ''); // Apenas números
          if (cpfValue.length >= 11) { // CPF válido tem 11 dígitos
            await setCustomField('cpf', { value: cpfValue });
          }
        } else {
          console.warn('⚠️ [CLICKUP] CPF não encontrado nos dados recebidos');
        }
      }

      if (customFieldsMap.has('data_nascimento')) {
        // Data de Nascimento: date (Unix timestamp em MILISSEGUNDOS)
        // Garantir que birthDateTimestamp está calculado corretamente
        if (!birthDateTimestamp && data_nascimento) {
          try {
            // Aceitar formato YYYY-MM-DD ou DD/MM/YYYY
            const dateStr = data_nascimento.includes('/')
              ? data_nascimento.split('/').reverse().join('-') // DD/MM/YYYY → YYYY-MM-DD
              : data_nascimento;
            birthDateTimestamp = new Date(dateStr).getTime();
            if (isNaN(birthDateTimestamp)) {
              birthDateTimestamp = undefined;
            }
          } catch (e) {
            console.warn('⚠️ [CLICKUP] Erro ao converter data de nascimento:', e);
          }
        }
        if (birthDateTimestamp) {
          // Enviar timestamp em milissegundos como NUMBER
          await setCustomField('data_nascimento', { value: birthDateTimestamp });
        }
      }

      if (customFieldsMap.has('endereco') && endereco_completo) {
        // Endereço Completo: text
        await setCustomField('endereco', { value: endereco_completo });
      }

      if (customFieldsMap.has('forma_pagamento')) {
        // Forma de Pagamento: text
        // Enviar valor simples: "PIX", "Cartão de Crédito", etc
        if (forma_pagamento) {
          await setCustomField('forma_pagamento', { value: forma_pagamento });
        }
      }

      if (customFieldsMap.has('produtos')) {
        // Produtos: text
        // Usar listaProdutos que já está formatada (ex: "Produto Teste - R$ 1,00")
        if (listaProdutos && listaProdutos !== 'Produto não especificado') {
          await setCustomField('produtos', { value: listaProdutos });
        }
      }

      if (customFieldsMap.has('telefone') && telefone) {
        // Telefone: phone
        let phoneNumber = telefone.replace(/\D/g, '');
        if (!phoneNumber.startsWith('55')) {
          phoneNumber = '55' + phoneNumber;
        }
        await setCustomField('telefone', { value: '+' + phoneNumber });
      }

      if (customFieldsMap.has('valor') && valor_total) {
        // Valor: currency (número EM CENTAVOS)
        // valor_total vem como string "1,00" do frontend (formato brasileiro)
        let valorCentavos: number;
        if (typeof valor_total === 'string') {
          // Converter "1,00" → 100 (centavos)
          // Remove tudo exceto números e vírgula, substitui vírgula por ponto
          const valorLimpo = valor_total.replace(/[^\d,]/g, '').replace(',', '.');
          const valorReais = parseFloat(valorLimpo);
          valorCentavos = Math.round(valorReais * 100); // R$ 1,00 → 100 centavos
        } else {
          // Se já for número, assumir que está em reais e converter para centavos
          valorCentavos = Math.round(parseFloat(String(valor_total)) * 100);
        }
        // Enviar como NUMBER, não string
        await setCustomField('valor', { value: valorCentavos });
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        task_id: result.id,
        task_name: result.name,
        order_number: orderNumber,
      }),
    };
  } catch (error) {
    // SEMPRE retornar 200 - checkout não pode quebrar
    console.error('❌ [CLICKUP] Erro interno:', error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        clickup: 'failed',
        error: 'Erro interno',
        details: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};

