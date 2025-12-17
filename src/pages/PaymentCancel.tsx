import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

/**
 * Página de cancelamento do pagamento
 * 
 * Exibida quando o usuário cancela o pagamento no checkout da InfinitePay
 */
export function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Pagamento Cancelado
        </h2>
        <p className="text-gray-600 mb-6">
          O pagamento foi cancelado. Você pode tentar novamente quando quiser.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Voltar ao início
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    </div>
  );
}

