import React, { useState } from "react";

interface InfinitePayButtonProps {
  description: string;
  totalPrice: number;
  items?: Array<{ name: string; quantity: number; price: number }>;
  customerData?: {
    name?: string;
    email?: string;
    phone?: string;
    cpf?: string;
  };
}

/**
 * InfinitePayButton - Implementa checkout via Link Integrado (redirecionamento)
 * 
 * A InfinitePay não oferece SDK client-side. Esta implementação usa o Link Integrado,
 * que redireciona o usuário para o checkout hospedado da InfinitePay.
 * 
 * Configuração necessária:
 * 1. Configure o Link Integrado no painel da InfinitePay
 * 2. Defina INFINITEPAY_CHECKOUT_URL com a URL base do checkout
 * 3. Ou configure a URL diretamente na constante abaixo
 */
export function InfinitePayButton({ 
  description, 
  totalPrice,
  items = [],
  customerData = {}
}: InfinitePayButtonProps) {
  const [loading, setLoading] = useState(false);

  /**
   * Gera o link de checkout da InfinitePay usando Link Integrado
   * 
   * Formato esperado pela InfinitePay (Link Integrado):
   * https://checkout.infinitepay.io/pay?amount=XXX&description=XXX&...
   * 
   * Parâmetros comuns:
   * - amount: valor em centavos
   * - description: descrição do pedido
   * - return_url: URL de retorno após pagamento
   * - cancel_url: URL de cancelamento
   * - customer_name, customer_email, customer_phone, customer_document: dados do cliente
   */
  function generateCheckoutLink(): string {
    // URL base do checkout InfinitePay (Link Integrado)
    // IMPORTANTE: Substitua pela URL configurada no seu painel InfinitePay
    // Ou configure a variável de ambiente VITE_INFINITEPAY_CHECKOUT_URL no .env
    const envUrl = (import.meta as any).env?.VITE_INFINITEPAY_CHECKOUT_URL;
    const baseUrl = envUrl || 'https://checkout.infinitepay.io/pay';
    
    const params = new URLSearchParams();
    
    // Valor em centavos (obrigatório)
    params.append('amount', Math.round(totalPrice * 100).toString());
    
    // Descrição do pedido
    params.append('description', description || 'Compra na Cássia Corviniy');
    
    // URLs de retorno (ajuste conforme necessário)
    const returnUrl = `${window.location.origin}/pagamento/sucesso`;
    const cancelUrl = `${window.location.origin}/pagamento/cancelado`;
    params.append('return_url', returnUrl);
    params.append('cancel_url', cancelUrl);
    
    // Dados do cliente (se disponíveis)
    if (customerData.name) {
      params.append('customer_name', customerData.name);
    }
    if (customerData.email) {
      params.append('customer_email', customerData.email);
    }
    if (customerData.phone) {
      params.append('customer_phone', customerData.phone);
    }
    if (customerData.cpf) {
      params.append('customer_document', customerData.cpf.replace(/\D/g, ''));
    }
    
    // Itens do pedido (se disponíveis)
    if (items.length > 0) {
      items.forEach((item, index) => {
        params.append(`item[${index}][name]`, item.name);
        params.append(`item[${index}][quantity]`, item.quantity.toString());
        params.append(`item[${index}][price]`, Math.round(item.price * 100).toString());
      });
    }
    
    return `${baseUrl}?${params.toString()}`;
  }

  function handlePay() {
    if (loading) return;
    
    setLoading(true);
    
    try {
      console.log("🚀 Redirecionando para checkout InfinitePay...");
      console.log("💰 Valor:", totalPrice);
      console.log("📝 Descrição:", description);
      
      // Gerar link de checkout
      const checkoutUrl = generateCheckoutLink();
      console.log("🔗 URL de checkout:", checkoutUrl);
      
      // Redirecionar para o checkout hospedado da InfinitePay
      window.location.href = checkoutUrl;
      
    } catch (error) {
      console.error("❌ Erro ao gerar link de checkout:", error);
      alert("Erro ao processar o pagamento. Tente novamente ou entre em contato com o suporte.");
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
      {loading ? "Redirecionando..." : "Finalizar Compra"}
    </button>
  );
}
