import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

/**
 * Netlify Function para criar task no ClickUp após pagamento confirmado
 * 
 * Segue EXATAMENTE a documentação oficial ClickUp API v2:
 * https://developer.clickup.com/docs/authentication
 * https://clickup.com/api/clickupreference/operation/CreateTask
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
 *   receipt_url?: string,
 *   customer?: { name, email, phone, cpf, birthDate },
 *   address?: { street, number, city, state, zip },
 *   items?: Array<{ name, quantity, price, type? }>
 * }
 * 
 * Variáveis de ambiente necessárias:
 * - CLICKUP_API_TOKEN
 * - CLICKUP_WORKSPACE_ID: 90132835502
 * - CLICKUP_LIST_ID: 6-901323245019-1
 */

interface ClickUpTaskRequest {
  order_nsu: string;
  transaction_nsu: string;
  slug?: string;
  capture_method?: string;
  amount?: number;
  receipt_url?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    cpf?: string;
    birthDate?: string;
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
    type?: 'product' | 'course' | 'service' | 'mentoring';
  }>;
}

interface ClickUpResponse {
  id: string;
  name: string;
  status: {
    status: string;
    color: string;
    type: string;
    orderindex: number;
  };
}

interface ClickUpCustomField {
  id: string;
  name: string;
  type: string;
}

/**
 * Busca os custom fields da lista para mapear IDs corretos
 */
async function getCustomFields(listId: string, apiToken: string): Promise<Map<string, string>> {
  const fieldMap = new Map<string, string>();
  
  try {
    // Garantir que o token está no formato correto
    const authHeader = apiToken.startsWith('Bearer ') ? apiToken : `Bearer ${apiToken}`;
    
    const response = await fetch(
      `https://api.clickup.com/api/v2/list/${listId}/field`,
      {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.fields && Array.isArray(data.fields)) {
        data.fields.forEach((field: ClickUpCustomField) => {
          const nameLower = field.name.toLowerCase();
          
          // Mapear campos conforme imagens fornecidas
          if (nameLower === 'cpf' || nameLower.includes('cpf')) {
            fieldMap.set('cpf', field.id);
          }
          if (nameLower === 'telefone' || nameLower.includes('telefone')) {
            fieldMap.set('phone', field.id);
          }
          if ((nameLower.includes('data') && nameLower.includes('nascimento')) || nameLower === 'data de nascimento') {
            fieldMap.set('birthDate', field.id);
          }
          if (nameLower === 'endereço completo' || nameLower === 'endereco completo' || (nameLower.includes('endereço') && nameLower.includes('completo'))) {
            fieldMap.set('address', field.id);
          }
          if (nameLower === 'forma de pagamento' || (nameLower.includes('forma') && nameLower.includes('pagamento'))) {
            fieldMap.set('paymentMethod', field.id);
          }
          if (nameLower === 'produtos' || nameLower.includes('produtos')) {
            fieldMap.set('products', field.id);
          }
          if (nameLower === 'valor do atendimento' || nameLower === '$ valor do atendimento' || (nameLower.includes('valor') && nameLower.includes('atendimento'))) {
            fieldMap.set('amount', field.id);
          }
          if (nameLower === 'origem' || nameLower.includes('origem')) {
            fieldMap.set('origin', field.id);
          }
          if (nameLower === 'cursos' || nameLower.includes('cursos')) {
            fieldMap.set('courses', field.id);
          }
          if (nameLower === 'serviços contratados' || nameLower === 'servicos contratados' || (nameLower.includes('serviços') && nameLower.includes('contratados'))) {
            fieldMap.set('services', field.id);
          }
          if (nameLower === 'código do pedido' || nameLower === 'codigo do pedido' || (nameLower.includes('código') && nameLower.includes('pedido')) || (nameLower.includes('codigo') && nameLower.includes('pedido'))) {
            fieldMap.set('orderCode', field.id);
          }
        });
        console.log('✅ [CLICKUP] Custom fields mapeados:', Array.from(fieldMap.entries()));
      }
    } else {
      console.warn('⚠️ Não foi possível buscar custom fields, usando IDs padrão');
    }
  } catch (error) {
    console.warn('⚠️ Erro ao buscar custom fields:', error);
  }

  return fieldMap;
}

/**
 * Busca o status "EM PRODUÇÃO" da lista
 */
