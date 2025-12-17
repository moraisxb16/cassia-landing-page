import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';

/**
 * Página de sucesso do pagamento
 * 
 * Recebe parâmetros da InfinitePay:
 * - receipt_url: Link do comprovante
 * - order_nsu: ID do pedido no sistema
 * - slug: Código da fatura na InfinitePay
 * - capture_method: Método de pagamento (credit_card ou pix)
 * - transaction_nsu: ID único da transação
 * - amount: Valor pago
 */
export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parâmetros retornados pela InfinitePay
  const receiptUrl = searchParams.get('receipt_url');
  const orderNsu = searchParams.get('order_nsu');
  const slug = searchParams.get('slug');
  const captureMethod = searchParams.get('capture_method');
  const transactionNsu = searchParams.get('transaction_nsu');
  const amount = searchParams.get('amount');

  useEffect(() => {
    // Validar se temos os parâmetros mínimos
    if (!orderNsu || !transactionNsu) {
      setError('Parâmetros de pagamento inválidos');
      setLoading(false);
      return;
    }

    // Chamar função serverless para criar task no ClickUp
    createClickUpTask();
  }, []);

  async function createClickUpTask() {
    try {
      console.log('🚀 Criando task no ClickUp...');
      
      // Buscar dados do pedido do localStorage
      const pendingOrderStr = localStorage.getItem('pendingOrder');
      let pendingOrder: any = null;
      
      if (pendingOrderStr) {
        try {
          pendingOrder = JSON.parse(pendingOrderStr);
          // Limpar localStorage após usar
          localStorage.removeItem('pendingOrder');
        } catch (e) {
          console.warn('⚠️ Erro ao fazer parse dos dados do pedido:', e);
        }
      }

      // Montar dados do pedido para ClickUp
      const orderData = {
        order_nsu: orderNsu,
        transaction_nsu: transactionNsu,
        slug: slug,
        capture_method: captureMethod,
        amount: amount ? parseInt(amount) : null,
        receipt_url: receiptUrl,
        // Dados do pedido salvos antes do checkout
        customer: pendingOrder?.customer,
        address: pendingOrder?.address,
        items: pendingOrder?.items,
      };

      console.log('📦 Dados do pedido:', orderData);

      // Chamar função serverless
      const response = await fetch('/.netlify/functions/create-clickup-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        console.error('❌ Erro ao criar task no ClickUp:', errorData);
        // Não bloquear o fluxo se o ClickUp falhar
        setError('Pedido confirmado, mas houve um problema ao registrar no sistema. Entre em contato com o suporte.');
      } else {
        const data = await response.json();
        console.log('✅ Task criada no ClickUp:', data);
      }
    } catch (error) {
      console.error('❌ Erro ao criar task no ClickUp:', error);
      // Não bloquear o fluxo se o ClickUp falhar
      setError('Pedido confirmado, mas houve um problema ao registrar no sistema. Entre em contato com o suporte.');
    } finally {
      setLoading(false);
    }
  }

  // Formatar método de pagamento
  const paymentMethodText = captureMethod === 'credit_card' 
    ? 'Cartão de Crédito' 
    : captureMethod === 'pix' 
    ? 'PIX' 
    : captureMethod || 'Pagamento';

  // Formatar valor
  const formattedAmount = amount 
    ? `R$ ${(parseInt(amount) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {loading ? (
          <>
            <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Processando pagamento...
            </h2>
            <p className="text-gray-600">
              Aguarde enquanto confirmamos seu pagamento
            </p>
          </>
        ) : error ? (
          <>
            <CheckCircle2 className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Pagamento Confirmado!
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            {receiptUrl && (
              <a
                href={receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-purple-600 hover:text-purple-700 underline"
              >
                Ver comprovante
              </a>
            )}
            <button
              onClick={() => navigate('/')}
              className="mt-6 w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              Voltar ao início
            </button>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Pagamento Confirmado!
            </h2>
            <p className="text-gray-600 mb-6">
              Seu pagamento foi processado com sucesso
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2 text-sm">
                {formattedAmount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor:</span>
                    <span className="font-semibold text-gray-900">{formattedAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Método:</span>
                  <span className="font-semibold text-gray-900">{paymentMethodText}</span>
                </div>
                {orderNsu && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pedido:</span>
                    <span className="font-mono text-xs text-gray-700">{orderNsu}</span>
                  </div>
                )}
              </div>
            </div>

            {receiptUrl && (
              <a
                href={receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mb-4 text-purple-600 hover:text-purple-700 underline text-sm"
              >
                Ver comprovante de pagamento
              </a>
            )}

            <p className="text-sm text-gray-500 mb-6">
              Você receberá um e-mail de confirmação em breve
            </p>

            <button
              onClick={() => navigate('/')}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              Voltar ao início
            </button>
          </>
        )}
      </div>
    </div>
  );
}

