
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

// Carregar script do InfinitePay dinamicamente se ainda não estiver carregado
function loadInfinitePayScript() {
  // Verificar se o script já existe
  const existingScript = document.querySelector('script[src*="checkout.infinitepay.io"]');
  if (existingScript) {
    console.log('Script InfinitePay já existe no DOM');
    return;
  }

  // Verificar se já está disponível globalmente
  if (window.InfiniteCheckout) {
    console.log('InfiniteCheckout já está disponível');
    return;
  }

  // Criar e adicionar o script
  const script = document.createElement('script');
  script.src = 'https://checkout.infinitepay.io/v1';
  script.async = true;
  script.onload = () => {
    console.log('✅ Script InfinitePay carregado com sucesso!');
    console.log('window.InfiniteCheckout:', window.InfiniteCheckout);
  };
  script.onerror = () => {
    console.error('❌ Erro ao carregar script InfinitePay');
  };
  
  document.head.appendChild(script);
  console.log('Script InfinitePay adicionado ao DOM');
}

// Carregar o script imediatamente
loadInfinitePayScript();

// Verificar se InfiniteCheckout carregou após o load da página
window.addEventListener('load', () => {
  console.log('Página carregada. Verificando InfiniteCheckout...');
  console.log('window.InfiniteCheckout:', window.InfiniteCheckout);
  
  if (window.InfiniteCheckout) {
    console.log('✅ InfiniteCheckout carregado com sucesso!');
  } else {
    console.warn('⚠️ InfiniteCheckout ainda não está disponível. Aguardando...');
    // Tentar novamente após um delay
    setTimeout(() => {
      console.log('Verificação após delay - window.InfiniteCheckout:', window.InfiniteCheckout);
      if (!window.InfiniteCheckout) {
        console.warn('⚠️ InfiniteCheckout ainda não disponível após delay. Tentando recarregar script...');
        loadInfinitePayScript();
      }
    }, 2000);
  }
});

createRoot(document.getElementById('root')!).render(<App />);
  