async function getStatusId(listId: string, apiToken: string, statusName: string = 'EM PRODUÇÃO'): Promise<string | null> {
  try {
    // Garantir que o token está no formato correto
    const authHeader = apiToken.startsWith('Bearer ') ? apiToken : `Bearer ${apiToken}`;
    
    const response = await fetch(
      `https://api.clickup.com/api/v2/list/${listId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.statuses && Array.isArray(data.statuses)) {
        const status = data.statuses.find((s: any) => 
          s.status?.toLowerCase() === statusName.toLowerCase()
        );
        if (status) {
          console.log(`✅ [CLICKUP] Status "${statusName}" encontrado:`, status.status);
          console.log(`✅ [CLICKUP] Status completo:`, JSON.stringify(status));
          // Retornar o status completo (objeto) ou apenas o status string conforme necessário
          return status.status; // Retorna a string do status
        } else {
          console.warn(`⚠️ [CLICKUP] Status "${statusName}" não encontrado. Status disponíveis:`, data.statuses.map((s: any) => s.status));
        }
      }
    } else {
      const errorText = await response.text();
      console.warn(`⚠️ [CLICKUP] Erro ao buscar status da lista:`, response.status, errorText);
    }
  } catch (error) {
    console.warn('⚠️ Erro ao buscar status:', error);
  }

  return null;
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
    const workspaceId = process.env.CLICKUP_WORKSPACE_ID || '90132835502';
    const listId = process.env.CLICKUP_LIST_ID || '6-901323245019-1';

    console.log('🔍 [CLICKUP] Verificando configurações ClickUp...');
    console.log('🔍 [CLICKUP] API Token existe?', !!apiToken);
    console.log('🔍 [CLICKUP] Workspace ID:', workspaceId);
    console.log('🔍 [CLICKUP] List ID:', listId);
    console.log('🔍 [CLICKUP] Timestamp:', new Date().toISOString());

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
    // PARSE DO BODY
    // ============================================
    console.log('📥 [CLICKUP] Recebendo requisição...');
    console.log('📥 [CLICKUP] Body recebido (primeiros 500 chars):', (event.body || '').substring(0, 500));
    
    let body: ClickUpTaskRequest;
    try {
      body = JSON.parse(event.body || '{}');
      console.log('✅ [CLICKUP] Body parseado com sucesso');
      console.log('📋 [CLICKUP] Dados do pedido:', {
        order_nsu: body.order_nsu,
        transaction_nsu: body.transaction_nsu,
        customer_name: body.customer?.name,
        items_count: body.items?.length || 0,
      });
    } catch (error) {
      console.error('❌ [CLICKUP] Erro ao fazer parse do body:', error);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Body inválido - JSON malformado' }),
      };
    }

    // Validações obrigatórias
    if (!body.order_nsu || !body.transaction_nsu) {
      console.error('❌ [CLICKUP] order_nsu ou transaction_nsu ausentes');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'order_nsu e transaction_nsu são obrigatórios' }),
      };
    }

    if (!body.customer?.name) {
      console.error('❌ [CLICKUP] Nome do cliente ausente');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Nome do cliente é obrigatório' }),
      };
    }

    console.log('✅ [CLICKUP] Validações básicas passadas');

    // ============================================
    // BUSCAR STATUS E CUSTOM FIELDS
    // ============================================
    console.log('🔍 [CLICKUP] Buscando status "EM PRODUÇÃO" e custom fields...');
    const [statusId, customFields] = await Promise.all([
      getStatusId(listId, apiToken, 'EM PRODUÇÃO'),
      getCustomFields(listId, apiToken),
    ]);
    console.log('✅ [CLICKUP] Status ID:', statusId || 'Não encontrado');
    console.log('✅ [CLICKUP] Custom fields encontrados:', customFields.size);

    // ============================================
    // MONTAR TASK DO CLICKUP
    // ============================================
    // Nome da tarefa: "Pedido - {NOME_COMPLETO_DO_CLIENTE}" conforme especificado
    const taskName = `Pedido - ${body.customer.name.trim()}`;

    // Formatar método de pagamento
    const paymentMethodText = body.capture_method === 'credit_card' 
      ? 'Cartão de Crédito' 
      : body.capture_method === 'pix' 
      ? 'PIX' 
      : body.capture_method || 'Não informado';

    // Formatar valor
    const formattedAmount = body.amount 
      ? (body.amount / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : '0.00';

    // Montar lista de produtos (formato: "Nome x Quantidade")
    // Exemplo: "Produto Teste x 2"
    const productsList = body.items && body.items.length > 0
      ? body.items.map(item => {
          return `${item.name} x ${item.quantity}`;
        }).join('\n')
      : 'Não informado';

    // Código do pedido (usar transaction_nsu ou order_nsu)
    const orderCode = body.transaction_nsu || body.order_nsu || 'Não informado';

    // Montar endereço completo
    const fullAddress = body.address
      ? [
          body.address.street,
          body.address.number,
          body.address.city,
          body.address.state,
          body.address.zip,
        ].filter(Boolean).join(', ')
      : 'Não informado';

    // Separar produtos por tipo (Cursos vs Serviços)
    const coursesList: string[] = [];
    const servicesList: string[] = [];
    
    if (body.items && body.items.length > 0) {
      body.items.forEach(item => {
        const itemText = `${item.name} – R$ ${(item.price * item.quantity).toFixed(2)}`;
        if (item.type === 'course' || item.type === 'mentoring') {
          coursesList.push(itemText);
        } else if (item.type === 'service') {
          servicesList.push(itemText);
        } else {
          // Produtos físicos podem ir para serviços ou produtos
          servicesList.push(itemText);
        }
      });
    }

    const coursesText = coursesList.length > 0 ? coursesList.join('\n') : '-';
    const servicesText = servicesList.length > 0 ? servicesList.join('\n') : '-';

    // Descrição da task (opcional, para referência)
    const description = `
**Pedido Confirmado - InfinitePay**

**Dados do Pagamento:**
- Valor Total: R$ ${formattedAmount}
- Forma de Pagamento: ${paymentMethodText}
- Código do Pedido: ${orderCode}
- ID do Pedido: ${body.order_nsu}
- Transaction NSU: ${body.transaction_nsu}
${body.receipt_url ? `- Comprovante: ${body.receipt_url}` : ''}

**Dados do Cliente:**
- Nome Completo: ${body.customer.name}
- Email: ${body.customer.email || 'Não informado'}
- Telefone: ${body.customer.phone || 'Não informado'}
- CPF: ${body.customer.cpf || 'Não informado'}
- Data de Nascimento: ${body.customer.birthDate ? new Date(body.customer.birthDate).toLocaleDateString('pt-BR') : 'Não informado'}

**Endereço:**
${fullAddress}

**Produtos:**
${productsList}

**Origem:** Site
    `.trim();

    // ============================================
    // MONTAR CUSTOM FIELDS
    // ============================================
    const customFieldsArray: Array<{ id: string; value: string | number }> = [];

    // Função auxiliar para adicionar custom field
    const addCustomField = (key: string, value: string | number | null | undefined) => {
      if (value !== null && value !== undefined && value !== '' && customFields.has(key)) {
        customFieldsArray.push({
          id: customFields.get(key)!,
          value: value,
        });
      }
    };

    // Mapear custom fields conforme especificação
    addCustomField('cpf', body.customer?.cpf);
    addCustomField('phone', body.customer?.phone);
    addCustomField('birthDate', body.customer?.birthDate ? new Date(body.customer.birthDate).toLocaleDateString('pt-BR') : null);
    addCustomField('address', fullAddress);
    addCustomField('paymentMethod', paymentMethodText);
    addCustomField('products', productsList);
    addCustomField('amount', formattedAmount); // $ Valor do Atendimento
    addCustomField('origin', 'Site'); // Origem = Site
    addCustomField('courses', coursesText !== '-' ? coursesText : null);
    addCustomField('services', servicesText !== '-' ? servicesText : null);
    
    // Adicionar campo de código do pedido se existir um campo personalizado para isso
    // Nota: Se não houver campo personalizado "Código do Pedido", pode ser adicionado na descrição
    addCustomField('orderCode', orderCode);

    // ============================================
    // CRIAR TASK NO CLICKUP
    // ============================================
    const clickUpPayload: any = {
      name: taskName, // Nome completo do cliente
      description: description,
      // Status: Se encontrado, usar o formato correto. Se não, deixar undefined (usará status padrão da lista)
      ...(statusId ? { status: { status: statusId } } : {}),
      priority: {
        priority: 3, // Normal
      },
      assignees: [],
      tags: ['pedido', 'infinitepay', 'site'],
      check_required: false,
    };

    // Adicionar custom fields se houver
    if (customFieldsArray.length > 0) {
      clickUpPayload.custom_fields = customFieldsArray;
      console.log('📋 Custom fields a serem preenchidos:', customFieldsArray.length);
    } else {
      console.warn('⚠️ Nenhum custom field encontrado para preencher');
    }

    console.log('🚀 [CLICKUP] Criando task no ClickUp...');
    console.log('📦 [CLICKUP] Payload completo:', JSON.stringify(clickUpPayload, null, 2));
    console.log('📋 [CLICKUP] List ID:', listId);
    console.log('🔑 [CLICKUP] Workspace ID:', workspaceId);
    console.log('📊 [CLICKUP] Status:', statusId || 'Não encontrado, usando padrão');
    console.log('👤 [CLICKUP] Nome da tarefa:', taskName);
    console.log('📋 [CLICKUP] Custom fields a preencher:', customFieldsArray.length);

    // URL da API do ClickUp
    const clickUpUrl = `https://api.clickup.com/api/v2/list/${listId}/task`;

    // Garantir que o token está no formato correto (Bearer {token})
    const authHeader = apiToken.startsWith('Bearer ') ? apiToken : `Bearer ${apiToken}`;

    console.log('🔐 [CLICKUP] Token formatado:', authHeader.substring(0, 20) + '...');
    console.log('🌐 [CLICKUP] URL da API:', clickUpUrl);

    const response = await fetch(clickUpUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clickUpPayload),
    });

    const responseText = await response.text();
    console.log('📥 [CLICKUP] Status da resposta:', response.status);
    console.log('📥 [CLICKUP] Status text:', response.statusText);
    console.log('📥 [CLICKUP] Body da resposta (primeiros 1000 chars):', responseText.substring(0, 1000));

    // ============================================
    // TRATAMENTO DE RESPOSTA
    // ============================================
    if (!response.ok) {
      let errorDetails: any;
      try {
        errorDetails = JSON.parse(responseText);
      } catch {
        errorDetails = { raw: responseText };
      }

      console.error('❌ [CLICKUP] Erro na API ClickUp:');
      console.error('❌ [CLICKUP] Status:', response.status);
      console.error('❌ [CLICKUP] Status text:', response.statusText);
      console.error('❌ [CLICKUP] Body completo:', responseText);
      console.error('❌ [CLICKUP] Payload enviado:', JSON.stringify(clickUpPayload, null, 2));
      console.error('❌ [CLICKUP] Headers da resposta:', Object.fromEntries(response.headers.entries()));

      // Mensagens de erro específicas
      let errorMessage = 'Erro ao criar task no ClickUp';
      if (response.status === 400) {
        errorMessage = 'Dados inválidos enviados ao ClickUp';
      } else if (response.status === 401) {
        errorMessage = 'Token de autenticação ClickUp inválido ou expirado';
      } else if (response.status === 422) {
        errorMessage = 'Dados do pedido não podem ser processados pelo ClickUp';
      } else if (response.status === 500) {
        errorMessage = 'Erro interno do ClickUp';
      }

      // Não quebrar o checkout do usuário - apenas logar o erro
      console.error('⚠️ Task não criada no ClickUp, mas checkout do usuário não será afetado');

      return {
        statusCode: response.status >= 400 && response.status < 500 ? response.status : 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: errorMessage,
          details: errorDetails,
          api_status: response.status,
          message: 'Checkout confirmado, mas houve problema ao registrar no ClickUp. Entre em contato com o suporte.',
        }),
      };
    }

    // Parse da resposta de sucesso
    let data: ClickUpResponse;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error('❌ Erro ao fazer parse da resposta:', error);
      console.error('❌ Resposta recebida:', responseText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Resposta inválida da API ClickUp',
          details: 'Não foi possível fazer parse da resposta JSON',
        }),
      };
    }

    if (!data.id) {
      console.error('❌ Resposta da API sem ID de task:', data);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Resposta inválida da API',
          details: 'A API não retornou um ID de task válido',
          response: data,
        }),
      };
    }

    console.log('✅ [CLICKUP] Task criada no ClickUp com sucesso!');
    console.log('✅ [CLICKUP] Task ID:', data.id);
    console.log('✅ [CLICKUP] Task Name:', data.name);
    console.log('✅ [CLICKUP] Status:', data.status?.status);
    console.log('✅ [CLICKUP] Custom fields preenchidos:', customFieldsArray.length);
    console.log('✅ [CLICKUP] Timestamp de conclusão:', new Date().toISOString());

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        task_id: data.id,
        task_name: data.name,
        status: data.status?.status,
        message: 'Task criada com sucesso no ClickUp',
      }),
    };
  } catch (error) {
    console.error('❌ Erro inesperado na função:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'N/A');
    
    // Não quebrar o checkout do usuário
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : typeof error,
      }),
    };
  }
};
