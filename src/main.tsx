
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
function loadInfinitePayScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.InfiniteCheckout) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.infinitepay.io/v1';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Erro ao carregar InfinitePay'));
    document.body.appendChild(script);
  });
}

// Carregar o script ANTES de renderizar o React
loadInfinitePayScript()
  .then(() => {
    console.log('InfinitePay carregado!');
    createRoot(document.getElementById('root')!).render(<App />);
  })
  .catch((error) => {
    console.error('Erro ao carregar InfinitePay:', error);
    // Renderizar mesmo assim para não quebrar a aplicação
    createRoot(document.getElementById('root')!).render(<App />);
  });
  