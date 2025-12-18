import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, Package, Calendar, CreditCard, FileText, User, MapPin, Mail, Phone } from 'lucide-react';
import { motion } from 'motion/react';

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
  const [clickUpError, setClickUpError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

  // Parâmetros retornados pela InfinitePay
  const receiptUrl = searchParams.get('receipt_url');
  const orderNsu = searchParams.get('order_nsu');
  const slug = searchParams.get('slug');
  const captureMethod = searchParams.get('capture_method');
  const transactionNsu = searchParams.get('transaction_nsu');
  const amount = searchParams.get('amount');

  useEffect(() => {
    console.log('📋 Parâmetros recebidos da InfinitePay:', {
      receiptUrl,
      orderNsu,
      slug,
      captureMethod,
      transactionNsu,
      amount,
    });

    // Buscar dados do pedido do localStorage
    const pendingOrderStr = localStorage.getItem('pendingOrder');
    let pendingOrder: any = null;
    
    if (pendingOrderStr) {
      try {
        pendingOrder = JSON.parse(pendingOrderStr);
        console.log('📦 Dados do pedido recuperados:', pendingOrder);
        setOrderData(pendingOrder);
        // Limpar localStorage após usar
        localStorage.removeItem('pendingOrder');
      } catch (e) {
        console.warn('⚠️ Erro ao fazer parse dos dados do pedido:', e);
      }
    }

    // Validar se temos os parâmetros mínimos
    if (!orderNsu || !transactionNsu) {
      console.warn('⚠️ Parâmetros de pagamento incompletos');
      setLoading(false);
      return;
    }

    // Chamar função serverless para criar task no ClickUp
    createClickUpTask(pendingOrder);
  }, []);

  async function createClickUpTask(pendingOrder: any) {
    try {
      console.log('🚀 Iniciando criação de task no ClickUp...');
      
      // Montar dados do pedido para ClickUp
      const clickUpData = {
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

      console.log('📦 Dados enviados para ClickUp:', clickUpData);

      // Chamar função serverless
      const response = await fetch('/.netlify/functions/create-clickup-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clickUpData),
      });

      const responseText = await response.text();
      console.log('📥 Resposta do ClickUp:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
      });

      if (!response.ok) {
        let errorData: any;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { error: responseText };
        }
        console.error('❌ Erro ao criar task no ClickUp:', errorData);
        setClickUpError('Houve um problema ao registrar o pedido no sistema. Entre em contato com o suporte.');
      } else {
        const data = JSON.parse(responseText);
        console.log('✅ Task criada no ClickUp com sucesso:', data);
      }
    } catch (error) {
      console.error('❌ Erro ao criar task no ClickUp:', error);
      setClickUpError('Houve um problema ao registrar o pedido no sistema. Entre em contato com o suporte.');
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
    ? (parseInt(amount) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : null;

  // Formatar data
  const purchaseDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--cassia-purple)]/10 via-white to-[var(--cassia-gold)]/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ boxShadow: 'var(--shadow-glow)' }}
      >
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-16 h-16 text-[var(--cassia-purple)] animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-[var(--cassia-purple-dark)] mb-2">
              Processando pagamento...
            </h2>
            <p className="text-[var(--cassia-purple-dark)]/70">
              Aguarde enquanto confirmamos seu pagamento
            </p>
          </div>
        ) : (
          <>
            {/* Header com ícone de sucesso */}
            <div className="bg-gradient-to-r from-[var(--cassia-purple)] to-[var(--cassia-gold)] p-8 text-center text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <CheckCircle2 className="w-20 h-20 mx-auto mb-4" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-2">Pagamento Confirmado!</h1>
              <p className="text-white/90">Seu pedido foi processado com sucesso</p>
            </div>

            {/* Conteúdo principal */}
            <div className="p-8 space-y-6">
              {/* Aviso sobre ClickUp (se houver erro) */}
              {clickUpError && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">{clickUpError}</p>
                </div>
              )}

              {/* Informações do Cliente */}
              {orderData?.customer && (
                <div className="bg-[var(--cassia-lavender)]/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[var(--cassia-purple-dark)] mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Dados do Cliente
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[var(--cassia-purple-dark)]/70">Nome:</span>
                      <p className="font-semibold text-[var(--cassia-purple-dark)]">{orderData.customer.name}</p>
                    </div>
                    {orderData.customer.email && (
                      <div>
                        <span className="text-[var(--cassia-purple-dark)]/70">Email:</span>
                        <p className="font-semibold text-[var(--cassia-purple-dark)] flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {orderData.customer.email}
                        </p>
                      </div>
                    )}
                    {orderData.customer.phone && (
                      <div>
                        <span className="text-[var(--cassia-purple-dark)]/70">Telefone:</span>
                        <p className="font-semibold text-[var(--cassia-purple-dark)] flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {orderData.customer.phone}
                        </p>
                      </div>
                    )}
                    {orderData.address && (
                      <div className="md:col-span-2">
                        <span className="text-[var(--cassia-purple-dark)]/70">Endereço:</span>
                        <p className="font-semibold text-[var(--cassia-purple-dark)] flex items-start gap-1">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {[
                            orderData.address.street,
                            orderData.address.number,
                            orderData.address.city,
                            orderData.address.state,
                            orderData.address.zip,
                          ].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Produtos Comprados */}
              {orderData?.items && orderData.items.length > 0 && (
                <div className="bg-[var(--cassia-surface)]/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[var(--cassia-purple-dark)] mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Produtos Comprados
                  </h3>
                  <div className="space-y-3">
                    {orderData.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-[var(--cassia-border-soft)] last:border-0">
                        <div className="flex-1">
                          <p className="font-semibold text-[var(--cassia-purple-dark)]">{item.name}</p>
                          <p className="text-sm text-[var(--cassia-purple-dark)]/70">Quantidade: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-[var(--cassia-purple-dark)]">
                          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resumo do Pagamento */}
              <div className="bg-gradient-to-r from-[var(--cassia-purple)]/10 to-[var(--cassia-gold)]/10 rounded-lg p-6 border border-[var(--cassia-purple)]/20">
                <h3 className="text-lg font-semibold text-[var(--cassia-purple-dark)] mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Resumo do Pagamento
                </h3>
                <div className="space-y-3">
                  {formattedAmount && (
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--cassia-purple-dark)]/70">Valor Total:</span>
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--cassia-purple-dark)] to-[var(--cassia-gold)]">
                        R$ {formattedAmount}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--cassia-purple-dark)]/70">Forma de Pagamento:</span>
                    <span className="font-semibold text-[var(--cassia-purple-dark)]">{paymentMethodText}</span>
                  </div>
                  {orderNsu && (
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--cassia-purple-dark)]/70">Código do Pedido:</span>
                      <span className="font-mono text-sm text-[var(--cassia-purple-dark)]">{orderNsu}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--cassia-purple-dark)]/70 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Data da Compra:
                    </span>
                    <span className="font-semibold text-[var(--cassia-purple-dark)]">{purchaseDate}</span>
                  </div>
                </div>
              </div>

              {/* Comprovante */}
              {receiptUrl && (
                <div className="flex justify-center">
                  <a
                    href={receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--cassia-purple)] hover:bg-[var(--cassia-purple-dark)] text-white rounded-lg transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                    Ver Comprovante de Pagamento
                  </a>
                </div>
              )}

              {/* Mensagem final */}
              <div className="text-center pt-4">
                <p className="text-sm text-[var(--cassia-purple-dark)]/70 mb-6">
                  Você receberá um e-mail de confirmação em breve com todos os detalhes do seu pedido.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-3 bg-gradient-to-r from-[var(--cassia-purple)] to-[var(--cassia-gold)] hover:opacity-90 text-white rounded-lg font-semibold transition-all"
                  style={{ boxShadow: 'var(--shadow-medium)' }}
                >
                  Voltar ao Início
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

