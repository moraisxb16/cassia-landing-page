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
    // - quantity: number (inteiro positivo)
    // - price: number (em centavos, inteiro positivo)
    // - description: string (não vazio)
    // ============================================
    if (body.items && body.items.length > 0) {
      payload.items = body.items.map((item) => {
        // Validar e garantir valores válidos
        const quantity = Math.max(1, Math.round(item.quantity || 1));
        const price = Math.max(1, Math.round((item.price || 0) * 100)); // converter reais para centavos
        const description = (item.name || body.description || 'Item').trim();
        
        if (!description || description.length === 0) {
          throw new Error('Descrição do item não pode estar vazia');
        }
        
        return {
          quantity,
          price,
          description,
        };
      });
    } else {
      // Se não houver items, criar um item único com o total
      const description = (body.description || 'Compra').trim();
      if (!description || description.length === 0) {
        throw new Error('Descrição do pedido não pode estar vazia');
      }
      
      payload.items = [
        {
          quantity: 1,
          price: Math.max(1, body.amount), // já está em centavos, garantir mínimo de 1
          description,
        },
      ];
    }

    // ============================================
    // CUSTOMER (opcional conforme documentação)
    // ============================================
    // A documentação exige customer como objeto com:
    // - name: string
    // - email: string
    // - phone_number: string (formato: +5511999887766)
    // ============================================
    if (body.customer) {
      const customer: any = {};
      
      if (body.customer.name) {
        customer.name = body.customer.name.trim();
      }
      
      if (body.customer.email) {
        customer.email = body.customer.email.trim();
      }
      
      if (body.customer.phone) {
        // Formatar phone_number: remover caracteres não numéricos
        let phoneNumber = body.customer.phone.replace(/\D/g, '');
        
        // Validar tamanho mínimo (10 dígitos para telefone brasileiro)
        if (phoneNumber.length < 10) {
          console.warn('⚠️ Telefone muito curto, pode causar erro na API');
        }
        
        // Adicionar +55 se não começar com código do país
        if (!phoneNumber.startsWith('55')) {
          phoneNumber = '55' + phoneNumber;
        }
        // Adicionar + no início
        customer.phone_number = '+' + phoneNumber;
        
        // Validar formato final (deve ter pelo menos +5511... = 13 caracteres)
        if (customer.phone_number.length < 13) {
          console.warn('⚠️ Telefone formatado pode estar inválido:', customer.phone_number);
        }
      }
      
      // Só adicionar customer se tiver pelo menos um campo
      if (Object.keys(customer).length > 0) {
        payload.customer = customer;
      }
    }

    // ============================================
    // ADDRESS (opcional conforme documentação)
    // ============================================
    // A documentação exige address como objeto com:
    // - cep: string (apenas números, 8 dígitos)
    // - number: string
    // - complement: string (opcional)
    // ============================================
    if (body.address) {
      const address: any = {};
      
      if (body.address.zip) {
        // CEP: apenas números, garantir 8 dígitos
        let cep = body.address.zip.replace(/\D/g, '');
        // Se tiver menos de 8 dígitos, preencher com zeros à esquerda
        if (cep.length < 8) {
          cep = cep.padStart(8, '0');
        }
        // Se tiver mais de 8 dígitos, pegar apenas os primeiros 8
        if (cep.length > 8) {
          cep = cep.substring(0, 8);
        }
        address.cep = cep;
      }
      
      if (body.address.number) {
        address.number = body.address.number.trim();
      }
      
      // Complement: combinar street + city + state se disponível
      const complementParts: string[] = [];
      if (body.address.street) complementParts.push(body.address.street.trim());
      if (body.address.city) complementParts.push(body.address.city.trim());
      if (body.address.state) complementParts.push(body.address.state.trim().toUpperCase());
      
      if (complementParts.length > 0) {
        address.complement = complementParts.join(', ');
      }
      
      // Só adicionar address se tiver pelo menos cep (obrigatório para InfinitePay)
      if (address.cep && address.cep.length === 8) {
        payload.address = address;
      } else if (body.address.zip) {
        console.warn('⚠️ CEP inválido ou incompleto, não adicionando address ao payload');
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

      console.error('❌ Erro na API InfinitePay:');
      console.error('❌ Status:', response.status);
      console.error('❌ Status Text:', response.statusText);
      console.error('❌ Headers:', Object.fromEntries(response.headers.entries()));
      console.error('❌ Body completo:', responseText);
      console.error('❌ Payload enviado:', JSON.stringify(payload, null, 2));
      console.error('❌ Handle usado:', cleanHandle);
      console.error('❌ Order NSU:', orderNsu);
      console.error('❌ Redirect URL:', redirectUrl);
      console.error('❌ Cancel URL:', cancelUrl);

      // Mensagem de erro mais específica para 422
      let errorMessage = 'Erro ao gerar link de checkout';
      if (response.status === 422) {
        errorMessage = errorDetails.message || errorDetails.error || 'Dados inválidos enviados para a InfinitePay. Verifique os logs para mais detalhes.';
        console.error('❌ Erro 422 - Possíveis causas:');
        console.error('   - Handle inválido ou não autorizado');
        console.error('   - Formato de dados incorreto');
        console.error('   - Campos obrigatórios faltando');
        console.error('   - Valores inválidos (ex: CEP, telefone)');
      }

      return {
        statusCode: response.status >= 400 && response.status < 500 ? response.status : 500,
        headers,
        body: JSON.stringify({
          error: errorMessage,
          details: errorDetails,
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
