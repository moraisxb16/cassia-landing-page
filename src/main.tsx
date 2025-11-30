
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Verificar se InfiniteCheckout carregou
window.addEventListener('load', () => {
  console.log('Página carregada. Verificando InfiniteCheckout...');
  console.log('window.InfiniteCheckout:', window.InfiniteCheckout);
  
  if (window.InfiniteCheckout) {
    console.log('✅ InfiniteCheckout carregado com sucesso!');
  } else {
    console.warn('⚠️ InfiniteCheckout ainda não está disponível. O script pode estar carregando...');
    // Tentar novamente após um delay
    setTimeout(() => {
      console.log('Verificação após delay - window.InfiniteCheckout:', window.InfiniteCheckout);
    }, 2000);
  }
});

createRoot(document.getElementById('root')!).render(<App />);
  