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

    const payload = {
      name: `Pedido #${order_id} - ${nome_cliente}`,
      description,
      status: 'EM PRODUÇÃO',
    };

    console.log('🚀 Enviando pedido para ClickUp:', JSON.stringify(payload, null, 2));

    const authHeader = CLICKUP_API_TOKEN.startsWith('pk_')
      ? CLICKUP_API_TOKEN
      : (CLICKUP_API_TOKEN.startsWith('Bearer ') ? CLICKUP_API_TOKEN : `Bearer ${CLICKUP_API_TOKEN}`);

    const response = await fetch(
      `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`,
      {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const text = await response.text();
    let result: any;
    try {
      result = JSON.parse(text);
    } catch {
      result = { raw: text };
    }

    console.log('📥 Resposta ClickUp:', response.status, response.statusText, result);

    if (!response.ok) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Erro ao criar task no ClickUp', details: result }),
      };
    }

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

