
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Declaração global
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

// Renderiza o React imediatamente
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Carrega o script da InfinitePay depois que o app já carregou
function loadInfinitePayScript() {
  if (window.InfiniteCheckout) return;

  const script = document.createElement('script');
  script.src = 'https://checkout.infinitepay.io/v1';
  script.async = true;
  document.head.appendChild(script);
}

loadInfinitePayScript();
  