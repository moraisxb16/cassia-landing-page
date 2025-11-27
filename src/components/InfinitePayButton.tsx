import { useEffect } from 'react';

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
  amount: number;
  description: string;
}

export function InfinitePayButton({ amount, description }: InfinitePayButtonProps) {
  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.infinitepay.io/v1"]',
    );
    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://checkout.infinitepay.io/v1';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  function handlePay() {
    if (window.InfiniteCheckout) {
      window.InfiniteCheckout.open({
        name: description,
        amount,
        type: ['pix', 'card'],
      });
    } else {
      // opcional: feedback simples caso o script ainda não tenha carregado
      console.warn('InfiniteCheckout ainda não está disponível no window.');
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


