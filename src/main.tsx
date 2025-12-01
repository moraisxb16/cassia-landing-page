
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Declaração de tipo para InfiniteCheckout
declare global {
  interface Window {
    InfiniteCheckout?: {
      open: (options: {
        name: string;
        amount: number;
        type: Array<'pix' | 'card'>;
      }) => void;
    };
  }
}

// Carregar script do InfinitePay dinamicamente
function loadInfinitePayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.InfiniteCheckout) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.infinitepay.io/v1';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject('Falha ao carregar InfinitePay');
    document.head.appendChild(script);
  });
}

// Carregar o script ANTES de renderizar o React
loadInfinitePayScript()
  .then(() => {
    console.log('InfinitePay carregado com sucesso!');
    createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch((err) => {
    console.error(err);
    alert('Erro ao carregar sistema de pagamento. Recarregue a página.');
  });
  