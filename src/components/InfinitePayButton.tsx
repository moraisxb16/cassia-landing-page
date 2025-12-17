import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    InfiniteCheckout?: {
      open: (options: {
        name: string;
        amount: number; 
        type: Array<"pix" | "card">;
      }) => void;
    };
  }
}

interface InfinitePayButtonProps {
  description: string;
  totalPrice: number;
}

export function InfinitePayButton({ description, totalPrice }: InfinitePayButtonProps) {
  const [loading, setLoading] = useState(true);
  const [sdkReady, setSdkReady] = useState(false);

  // Carregar SDK corretamente
  useEffect(() => {
    let checkInterval: NodeJS.Timeout | null = null;
    let retryInterval: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const checkSDK = () => {
      if (window.InfiniteCheckout) {
        setLoading(false);
        setSdkReady(true);
        console.log("✅ InfiniteCheckout disponível e pronto!");
        console.log("✅ Tipo de InfiniteCheckout:", typeof window.InfiniteCheckout);
        console.log("✅ Métodos disponíveis:", Object.keys(window.InfiniteCheckout));
        if (checkInterval) clearInterval(checkInterval);
        if (retryInterval) clearInterval(retryInterval);
        if (timeoutId) clearTimeout(timeoutId);
        return true;
      }
      return false;
    };

    // Verificar imediatamente se já está disponível
    if (checkSDK()) {
      return;
    }

    // Verificar se o script já existe no DOM (agora no <head> do index.html)
    const existingScript = document.querySelector('script[src*="checkout.infinitepay.io"]');
    
    if (existingScript) {
      console.log("⏳ Script já existe, aguardando SDK...");
      // Se o script já existe, apenas aguardar o SDK aparecer
      checkInterval = setInterval(() => {
        if (checkSDK()) {
          return;
        }
        console.log("⏳ Aguardando InfiniteCheckout...", window.InfiniteCheckout);
      }, 100); // Verificar a cada 100ms (mais rápido)

      // Timeout máximo de 15 segundos
      timeoutId = setTimeout(() => {
        if (!window.InfiniteCheckout) {
          console.warn("⚠️ Timeout: InfiniteCheckout não carregou após 15 segundos");
          console.warn("⚠️ Verifique se o domínio cassiacorviniy.com.br está autorizado na InfinitePay");
          console.warn("⚠️ Continuando verificação em background...");
          setLoading(false); // Liberar o botão mesmo assim
          // Continuar verificando em background (sem bloquear)
          const backgroundCheck = setInterval(() => {
            if (window.InfiniteCheckout) {
              clearInterval(backgroundCheck);
              setSdkReady(true);
              console.log("✅ InfiniteCheckout carregou após o timeout! SDK pronto.");
            }
          }, 500);
          // Limpar após 30 segundos totais
          setTimeout(() => clearInterval(backgroundCheck), 30000);
        } else {
          if (checkInterval) clearInterval(checkInterval);
        }
      }, 15000);
    } else {
      // O script já deve estar no <head> do index.html
      // Mas se não estiver, criar dinamicamente como fallback
      console.log("📦 Script não encontrado no DOM, criando dinamicamente...");
      const script = document.createElement("script");
      script.src = "https://checkout.infinitepay.io/v1";
      script.async = true;

      script.onload = () => {
        console.log("✅ Script InfinitePay carregado com sucesso!");
        console.log("✅ URL do script:", script.src);
        console.log("⏳ Verificando window.InfiniteCheckout...");
        console.log("⏳ window.InfiniteCheckout atual:", window.InfiniteCheckout);
        // Retry automático até o SDK aparecer (mais agressivo)
        retryInterval = setInterval(() => {
          if (checkSDK()) {
            return;
          }
          console.log("⏳ Aguardando InfiniteCheckout após script carregar...", window.InfiniteCheckout);
        }, 100); // Verificar a cada 100ms

        // Timeout máximo de 15 segundos
        timeoutId = setTimeout(() => {
          if (!window.InfiniteCheckout) {
            console.warn("⚠️ Timeout: InfiniteCheckout não carregou após 15 segundos");
            console.warn("⚠️ Verifique se o domínio cassiacorviniy.com.br está autorizado na InfinitePay");
            console.warn("⚠️ Continuando verificação em background...");
            setLoading(false); // Liberar o botão mesmo assim
            // Continuar verificando em background (sem bloquear)
            const backgroundCheck = setInterval(() => {
              if (window.InfiniteCheckout) {
                clearInterval(backgroundCheck);
                setSdkReady(true);
                console.log("✅ InfiniteCheckout carregou após o timeout! SDK pronto.");
              }
            }, 500);
            // Limpar após 30 segundos totais
            setTimeout(() => clearInterval(backgroundCheck), 30000);
          } else {
            if (retryInterval) clearInterval(retryInterval);
          }
        }, 15000);
      };

      script.onerror = (error) => {
        console.error("❌ Erro ao carregar script da InfinitePay");
        console.error("❌ Erro detalhado:", error);
        console.error("❌ URL tentada: https://checkout.infinitepay.io/v1");
        if (error instanceof ErrorEvent) {
          console.error("❌ Tipo de erro:", error.type || "UNKNOWN");
          console.error("❌ Target:", error.target);
        }
        console.error("❌ Possíveis causas:");
        console.error("   1. URL do SDK incorreta ou descontinuada");
        console.error("   2. Domínio não autorizado na InfinitePay");
        console.error("   3. Bloqueadores de script (AdBlock, etc)");
        console.error("   4. Problema de rede/DNS");
        console.error("❌ Ação: Verifique a documentação oficial da InfinitePay para a URL correta do SDK");
        setLoading(false); // Liberar o botão em caso de erro
      };

      // Adicionar ID para facilitar debug
      script.id = "infinite-pay-script";
      document.head.appendChild(script);
      console.log("📦 Script InfinitePay adicionado ao DOM com ID: infinite-pay-script");
      
      // Verificar se o script foi realmente adicionado
      setTimeout(() => {
        const addedScript = document.getElementById("infinite-pay-script");
        if (addedScript) {
          console.log("✅ Script confirmado no DOM");
        } else {
          console.error("❌ Script não foi adicionado ao DOM corretamente");
        }
      }, 100);
    }

    // Cleanup
    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (retryInterval) clearInterval(retryInterval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  function handlePay() {
    // Verificar novamente antes de abrir (última tentativa)
    if (!window.InfiniteCheckout) {
      console.error("❌ InfiniteCheckout não está disponível no momento do clique");
      
      // Tentar uma última vez: verificar se o script existe e aguardar um pouco
      const existingScript = document.querySelector('script[src*="checkout.infinitepay.io"]');
      if (existingScript) {
        console.log("🔄 Script existe, aguardando 1 segundo e tentando novamente...");
        setTimeout(() => {
          if (window.InfiniteCheckout) {
            console.log("✅ InfiniteCheckout apareceu! Abrindo checkout...");
            try {
              window.InfiniteCheckout.open({
                name: description || "Compra na Cássia Corviniy",
                amount: Math.round(totalPrice * 100),
                type: ["pix", "card"],
              });
              console.log("✅ Checkout aberto com sucesso");
            } catch (error) {
              console.error("❌ Erro ao abrir checkout:", error);
              alert("Erro ao abrir o checkout. Tente novamente.");
            }
          } else {
            console.error("❌ InfiniteCheckout ainda não está disponível após espera");
            console.error("❌ Verifique se o domínio cassiacorviniy.com.br está autorizado na InfinitePay");
            alert("O sistema de pagamento não está disponível. Verifique se o domínio está autorizado na InfinitePay ou entre em contato com o suporte.");
          }
        }, 1000);
        return;
      }
      
      console.error("❌ Script não existe no DOM");
      console.error("❌ Verifique se o domínio cassiacorviniy.com.br está autorizado na InfinitePay");
      alert("O sistema de pagamento não está disponível. Verifique se o domínio está autorizado na InfinitePay ou entre em contato com o suporte.");
      return;
    }

    if (loading) {
      alert("O sistema de pagamento ainda está carregando. Aguarde alguns segundos e tente novamente.");
      return;
    }

    try {
      console.log("🚀 Abrindo checkout InfinitePay...");
      console.log("Payload:", {
        name: description || "Compra na Cássia Corviniy",
        amount: Math.round(totalPrice * 100),
        type: ["pix", "card"],
      });
      
      window.InfiniteCheckout.open({
        name: description || "Compra na Cássia Corviniy",
        amount: Math.round(totalPrice * 100),
        type: ["pix", "card"],
      });
      
      console.log("✅ Checkout aberto com sucesso");
    } catch (error) {
      console.error("❌ Erro ao abrir checkout:", error);
      alert("Erro ao abrir o checkout. Verifique o console para mais detalhes.");
    }
  }

  return (
    <button
      type="button"
      onClick={handlePay}
      disabled={loading}
      className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors 
        ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"}`}
    >
      {loading ? "Carregando Pagamento..." : "Finalizar Compra"}
    </button>
  );
}
