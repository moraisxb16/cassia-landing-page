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
    if (window.InfiniteCheckout) {
      setLoading(false);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.infinitepay.io/v1";
    script.async = true;

    script.onload = () => {
      // Retry automático até o SDK aparecer
      const interval = setInterval(() => {
        if (window.InfiniteCheckout) {
          clearInterval(interval);
          setLoading(false);
          console.log("✅ InfinitePay carregado com sucesso");
        }
      }, 200);
    };

    script.onerror = () => {
      console.error("❌ Erro ao carregar script da InfinitePay");
    };

    document.head.appendChild(script);
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
