import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { randomUUID } from 'crypto';

/**
 * Netlify Function para criar link de checkout InfinitePay
 * 
 * Segue EXATAMENTE a documentação oficial:
 * https://ajuda.infinitepay.io/pt-BR/articles/10766888-como-usar-o-checkout-da-infinitepay
 * 
 * Endpoint: POST /.netlify/functions/create-checkout-link
 * 
 * Body esperado do frontend:
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
    price: number; // em reais, será convertido para centavos
  }>;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    cpf?: string;
    birthDate?: string;
    birth_date?: string;
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
    // ============================================
    // VALIDAÇÃO CRÍTICA: INFINITEPAY_HANDLE
    // ============================================
    // O erro "Configuração do gateway de pagamento não encontrada" 
    // ocorre quando process.env.INFINITEPAY_HANDLE está undefined.
    // 
    // CAUSA: Variável de ambiente não configurada no Netlify
    // SOLUÇÃO: Configurar INFINITEPAY_HANDLE no painel Netlify
    //          Site settings > Environment variables > Add variable
    //          Nome: INFINITEPAY_HANDLE
    //          Valor: sua_infinite_tag (SEM o $ no início)
    // ============================================
    const handle = process.env.INFINITEPAY_HANDLE;
    
    // Log detalhado para debug (não expor em produção)
    console.log('🔍 Verificando INFINITEPAY_HANDLE...');
    console.log('🔍 handle existe?', !!handle);
    console.log('🔍 handle length:', handle?.length || 0);
    console.log('🔍 handle value (primeiros 3 chars):', handle ? handle.substring(0, 3) : 'undefined');
    
    if (!handle || handle.trim() === '') {
      console.error('❌ ERRO CRÍTICO: INFINITEPAY_HANDLE não configurado');
      console.error('❌ process.env.INFINITEPAY_HANDLE:', process.env.INFINITEPAY_HANDLE);
      console.error('❌ Todas as variáveis de ambiente disponíveis:', Object.keys(process.env).filter(k => k.includes('INFINITE')));
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Configuração do gateway de pagamento não encontrada',
          details: 'INFINITEPAY_HANDLE não está configurado. Configure no Netlify: Site settings > Environment variables',
        }),
      };
    }

    // Remover $ do início se existir (alguns usuários podem copiar com $)
    const cleanHandle = handle.replace(/^\$/, '').trim();
    if (cleanHandle === '') {
      console.error('❌ ERRO: INFINITEPAY_HANDLE está vazio após limpeza');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Configuração do gateway de pagamento inválida',
          details: 'INFINITEPAY_HANDLE está vazio ou inválido',
        }),
      };
    }

    // ============================================
    // PARSE E VALIDAÇÃO DO BODY
    // ============================================
    let body: CheckoutRequest;
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
    // amount DEVE ser number em centavos (ex: R$ 1,00 = 100)
    if (!body.amount || typeof body.amount !== 'number' || body.amount <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Valor inválido - amount deve ser um número positivo em centavos' }),
      };
    }

    if (!body.description || typeof body.description !== 'string' || body.description.trim() === '') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Descrição obrigatória' }),
      };
    }

    // Validar customer obrigatório com campos mínimos
    if (!body.customer || !body.customer.name || !body.customer.email || !body.customer.phone || !body.customer.cpf) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Customer obrigatório com name, email, phone e cpf' }),
      };
    }

    // ============================================
    // MONTAR PAYLOAD CONFORME DOCUMENTAÇÃO OFICIAL
    // ============================================
    // Documentação: https://ajuda.infinitepay.io/pt-BR/articles/10766888-como-usar-o-checkout-da-infinitepay
    // 
    // Campos obrigatórios:
    // - handle: string (InfiniteTag SEM o $)
    // - redirect_url: string (URL de retorno após pagamento)
    // - order_nsu: string (identificador único do pedido)
    // - items: array com { quantity, price (em centavos), description }
    // 
    // Campos opcionais:
    // - customer: { name, email, phone_number }
    // - address: { cep, number, complement }
    // ============================================

    // Gerar order_nsu único (obrigatório pela API)
    const orderNsu = randomUUID();

    // URLs de retorno
    const origin = event.headers.origin || event.headers.referer || 'https://cassiacorviniy.com.br';
    const baseUrl = origin.replace(/\/$/, '');
    const redirectUrl = `${baseUrl}/pagamento/sucesso`;
    const cancelUrl = `${baseUrl}/pagamento/cancelado`;

    // Montar payload base conforme documentação
    const payload: any = {
      handle: cleanHandle,
      redirect_url: redirectUrl,
      cancel_url: cancelUrl, // URL de cancelamento
      order_nsu: orderNsu,
    };

    // ============================================
    // ITEMS (obrigatório conforme documentação)
    // ============================================
    // A documentação exige items com:
    // - quantity: number
    // - price: number (em centavos) - JÁ VEM EM CENTAVOS DO FRONTEND
    // - description: string
    // ============================================
    if (body.items && body.items.length > 0) {
      payload.items = body.items.map((item) => ({
        quantity: item.quantity,
        price: Math.round(item.price), // JÁ está em centavos, não multiplicar
        description: item.name || body.description, // usar name como description
      }));
    } else {
      // Se não houver items, criar um item único com o total
      payload.items = [
        {
          quantity: 1,
          price: Math.round(body.amount), // já está em centavos
          description: body.description,
        },
      ];
    }

    // ============================================
    // CUSTOMER (obrigatório conforme requisitos)
    // ============================================
    // Campos obrigatórios:
    // - name: string
    // - email: string
    // - phone_number: string (formato: +5511999887766)
    // - cpf: string (apenas números)
    // - birth_date: string (formato YYYY-MM-DD)
    // ============================================
    const customer: any = {
      name: body.customer.name.trim(),
      email: body.customer.email.trim(),
    };

    // Formatar phone_number: remover caracteres não numéricos
    let phoneNumber = body.customer.phone.replace(/\D/g, '');
    // Adicionar +55 se não começar com código do país
    if (!phoneNumber.startsWith('55')) {
      phoneNumber = '55' + phoneNumber;
    }
    // Adicionar + no início
    customer.phone_number = '+' + phoneNumber;

    // CPF: remover pontos e traços (apenas números)
    customer.cpf = body.customer.cpf.replace(/\D/g, '');

    // birth_date: converter para formato YYYY-MM-DD
    if (body.customer.birthDate) {
      let birthDateStr = body.customer.birthDate.trim();
      // Se vier no formato DD/MM/YYYY, converter para YYYY-MM-DD
      if (birthDateStr.includes('/')) {
        const parts = birthDateStr.split('/');
        if (parts.length === 3) {
          // DD/MM/YYYY → YYYY-MM-DD
          birthDateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }
      // Se já vier no formato YYYY-MM-DD, usar direto
      customer.birth_date = birthDateStr;
    } else if (body.customer.birth_date) {
      // Se vier como birth_date direto
      let birthDateStr = body.customer.birth_date.trim();
      if (birthDateStr.includes('/')) {
        const parts = birthDateStr.split('/');
        if (parts.length === 3) {
          birthDateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }
      customer.birth_date = birthDateStr;
    }

    payload.customer = customer;

    // ============================================
    // ADDRESS (opcional conforme documentação)
    // ============================================
    // A documentação exige address como objeto com:
    // - cep: string (apenas números)
    // - number: string
    // - complement: string (opcional)
    // ============================================
    if (body.address) {
      const address: any = {};
      
      if (body.address.zip) {
        // CEP: apenas números
        address.cep = body.address.zip.replace(/\D/g, '');
      }
      
      if (body.address.number) {
        address.number = body.address.number.trim();
      }
      
      // Complement: combinar street + city + state se disponível
      const complementParts: string[] = [];
      if (body.address.street) complementParts.push(body.address.street);
      if (body.address.city) complementParts.push(body.address.city);
      if (body.address.state) complementParts.push(body.address.state);
      
      if (complementParts.length > 0) {
        address.complement = complementParts.join(', ');
      }
      
      // Só adicionar address se tiver pelo menos cep ou number
      if (address.cep || address.number) {
        payload.address = address;
      }
    }

    // ============================================
    // CHAMAR API OFICIAL INFINITEPAY
    // ============================================
    console.log('🚀 Chamando API InfinitePay...');
    console.log('📦 Payload completo:', JSON.stringify(payload, null, 2));
    console.log('🔗 Endpoint: https://api.infinitepay.io/invoices/public/checkout/links');

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

    // ============================================
    // TRATAMENTO DE RESPOSTA
    // ============================================
    const responseText = await response.text();
    console.log('📥 Status da resposta:', response.status);
    console.log('📥 Body da resposta:', responseText);

    if (!response.ok) {
      // Tentar fazer parse do erro
      let errorDetails: any;
      try {
        errorDetails = JSON.parse(responseText);
      } catch {
        errorDetails = { raw: responseText };
      }

      // Logar erro REAL da InfinitePay (não mascarar)
      console.error('❌ [INFINITEPAY] Erro na API:');
      console.error('❌ [INFINITEPAY] Status HTTP:', response.status);
      console.error('❌ [INFINITEPAY] Status Text:', response.statusText);
      console.error('❌ [INFINITEPAY] Erro REAL da InfinitePay:', errorDetails);
      console.error('❌ [INFINITEPAY] Headers da resposta:', Object.fromEntries(response.headers.entries()));
      console.error('❌ [INFINITEPAY] Payload enviado:', JSON.stringify(payload, null, 2));

      return {
        statusCode: response.status >= 400 && response.status < 500 ? response.status : 500,
        headers,
        body: JSON.stringify({
          error: errorDetails.message || errorDetails.error || 'Erro ao gerar link de checkout',
          infinitepay_error: errorDetails, // Erro real da InfinitePay
          api_status: response.status,
        }),
      };
    }

    // Parse da resposta de sucesso
    let data: InfinitePayResponse;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error('❌ Erro ao fazer parse da resposta:', error);
      console.error('❌ Resposta recebida:', responseText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Resposta inválida da API InfinitePay',
          details: 'Não foi possível fazer parse da resposta JSON',
        }),
      };
    }

    if (!data.url || typeof data.url !== 'string') {
      console.error('❌ Resposta da API sem URL válida:', data);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Resposta inválida da API',
          details: 'A API não retornou uma URL válida',
          response: data,
        }),
      };
    }

    console.log('✅ Link gerado com sucesso:', data.url);
    console.log('✅ order_nsu:', orderNsu);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        url: data.url,
        order_nsu: orderNsu, // retornar também para possível uso futuro
      }),
    };
  } catch (error) {
    // ============================================
    // TRATAMENTO DE ERROS GERAIS
    // ============================================
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
