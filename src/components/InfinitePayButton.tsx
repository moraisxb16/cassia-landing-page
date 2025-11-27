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
  function handlePay() {
    if (window.InfiniteCheckout) {
      window.InfiniteCheckout.open({
        name: description,
        amount,
        type: ['pix', 'card'],
      });
    } else {
      console.warn('InfiniteCheckout não carregou');
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


