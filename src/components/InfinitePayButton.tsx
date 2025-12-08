import React from 'react';

declare global {
  interface Window {
    InfiniteCheckout?: {
      open: (options: {
        name: string;
        amount: number; // em centavos
        type: Array<'pix' | 'card'>;
      }) => void;
    };
  }
}

interface InfinitePayButtonProps {
  description: string;
  totalPrice: number;
}

export function InfinitePayButton({
  description,
  totalPrice,
}: InfinitePayButtonProps) {
  function handlePay() {
    // Verificar se InfiniteCheckout está disponível
    if (!window.InfiniteCheckout) {
      console.warn('⚠️ InfiniteCheckout não está disponível ainda');
      
      // Tentar recarregar o script se não estiver disponível
      const existingScript = document.querySelector('script[src*="checkout.infinitepay.io"]');
      if (!existingScript) {
        console.log('🔄 Tentando recarregar script InfinitePay...');
        const script = document.createElement('script');
        script.src = 'https://checkout.infinitepay.io/v1';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log('✅ Script recarregado, tentando abrir checkout...');
          // Tentar novamente após o script carregar
          setTimeout(() => {
            if (window.InfiniteCheckout) {
              window.InfiniteCheckout.open({
                name: description || 'Compra na Cássia Corviniy',
                amount: Math.round(totalPrice * 100),
                type: ['pix', 'card'],
              });
            } else {
              alert('O sistema de pagamento ainda está inicializando. Por favor, aguarde alguns segundos e tente novamente.');
            }
          }, 500);
        };
        document.head.appendChild(script);
      } else {
        alert('O sistema de pagamento ainda está carregando. Por favor, aguarde alguns segundos e tente novamente.');
      }
      return;
    }

    // Abrir checkout normalmente
    try {
      window.InfiniteCheckout.open({
        name: description || 'Compra na Cássia Corviniy',
        amount: Math.round(totalPrice * 100),
        type: ['pix', 'card'],
      });
      console.log('✅ Checkout InfinitePay aberto com sucesso');
    } catch (error) {
      console.error('❌ Erro ao abrir checkout:', error);
      alert('Erro ao abrir o checkout. Por favor, tente novamente.');
    }
  }

  return (
    <button
      type="button"
      onClick={handlePay}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
    >
      Finalizar Compra
    </button>
  );
}


