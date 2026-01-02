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
      cpf,
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

    // Formatar lista de produtos para custom field (formato legível)
    const listaProdutosFormatada = Array.isArray(produtos) && produtos.length > 0
      ? produtos.map((p: any) => `${p.nome} (Qtd: ${p.quantidade}) - R$ ${p.valor}`).join('\n')
      : 'Produto não especificado';
    
    // Formatar lista de produtos para description (formato original)
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
    const customFieldsMap = new Map<string, { id: string; type: string; options?: any[] }>();
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
            
            // Para dropdown, buscar opções em diferentes propriedades possíveis
            let options: any[] = [];
            if (field.type === 'drop_down') {
              options = field.type_config?.options || 
                       field.dropdown_options || 
                       field.options || 
                       [];
            }
            
            // Mapear nomes dos campos (case-insensitive)
            if (fieldName.includes('cpf')) {
              customFieldsMap.set('cpf', { id: field.id, type: field.type, options });
            } else if (fieldName.includes('data') && fieldName.includes('nascimento')) {
              customFieldsMap.set('data_nascimento', { id: field.id, type: field.type, options });
            } else if (fieldName.includes('endereço') || fieldName.includes('endereco')) {
              customFieldsMap.set('endereco', { id: field.id, type: field.type, options });
            } else if (fieldName.includes('forma') && fieldName.includes('pagamento')) {
              customFieldsMap.set('forma_pagamento', { id: field.id, type: field.type, options });
              // Log detalhado para debug do dropdown
              if (field.type === 'drop_down') {
                console.log('🔍 [CLICKUP] Campo Forma de Pagamento (dropdown) encontrado:', {
                  field_id: field.id,
                  field_name: field.name,
                  options_count: options.length,
                  options: options.map((o: any) => ({ 
                    id: o.id || o.option_id, 
                    name: o.name || o.label || o.value 
                  }))
                });
              }
            } else if (fieldName.includes('produto')) {
              customFieldsMap.set('produtos', { id: field.id, type: field.type, options });
            } else if (fieldName.includes('telefone')) {
              customFieldsMap.set('telefone', { id: field.id, type: field.type, options });
            } else if (fieldName.includes('valor')) {
              customFieldsMap.set('valor', { id: field.id, type: field.type, options });
            } else if ((fieldName.includes('número') || fieldName.includes('numero') || fieldName.includes('número do pedido') || fieldName.includes('numero do pedido')) && (fieldName.includes('pedido') || fieldName.includes('order'))) {
              customFieldsMap.set('numero_pedido', { id: field.id, type: field.type, options });
            }
          });
        }
      }
      console.log('✅ [CLICKUP] Custom fields encontrados:', customFieldsMap.size);
    } catch (error) {
      console.warn('⚠️ [CLICKUP] Erro ao buscar custom fields:', error);
    }

    // ============================================
    // BUSCAR TODAS AS TASKS PARA CALCULAR PRÓXIMO NÚMERO SEQUENCIAL
    // ============================================
    let orderNumber = 1; // Default: começar em 1
    try {
      console.log('🔍 [CLICKUP] Buscando todas as tasks para calcular número sequencial...');
      
      // Buscar todas as tasks da lista (com paginação se necessário)
      // A API do ClickUp retorna até 100 tasks por página
      let totalTasks = 0;
      let page = 0;
      let hasMore = true;
      
      while (hasMore) {
        const tasksResponse = await fetch(
          `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task?page=${page}&limit=100`,
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
          if (tasksData.tasks && Array.isArray(tasksData.tasks)) {
            totalTasks += tasksData.tasks.length;
            
            // Se retornou menos de 100, não há mais páginas
            if (tasksData.tasks.length < 100) {
              hasMore = false;
            } else {
              page++;
            }
          } else {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }
      
      // Próximo número = total de tasks existentes + 1
      orderNumber = totalTasks + 1;
      console.log(`✅ [CLICKUP] Total de tasks encontradas: ${totalTasks} → Próximo número: ${orderNumber}`);
    } catch (error) {
      console.warn('⚠️ [CLICKUP] Erro ao buscar tasks, usando número 1:', error);
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
        // CPF: text (apenas números)
        // Buscar CPF nos dados recebidos (pode vir em vários formatos)
        const cpfRaw = cpf || data.cpf || data.cpf_cliente || (data.customer && data.customer.cpf) || '';
        if (cpfRaw) {
          const cpfValue = cpfRaw.replace(/\D/g, ''); // Apenas números (remove pontos e traços)
          if (cpfValue.length >= 11) { // CPF válido tem 11 dígitos
            await setCustomField('cpf', { value: cpfValue });
            console.log(`✅ [CLICKUP] CPF enviado: ${cpfValue.substring(0, 3)}***${cpfValue.substring(cpfValue.length - 2)}`);
          } else {
            console.warn('⚠️ [CLICKUP] CPF inválido (menos de 11 dígitos):', cpfValue);
          }
        } else {
          console.warn('⚠️ [CLICKUP] CPF não encontrado nos dados recebidos');
        }
      }

      if (customFieldsMap.has('data_nascimento') && data_nascimento) {
        // Data de Nascimento: converter para DD/MM/YYYY (string com ano completo)
        try {
          let dateStr = data_nascimento.trim();
          let formattedDate: string | null = null;
          
          // Se já está em formato ISO (YYYY-MM-DD)
          if (dateStr.includes('-') && !dateStr.includes('/')) {
            const [year, month, day] = dateStr.split('-');
            formattedDate = `${day}/${month}/${year}`;
          } 
          // Se está em formato DD/MM/YYYY ou DD/MM/YY
          else if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
              let day = parts[0].padStart(2, '0');
              let month = parts[1].padStart(2, '0');
              let year = parts[2];
              
              // Se ano tem 2 dígitos, converter para 4 dígitos
              if (year.length === 2) {
                const yearNum = parseInt(year, 10);
                // Se ano for <= 30, assumir 20XX, senão 19XX
                year = yearNum <= 30 ? '20' + year : '19' + year;
              }
              
              // Garantir formato DD/MM/YYYY
              formattedDate = `${day}/${month}/${year}`;
            }
          }
          
          if (formattedDate && /^\d{2}\/\d{2}\/\d{4}$/.test(formattedDate)) {
            // Enviar como string DD/MM/YYYY
            await setCustomField('data_nascimento', { value: formattedDate });
            console.log(`✅ [CLICKUP] Data de nascimento enviada: ${data_nascimento} → ${formattedDate}`);
          } else {
            console.warn('⚠️ [CLICKUP] Data de nascimento em formato inválido:', data_nascimento);
          }
        } catch (e) {
          console.warn('⚠️ [CLICKUP] Erro ao converter data de nascimento:', e);
        }
      }

      if (customFieldsMap.has('endereco') && endereco_completo) {
        // Endereço Completo: text
        await setCustomField('endereco', { value: endereco_completo });
      }

      if (customFieldsMap.has('forma_pagamento')) {
        // Forma de Pagamento: pode ser drop_down ou short_text
        if (forma_pagamento) {
          const field = customFieldsMap.get('forma_pagamento');
          
          // Verificar se é dropdown (tem opções)
          if (field && field.type === 'drop_down' && field.options && Array.isArray(field.options) && field.options.length > 0) {
            // CENÁRIO B: Campo é drop_down - precisa do ID da opção
            const formaPagamentoLower = forma_pagamento.toLowerCase();
            let optionId: string | undefined;
            
            // Buscar opção que corresponda à forma de pagamento
            for (const option of field.options) {
              // Buscar nome da opção em diferentes propriedades
              const optionName = (
                option.name || 
                option.label || 
                option.label_text ||
                String(option.value || '')
              ).toLowerCase();
              
              // Buscar ID da opção em diferentes propriedades
              const optionIdValue = 
                option.id || 
                option.option_id || 
                option.value ||
                option.orderindex; // Algumas APIs retornam orderindex como ID
              
              // Buscar correspondência exata ou parcial
              if (
                (formaPagamentoLower.includes('pix') && optionName.includes('pix')) ||
                (formaPagamentoLower === 'pix' && optionName === 'pix') ||
                (formaPagamentoLower.includes('cartão') && optionName.includes('cartão')) ||
                (formaPagamentoLower.includes('cartao') && optionName.includes('cartao')) ||
                (formaPagamentoLower.includes('crédito') && optionName.includes('crédito')) ||
                (formaPagamentoLower.includes('credito') && optionName.includes('credito')) ||
                (formaPagamentoLower.includes('débito') && optionName.includes('débito')) ||
                (formaPagamentoLower.includes('debito') && optionName.includes('debito'))
              ) {
                optionId = String(optionIdValue); // Garantir que é string
                console.log(`🔍 [CLICKUP] Opção encontrada: "${optionName}" → ID: ${optionId}`);
                break;
              }
            }
            
            if (optionId) {
              // Enviar ID da opção do dropdown
              await setCustomField('forma_pagamento', { value: optionId });
              console.log(`✅ [CLICKUP] Forma de pagamento enviada (dropdown ID): ${optionId} (${forma_pagamento})`);
            } else {
              // Fallback: se não encontrar no dropdown, tentar enviar como texto
              console.warn('⚠️ [CLICKUP] Opção de pagamento não encontrada no dropdown:', forma_pagamento);
              console.warn('⚠️ [CLICKUP] Opções disponíveis:', field.options.map((o: any) => ({ name: o.name || o.label, id: o.id || o.option_id })));
              console.log('🔄 [CLICKUP] Tentando enviar como texto (fallback)...');
              
              // Normalizar para formato padrão
              let valorEnviar = forma_pagamento;
              const formaPagamentoLower = forma_pagamento.toLowerCase();
              
              if (formaPagamentoLower.includes('pix')) {
                valorEnviar = 'PIX';
              } else if (formaPagamentoLower.includes('cartão') || formaPagamentoLower.includes('cartao') || formaPagamentoLower.includes('crédito') || formaPagamentoLower.includes('credito')) {
                valorEnviar = 'Cartão de Crédito';
              } else if (formaPagamentoLower.includes('débito') || formaPagamentoLower.includes('debito')) {
                valorEnviar = 'Cartão de Débito';
              }
              
              await setCustomField('forma_pagamento', { value: valorEnviar });
              console.log(`✅ [CLICKUP] Forma de pagamento enviada (text fallback): ${valorEnviar}`);
            }
          } else {
            // CENÁRIO A: Campo é short_text ou text - enviar texto diretamente
            // Normalizar para formato padrão
            let valorEnviar = forma_pagamento;
            const formaPagamentoLower = forma_pagamento.toLowerCase();
            
            if (formaPagamentoLower.includes('pix')) {
              valorEnviar = 'PIX';
            } else if (formaPagamentoLower.includes('cartão') || formaPagamentoLower.includes('cartao') || formaPagamentoLower.includes('crédito') || formaPagamentoLower.includes('credito')) {
              valorEnviar = 'Cartão de Crédito';
            } else if (formaPagamentoLower.includes('débito') || formaPagamentoLower.includes('debito')) {
              valorEnviar = 'Cartão de Débito';
            }
            
            await setCustomField('forma_pagamento', { value: valorEnviar });
            console.log(`✅ [CLICKUP] Forma de pagamento enviada (text): ${valorEnviar} (tipo: ${field?.type || 'text'})`);
          }
        } else {
          console.warn('⚠️ [CLICKUP] Forma de pagamento não encontrada nos dados');
        }
      }

      if (customFieldsMap.has('produtos')) {
        // Produtos: text (deve ser string, não array/objeto)
        if (Array.isArray(produtos) && produtos.length > 0) {
          // Formatar produtos como string legível
          // Formato: "Produto Teste (1x) - R$ 1,00"
          const produtosTexto = produtos
            .map((p: any) => `${p.nome} (${p.quantidade}x) - R$ ${p.valor}`)
            .join(', '); // Separar por vírgula para múltiplos produtos
          
          await setCustomField('produtos', { value: produtosTexto });
          console.log(`✅ [CLICKUP] Produtos enviados: ${produtosTexto}`);
        } else if (listaProdutosFormatada && listaProdutosFormatada !== 'Produto não especificado') {
          // Fallback: converter formato existente para o formato correto
          const produtosTexto = listaProdutosFormatada
            .replace(/\(Qtd: (\d+)\)/g, '($1x)') // Converter (Qtd: 1) para (1x)
            .replace(/\n/g, ', '); // Substituir quebras de linha por vírgula
          await setCustomField('produtos', { value: produtosTexto });
          console.log(`✅ [CLICKUP] Produtos enviados (fallback): ${produtosTexto}`);
        } else {
          console.warn('⚠️ [CLICKUP] Lista de produtos vazia ou inválida');
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
        // Valor: currency (número decimal, ex: 1.00 para R$ 1,00)
        // valor_total vem como string "1,00" do frontend (formato brasileiro)
        let valorDecimal: number;
        if (typeof valor_total === 'string') {
          // Converter "1,00" → 1.00 (number decimal)
          // Remove tudo exceto números e vírgula, substitui vírgula por ponto
          const valorLimpo = valor_total.replace(/[^\d,]/g, '').replace(',', '.');
          valorDecimal = parseFloat(valorLimpo);
          if (isNaN(valorDecimal)) {
            valorDecimal = 0;
          }
        } else {
          // Se já for número, usar direto (assumir que está em reais)
          valorDecimal = parseFloat(String(valor_total));
          if (isNaN(valorDecimal)) {
            valorDecimal = 0;
          }
        }
        // Enviar como NUMBER decimal (1.00), NÃO multiplicar por 100
        await setCustomField('valor', { value: valorDecimal });
        console.log(`✅ [CLICKUP] Valor enviado: ${valor_total} → ${valorDecimal}`);
      }

      // Preencher Número do Pedido (opcional, mas recomendado para auditoria)
      if (customFieldsMap.has('numero_pedido')) {
        // O tipo pode ser number ou text, dependendo da configuração no ClickUp
        const field = customFieldsMap.get('numero_pedido');
        if (field && field.type === 'number') {
          await setCustomField('numero_pedido', { value: orderNumber });
        } else {
          // Se for text, enviar como string
          await setCustomField('numero_pedido', { value: String(orderNumber) });
        }
        console.log(`✅ [CLICKUP] Número do pedido salvo: ${orderNumber}`);
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


