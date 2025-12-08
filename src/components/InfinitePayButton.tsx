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

  // Carregar SDK corretamente
  useEffect(() => {
    // Verificar se já está disponível
    if (window.InfiniteCheckout) {
      setLoading(false);
      console.log("✅ InfiniteCheckout já está disponível");
      return;
    }

    // Verificar se o script já existe no DOM
    const existingScript = document.querySelector('script[src*="checkout.infinitepay.io"]');
    if (existingScript) {
      console.log("⏳ Script já existe, aguardando SDK...");
      // Se o script já existe, apenas aguardar o SDK aparecer
      const checkInterval = setInterval(() => {
        if (window.InfiniteCheckout) {
          clearInterval(checkInterval);
          setLoading(false);
          console.log("✅ InfinitePay carregado com sucesso (script já existia)");
        }
      }, 200);

      // Timeout máximo de 10 segundos
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.InfiniteCheckout) {
          console.warn("⚠️ Timeout: InfiniteCheckout não carregou após 10 segundos");
          setLoading(false); // Liberar o botão mesmo assim
        }
      }, 10000);

      return () => clearInterval(checkInterval);
    }

    // Criar novo script se não existir
    const script = document.createElement("script");
    script.src = "https://checkout.infinitepay.io/v1";
    script.async = true;

    let retryInterval: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    script.onload = () => {
      console.log("✅ Script InfinitePay carregado, aguardando SDK...");
      // Retry automático até o SDK aparecer
      retryInterval = setInterval(() => {
        if (window.InfiniteCheckout) {
          if (retryInterval) clearInterval(retryInterval);
          if (timeoutId) clearTimeout(timeoutId);
          setLoading(false);
          console.log("✅ InfinitePay carregado com sucesso");
        }
      }, 200);

      // Timeout máximo de 10 segundos
      timeoutId = setTimeout(() => {
        if (retryInterval) clearInterval(retryInterval);
        if (!window.InfiniteCheckout) {
          console.warn("⚠️ Timeout: InfiniteCheckout não carregou após 10 segundos");
          setLoading(false); // Liberar o botão mesmo assim
        }
      }, 10000);
    };

    script.onerror = () => {
      console.error("❌ Erro ao carregar script da InfinitePay");
      setLoading(false); // Liberar o botão em caso de erro
    };

    document.head.appendChild(script);
    console.log("📦 Iniciando carregamento do script InfinitePay...");

    // Cleanup
    return () => {
      if (retryInterval) clearInterval(retryInterval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  function handlePay() {
    if (loading || !window.InfiniteCheckout) {
      alert("O sistema de pagamento ainda está carregando. Aguarde alguns segundos e tente novamente.");
      return;
    }

    try {
      window.InfiniteCheckout.open({
        name: description || "Compra na Cássia Corviniy",
        amount: Math.round(totalPrice * 100),
        type: ["pix", "card"],
      });
    } catch (error) {
      console.error("Erro ao abrir checkout:", error);
      alert("Erro ao abrir o checkout. Tente novamente.");
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
