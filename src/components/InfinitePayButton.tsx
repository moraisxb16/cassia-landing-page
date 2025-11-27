import { useEffect, useState } from 'react';

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

type PaymentType = 'pix' | 'card';

interface InfinitePayButtonProps {
  amount: number;
  description: string;
  types?: PaymentType[]; // quais meios habilitar no checkout (padrão: ['pix', 'card'])
}

export function InfinitePayButton({
  amount,
  description,
  types = ['pix', 'card'],
}: InfinitePayButtonProps) {
  // carrega o script uma vez; não bloqueia o botão, apenas tenta garantir que o script existe
  useEffect(() => {
    const url = 'https://checkout.infinitepay.io/v1';
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${url}"]`);

    if (existing || typeof window !== 'undefined') {
      return;
    }

    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onerror = () => {
      console.error(
        '[InfinitePay] Não foi possível carregar o script do Link Integrado. Verifique o domínio autorizado na InfinitePay.',
      );
    };
    document.body.appendChild(script);

    return () => {
      script.onerror = null;
    };
  }, []);

  function handlePay() {
    if (window.InfiniteCheckout) {
      window.InfiniteCheckout.open({
        name: description,
        amount,
        type: types,
      });
    } else {
      console.warn('InfiniteCheckout ainda não está disponível no window.');
      alert(
        'Não foi possível iniciar o pagamento agora.\n' +
          'Verifique se o domínio atual está autorizado na InfinitePay e tente recarregar a página.',
      );
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


