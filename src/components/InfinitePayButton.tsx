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

    // Verificar se o script já existe no DOM
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
        if (checkInterval) clearInterval(checkInterval);
        if (!window.InfiniteCheckout) {
          console.warn("⚠️ Timeout: InfiniteCheckout não carregou após 15 segundos");
          console.warn("⚠️ Verifique se o domínio está autorizado na InfinitePay");
          setLoading(false); // Liberar o botão mesmo assim
        }
      }, 15000);
    } else {
      // Criar novo script se não existir
      console.log("📦 Criando script InfinitePay...");
      const script = document.createElement("script");
      script.src = "https://checkout.infinitepay.io/v1";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log("✅ Script InfinitePay carregado, aguardando SDK...");
        // Retry automático até o SDK aparecer (mais agressivo)
        retryInterval = setInterval(() => {
          if (checkSDK()) {
            return;
          }
          console.log("⏳ Aguardando InfiniteCheckout após script carregar...", window.InfiniteCheckout);
        }, 100); // Verificar a cada 100ms

        // Timeout máximo de 15 segundos
        timeoutId = setTimeout(() => {
          if (retryInterval) clearInterval(retryInterval);
          if (!window.InfiniteCheckout) {
            console.warn("⚠️ Timeout: InfiniteCheckout não carregou após 15 segundos");
            console.warn("⚠️ Verifique se o domínio cassiacorviniy.com.br está autorizado na InfinitePay");
            setLoading(false); // Liberar o botão mesmo assim
          }
        }, 15000);
      };

      script.onerror = () => {
        console.error("❌ Erro ao carregar script da InfinitePay");
        console.error("❌ Verifique se o domínio está autorizado e se há bloqueadores de script");
        setLoading(false); // Liberar o botão em caso de erro
      };

      document.head.appendChild(script);
    }

    // Cleanup
    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (retryInterval) clearInterval(retryInterval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  function handlePay() {
    // Verificar novamente antes de abrir
    if (!window.InfiniteCheckout) {
      console.error("❌ InfiniteCheckout não está disponível");
      console.error("❌ Verifique no console se o script carregou corretamente");
      console.error("❌ Verifique se o domínio cassiacorviniy.com.br está autorizado na InfinitePay");
      alert("O sistema de pagamento não está disponível. Verifique o console para mais detalhes ou entre em contato com o suporte.");
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
