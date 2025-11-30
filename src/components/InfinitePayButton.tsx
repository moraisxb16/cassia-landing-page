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
    if (!window.InfiniteCheckout) {
      console.warn("InfiniteCheckout não carregou");
      return;
    }

    const payload = {
      name: description,  // nome do item ou descrição final
      amount: Math.round(totalPrice * 100), // valor em centavos
      type: ['pix', 'card'],
    };

    window.InfiniteCheckout.open(payload);
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


