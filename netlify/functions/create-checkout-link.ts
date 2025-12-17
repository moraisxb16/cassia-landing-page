import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

/**
 * Netlify Function para criar link de checkout InfinitePay
 * 
 * Endpoint: POST /api/create-checkout-link
 * 
 * Body esperado:
 * {
 *   amount: number (em centavos),
 *   description: string,
 *   items?: Array<{ name: string, quantity: number, price: number }>,
 *   customer?: { name?: string, email?: string, phone?: string, cpf?: string },
 *   address?: { street?: string, number?: string, city?: string, state?: string, zip?: string }
 * }
 * 
 * Retorna:
 * {
 *   url: string (URL do checkout InfinitePay)
 * }
 */

interface CheckoutRequest {
  amount: number; // em centavos
  description: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    cpf?: string;
  };
  address?: {
    street?: string;
    number?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
}

interface InfinitePayResponse {
  url: string;
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // Permitir CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Apenas POST permitido
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Validar handle da InfinitePay
    const handle = process.env.INFINITEPAY_HANDLE;
    if (!handle) {
      console.error('❌ INFINITEPAY_HANDLE não configurado');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Configuração do gateway de pagamento não encontrada',
        }),
      };
    }

    // Parse do body
    let body: CheckoutRequest;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Body inválido' }),
      };
    }

    // Validações obrigatórias
    if (!body.amount || body.amount <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Valor inválido' }),
      };
    }

    if (!body.description || body.description.trim() === '') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Descrição obrigatória' }),
      };
    }

    // URLs de retorno
    const origin = event.headers.origin || event.headers.referer || 'https://cassiacorviniy.com.br';
    const baseUrl = origin.replace(/\/$/, '');
    const successUrl = `${baseUrl}/pagamento/sucesso`;
    const cancelUrl = `${baseUrl}/pagamento/cancelado`;

    // Montar payload para API InfinitePay
    const payload: any = {
      handle,
      amount: body.amount,
      description: body.description,
      success_url: successUrl,
      cancel_url: cancelUrl,
    };

    // Adicionar dados do cliente se disponíveis
    if (body.customer) {
      if (body.customer.name) {
        payload.customer_name = body.customer.name;
      }
      if (body.customer.email) {
        payload.customer_email = body.customer.email;
      }
      if (body.customer.phone) {
        payload.customer_phone = body.customer.phone.replace(/\D/g, '');
      }
      if (body.customer.cpf) {
        payload.customer_document = body.customer.cpf.replace(/\D/g, '');
      }
    }

    // Adicionar endereço se disponível
    if (body.address) {
      const addressParts: string[] = [];
      if (body.address.street) addressParts.push(body.address.street);
      if (body.address.number) addressParts.push(body.address.number);
      if (addressParts.length > 0) {
        payload.customer_address = addressParts.join(', ');
      }
      if (body.address.city) {
        payload.customer_city = body.address.city;
      }
      if (body.address.state) {
        payload.customer_state = body.address.state;
      }
      if (body.address.zip) {
        payload.customer_zipcode = body.address.zip.replace(/\D/g, '');
      }
    }

    // Adicionar itens se disponíveis
    if (body.items && body.items.length > 0) {
      payload.items = body.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: Math.round(item.price * 100), // converter para centavos
      }));
    }

    console.log('🚀 Chamando API InfinitePay...');
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));

    // Chamar API InfinitePay
    const response = await fetch(
      'https://api.infinitepay.io/invoices/public/checkout/links',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na API InfinitePay:', response.status, errorText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: 'Erro ao gerar link de checkout',
          details: errorText,
        }),
      };
    }

    const data: InfinitePayResponse = await response.json();

    if (!data.url) {
      console.error('❌ Resposta da API sem URL:', data);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Resposta inválida da API',
        }),
      };
    }

    console.log('✅ Link gerado com sucesso:', data.url);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        url: data.url,
      }),
    };
  } catch (error) {
    console.error('❌ Erro na função:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

