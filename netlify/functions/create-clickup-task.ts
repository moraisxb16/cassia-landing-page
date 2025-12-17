import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

/**
 * Netlify Function para criar task no ClickUp após pagamento confirmado
 * 
 * Endpoint: POST /.netlify/functions/create-clickup-task
 * 
 * Body esperado:
 * {
 *   order_nsu: string,
 *   transaction_nsu: string,
 *   slug?: string,
 *   capture_method?: string,
 *   amount?: number (em centavos),
 *   receipt_url?: string
 * }
 * 
 * Variáveis de ambiente necessárias:
 * - CLICKUP_API_TOKEN
 * - CLICKUP_WORKSPACE_ID
 * - CLICKUP_LIST_ID (opcional, pode ser passado no body)
 */

interface ClickUpTaskRequest {
  order_nsu: string;
  transaction_nsu: string;
  slug?: string;
  capture_method?: string;
  amount?: number;
  receipt_url?: string;
  // Dados do pedido (vindos do localStorage ou sessionStorage do frontend)
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
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface ClickUpResponse {
  id: string;
  name: string;
  status: {
    status: string;
  };
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
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
    // ============================================
    // VALIDAR VARIÁVEIS DE AMBIENTE
    // ============================================
    const apiToken = process.env.CLICKUP_API_TOKEN;
    const workspaceId = process.env.CLICKUP_WORKSPACE_ID;
    const defaultListId = process.env.CLICKUP_LIST_ID;

    if (!apiToken) {
      console.error('❌ CLICKUP_API_TOKEN não configurado');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Configuração do ClickUp não encontrada',
          details: 'CLICKUP_API_TOKEN não está configurado',
        }),
      };
    }

    if (!workspaceId) {
      console.error('❌ CLICKUP_WORKSPACE_ID não configurado');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Configuração do ClickUp não encontrada',
          details: 'CLICKUP_WORKSPACE_ID não está configurado',
        }),
      };
    }

    // ============================================
    // PARSE DO BODY
    // ============================================
    let body: ClickUpTaskRequest;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (error) {
      console.error('❌ Erro ao fazer parse do body:', error);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Body inválido - JSON malformado' }),
      };
    }

    // Validações obrigatórias
    if (!body.order_nsu || !body.transaction_nsu) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'order_nsu e transaction_nsu são obrigatórios' }),
      };
    }

    // ============================================
    // MONTAR TASK DO CLICKUP
    // ============================================
    // Formatar método de pagamento
    const paymentMethodText = body.capture_method === 'credit_card' 
      ? 'Cartão de Crédito' 
      : body.capture_method === 'pix' 
      ? 'PIX' 
      : body.capture_method || 'Não informado';

    // Formatar valor
    const formattedAmount = body.amount 
      ? `R$ ${(body.amount / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : 'Não informado';

    // Montar descrição da task
    const description = `
**Pedido Confirmado - InfinitePay**

**Dados do Pagamento:**
- Valor: ${formattedAmount}
- Método: ${paymentMethodText}
- Order NSU: ${body.order_nsu}
- Transaction NSU: ${body.transaction_nsu}
${body.slug ? `- Slug: ${body.slug}` : ''}
${body.receipt_url ? `- Comprovante: ${body.receipt_url}` : ''}

**Dados do Cliente:**
${body.customer?.name ? `- Nome: ${body.customer.name}` : ''}
${body.customer?.email ? `- Email: ${body.customer.email}` : ''}
${body.customer?.phone ? `- Telefone: ${body.customer.phone}` : ''}
${body.customer?.cpf ? `- CPF: ${body.customer.cpf}` : ''}

**Endereço:**
${body.address?.street ? `- Rua: ${body.address.street}` : ''}
${body.address?.number ? `- Número: ${body.address.number}` : ''}
${body.address?.city ? `- Cidade: ${body.address.city}` : ''}
${body.address?.state ? `- Estado: ${body.address.state}` : ''}
${body.address?.zip ? `- CEP: ${body.address.zip}` : ''}

**Itens do Pedido:**
${body.items && body.items.length > 0
  ? body.items.map(item => `- ${item.name} x ${item.quantity} = R$ ${(item.price * item.quantity).toFixed(2)}`).join('\n')
  : '- Não informado'
}
    `.trim();

    // Nome da task
    const taskName = body.customer?.name 
      ? `Pedido - ${body.customer.name} - ${formattedAmount}`
      : `Pedido - ${body.order_nsu} - ${formattedAmount}`;

    // List ID (obrigatório para criar task)
    const listId = defaultListId || process.env.CLICKUP_LIST_ID;

    if (!listId) {
      console.error('❌ CLICKUP_LIST_ID não configurado');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Configuração do ClickUp incompleta',
          details: 'CLICKUP_LIST_ID não está configurado',
        }),
      };
    }

    // ============================================
    // CRIAR TASK NO CLICKUP
    // ============================================
    // Estrutura conforme documentação ClickUp API v2
    const clickUpPayload: any = {
      name: taskName,
      description: description,
      status: {
        status: 'to do', // Status inicial
      },
      priority: {
        priority: 3, // Normal (1=Urgent, 2=High, 3=Normal, 4=Low)
      },
      assignees: [], // Array de user IDs (opcional)
      tags: ['pedido', 'infinitepay', paymentMethodText.toLowerCase().replace(/\s+/g, '-')],
      check_required: false,
    };

    console.log('🚀 Criando task no ClickUp...');
    console.log('📦 Payload:', JSON.stringify(clickUpPayload, null, 2));
    console.log('📋 List ID:', listId);
    console.log('🔑 Workspace ID:', workspaceId);

    // URL da API do ClickUp (endpoint correto: POST /api/v2/list/{list_id}/task)
    const clickUpUrl = `https://api.clickup.com/api/v2/list/${listId}/task`;

    const response = await fetch(clickUpUrl, {
      method: 'POST',
      headers: {
        'Authorization': apiToken, // Token completo no header Authorization
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clickUpPayload),
    });

    const responseText = await response.text();
    console.log('📥 Status da resposta ClickUp:', response.status);
    console.log('📥 Body da resposta:', responseText);

    if (!response.ok) {
      let errorDetails: any;
      try {
        errorDetails = JSON.parse(responseText);
      } catch {
        errorDetails = { raw: responseText };
      }

      console.error('❌ Erro na API ClickUp:');
      console.error('❌ Status:', response.status);
      console.error('❌ Body completo:', responseText);

      return {
        statusCode: response.status >= 400 && response.status < 500 ? response.status : 500,
        headers,
        body: JSON.stringify({
          error: 'Erro ao criar task no ClickUp',
          details: errorDetails,
          api_status: response.status,
        }),
      };
    }

    // Parse da resposta de sucesso
    let data: ClickUpResponse;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error('❌ Erro ao fazer parse da resposta:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Resposta inválida da API ClickUp',
          details: 'Não foi possível fazer parse da resposta JSON',
        }),
      };
    }

    console.log('✅ Task criada no ClickUp com sucesso:', data.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        task_id: data.id,
        task_name: data.name,
        message: 'Task criada com sucesso no ClickUp',
      }),
    };
  } catch (error) {
    console.error('❌ Erro inesperado na função:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'N/A');
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : typeof error,
      }),
    };
  }
};

