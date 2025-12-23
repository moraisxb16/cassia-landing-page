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

  try {
    const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;
    const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID || '6-901323245019-1';

    if (!CLICKUP_API_TOKEN || !CLICKUP_LIST_ID) {
      console.error('❌ Variáveis do ClickUp ausentes');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Configuração do ClickUp ausente' }),
      };
    }

    let data: any;
    try {
      data = JSON.parse(event.body || '{}');
    } catch (error) {
      console.error('❌ Body inválido:', error);
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Body inválido' }) };
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
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'order_id e nome_cliente são obrigatórios' }),
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
    const sanitizedToken = CLICKUP_API_TOKEN.trim().replace(/\s+/g, '');
    const authHeader = sanitizedToken;

    const clickupUrl = `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`;

    // Montar payload mínimo (sem status por enquanto - pode não existir na lista)
    const payload: any = {
      name: `Pedido #${order_id} - ${nome_cliente}`,
      description,
    };

    // Adicionar status "EM PRODUÇÃO" (conforme status existente na lista)
    // O status será testado e, se retornar erro, será removido
    payload.status = 'EM PRODUÇÃO';

    // Headers da requisição
    const requestHeaders = {
      Authorization: authHeader,
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
      // Se erro 400 e for relacionado ao status, tentar sem status
      if (response.status === 400 && result.err && result.err.includes && result.err.includes('status')) {
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
          return {
            statusCode: retryResponse.status >= 400 && retryResponse.status < 500 ? retryResponse.status : 500,
            headers,
            body: JSON.stringify({
              success: false,
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

      // Retornar erro real do ClickUp
      return {
        statusCode: response.status >= 400 && response.status < 500 ? response.status : 500,
        headers,
        body: JSON.stringify({
          success: false,
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
    console.error('❌ Erro interno ClickUp:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro interno', details: error instanceof Error ? error.message : String(error) }),
    };
  }
};

