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

    const listaProdutos = Array.isArray(produtos) && produtos.length > 0
      ? produtos.map((p: any) => `- ${p.nome} (Qtd: ${p.quantidade}) - R$ ${p.valor}`).join('\n')
      : '-';

    const description = `🛒 NOVO PEDIDO CONFIRMADO

👤 Cliente:
Nome: ${nome_cliente}
Email: ${email || 'Não informado'}
Telefone: ${telefone || 'Não informado'}
Data de nascimento: ${data_nascimento || 'Não informado'}

📦 Endereço:
${endereco_completo || 'Não informado'}

🛍️ Produto(s):
${listaProdutos}

💰 Pagamento:
Valor total: R$ ${valor_total || '0,00'}
Forma de pagamento: ${forma_pagamento || 'Não informado'}

🧾 Pedido:
Código: ${order_id}
Data da compra: ${data_compra || 'Não informado'}`;

    // Montar payload mínimo e compatível com ClickUp
    const payload = {
      name: `Pedido #${order_id} - ${nome_cliente}`,
      description,
      status: 'EM PRODUÇÃO',
    };

    // Preparar token: Personal API Token (pk_...) deve ser usado DIRETAMENTE, SEM Bearer
    const sanitizedToken = CLICKUP_API_TOKEN.trim().replace(/\s+/g, '');
    // NÃO usar Bearer para tokens pk_ - usar token diretamente
    const authHeader = sanitizedToken;

    const clickupUrl = `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`;

    // Logs obrigatórios antes da chamada
    console.log('🚀 [CLICKUP] Iniciando criação de task');
    console.log('🌐 [CLICKUP] URL final:', clickupUrl);
    console.log('📋 [CLICKUP] List ID:', CLICKUP_LIST_ID);
    console.log('🔐 [CLICKUP] Token (primeiros 10 chars):', authHeader.substring(0, 10) + '...');
    console.log('📦 [CLICKUP] Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(clickupUrl, {
      method: 'POST',
      headers: {
        Authorization: authHeader, // Token direto, SEM Bearer
        'Content-Type': 'application/json',
      },
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
    console.log('📥 [CLICKUP] Body completo da resposta:', responseText);

    if (!response.ok) {
      // Retornar erro real do ClickUp
      console.error('❌ [CLICKUP] Erro ao criar task:', result);
      return {
        statusCode: response.status >= 400 && response.status < 500 ? response.status : 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Erro ao criar task no ClickUp',
          clickup_error: result,
          http_status: response.status,
          http_statusText: response.statusText,
        }),
      };
    }

    // Sucesso
    console.log('✅ [CLICKUP] Task criada com sucesso:', result.id);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, taskId: result.id, taskName: result.name }),
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

