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

    // Montar payload mínimo conforme documentação ClickUp
    const payload: any = {
      name: `Pedido #${order_id} - ${nome_cliente}`,
      description,
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

    // Sucesso
    console.log('✅ [CLICKUP] Task criada com sucesso:', result.id);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        task_id: result.id,
        task_name: result.name,
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

