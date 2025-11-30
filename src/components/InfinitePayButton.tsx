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
  function handlePay(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('handlePay chamado');
    console.log('window.InfiniteCheckout:', window.InfiniteCheckout);
    console.log('totalPrice:', totalPrice);
    console.log('description:', description);

    if (!window.InfiniteCheckout) {
      console.error("InfiniteCheckout não carregou. Verifique se o script está no index.html");
      alert("Erro: InfiniteCheckout não está disponível. Verifique o console para mais detalhes.");
      return;
    }

    const payload = {
      name: description,  // nome do item ou descrição final
      amount: Math.round(totalPrice * 100), // valor em centavos
      type: ['pix', 'card'],
    };

    console.log('Payload:', payload);
    
    try {
      window.InfiniteCheckout.open(payload);
      console.log('InfiniteCheckout.open chamado com sucesso');
    } catch (error) {
      console.error('Erro ao abrir InfiniteCheckout:', error);
      alert("Erro ao abrir o checkout. Verifique o console para mais detalhes.");
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


