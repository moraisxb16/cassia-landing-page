
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
  // Verificar se já está carregado
  if (window.InfiniteCheckout) {
    console.log('✅ InfiniteCheckout já está disponível');
    return;
  }

  // Verificar se o script já existe no DOM
  const existingScript = document.querySelector('script[src*="checkout.infinitepay.io"]');
  if (existingScript) {
    console.log('⏳ Script InfinitePay já está sendo carregado...');
    return;
  }

  // Criar e adicionar o script
  const script = document.createElement('script');
  script.src = 'https://checkout.infinitepay.io/v1';
  script.async = true;
  script.defer = true;
  
  script.onload = () => {
    console.log('✅ Script InfinitePay carregado com sucesso');
    // Verificar se InfiniteCheckout está disponível após o load
    if (window.InfiniteCheckout) {
      console.log('✅ InfiniteCheckout inicializado e pronto para uso');
    } else {
      console.warn('⚠️ Script carregou mas InfiniteCheckout ainda não está disponível');
    }
  };
  
  script.onerror = () => {
    console.error('❌ Erro ao carregar script InfinitePay');
  };
  
  document.head.appendChild(script);
  console.log('📦 Iniciando carregamento do script InfinitePay...');
}

// Carregar o script após um pequeno delay para garantir que o DOM está pronto
setTimeout(() => {
  loadInfinitePayScript();
}, 100);
  