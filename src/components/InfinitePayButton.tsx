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
  async function handlePay() {
    if (!window.InfiniteCheckout) {
      alert("InfiniteCheckout ainda não carregou. Tente novamente em 1 segundo.");
      return;
    }

    window.InfiniteCheckout.open({
      name: description,
      amount: Math.round(totalPrice * 100),
      type: ['pix', 'card'],
    });
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


