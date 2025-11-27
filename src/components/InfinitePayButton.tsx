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

interface InfinitePayButtonProps {
  amount: number;
  description: string;
}

export function InfinitePayButton({ amount, description }: InfinitePayButtonProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const url = 'https://checkout.infinitepay.io/v1';
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${url}"]`);

    if (window.InfiniteCheckout) {
      setIsReady(true);
      return;
    }

    if (existing) {
      const onLoad = () => {
        if (window.InfiniteCheckout) {
          setIsReady(true);
        }
      };
      existing.addEventListener('load', onLoad);
      return () => {
        existing.removeEventListener('load', onLoad);
      };
    }

    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = () => {
      if (window.InfiniteCheckout) {
        setIsReady(true);
      }
    };
    script.onerror = () => {
      console.error(
        '[InfinitePay] Não foi possível carregar o script do Link Integrado. Verifique o domínio autorizado na InfinitePay.',
      );
    };
    document.body.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, []);

  function handlePay() {
    if (window.InfiniteCheckout) {
      window.InfiniteCheckout.open({
        name: description,
        amount,
        type: ['pix', 'card'],
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
      disabled={!isReady}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isReady ? 'Finalizar Compra' : 'Carregando pagamento...'}
    </button>
  );
}


