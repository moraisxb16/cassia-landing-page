import React, { useState } from "react";


interface InfinitePayButtonProps {
  description: string;
  totalPrice: number;
  items?: Array<{ name: string; quantity: number; price: number; type?: 'product' | 'course' | 'service' | 'mentoring' }>;
  customerData?: {
    name?: string;
    email?: string;
    phone?: string;
    cpf?: string;
    birthDate?: string;
  };
  addressData?: {
    street?: string;
    number?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
}

/**
 * InfinitePayButton - Implementa checkout via API oficial InfinitePay
 * 
 * Esta implementação segue a documentação oficial da InfinitePay:
 * - Gera link de checkout via API serverless (Netlify Function)
 * - Redireciona usuário para checkout hospedado
 * - NÃO usa SDK client-side (não existe)
 */
export function InfinitePayButton({ 
  description, 
  totalPrice,
  items = [],
  customerData = {},
  addressData = {}
}: InfinitePayButtonProps) {
  const [loading, setLoading] = useState(false);

  /**
   * Chama a função serverless para gerar link de checkout
   */
  async function createCheckoutLink(): Promise<string> {
    // URL da função serverless (Netlify Functions)
    const envApiUrl = (import.meta as any).env?.VITE_API_BASE_URL;
    const apiUrl = envApiUrl || '/.netlify/functions/create-checkout-link';
    
    const payload = {
      amount: Math.round(totalPrice * 100), // converter para centavos
      description: description || 'Compra na Cássia Corviniy',
      items: items.length > 0 ? items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price, // será convertido para centavos na função
      })) : undefined,
      customer: Object.keys(customerData).length > 0 ? customerData : undefined,
      address: Object.keys(addressData).length > 0 ? addressData : undefined,
    };

    console.log('🚀 Chamando função serverless...');
    console.log('📦 Payload:', payload);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      console.error('❌ Erro na função serverless:', response.status, errorData);
      throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.url) {
      console.error('❌ Resposta sem URL:', data);
      throw new Error('Resposta inválida da API');
    }

    console.log('✅ Link gerado com sucesso:', data.url);
    return data.url;
  }

  async function handlePay() {
    if (loading) return;
    
    // Validar campos obrigatórios
    if (!customerData?.name || !customerData?.email || !customerData?.phone || !customerData?.cpf) {
      alert('Por favor, preencha todos os campos obrigatórios (Nome, Email, Telefone, CPF).');
      return;
    }

    // Validar data de nascimento (obrigatória)
    if (!customerData?.birthDate) {
      alert('Por favor, preencha a data de nascimento. Este campo é obrigatório.');
      return;
    }

    // Validar data de nascimento (não pode ser futura)
    const birthDate = new Date(customerData.birthDate);
    const today = new Date();
    if (birthDate > today) {
      alert('A data de nascimento não pode ser uma data futura.');
      return;
    }

    // Validar idade mínima (apenas log, não bloqueia)
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
    
    if (actualAge < 18) {
      console.warn('⚠️ Cliente menor de 18 anos detectado:', actualAge);
      // Não bloqueia, apenas registra no log
    }

    console.log('✅ Validações passadas. Iniciando checkout...');
    console.log('📋 Dados do cliente:', {
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      cpf: customerData.cpf,
      birthDate: customerData.birthDate,
    });
    
    setLoading(true);
    
    try {
      // Salvar dados do pedido no localStorage para usar na página de sucesso
      const orderData = {
        customer: customerData,
        address: addressData,
        items: items,
        totalPrice: totalPrice,
        description: description,
      };
      localStorage.setItem('pendingOrder', JSON.stringify(orderData));
      console.log('💾 Dados do pedido salvos no localStorage');
      
      // Gerar link via função serverless
      const checkoutUrl = await createCheckoutLink();
      
      // Redirecionar para checkout hospedado
      console.log('🔄 Redirecionando para checkout:', checkoutUrl);
      window.location.href = checkoutUrl;
      
    } catch (error) {
      console.error('❌ Erro ao gerar link de checkout:', error);
      alert(
        error instanceof Error 
          ? `Erro: ${error.message}` 
          : 'Erro ao processar o pagamento. Tente novamente ou entre em contato com o suporte.'
      );
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handlePay}
      disabled={loading}
      className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors 
        ${loading 
          ? "bg-gray-400 cursor-not-allowed" 
          : "bg-purple-600 hover:bg-purple-700 text-white"
        }`}
    >
      {loading ? "Processando..." : "Ir para pagamento"}
    </button>
  );
}
