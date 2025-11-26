import { CreditCard } from 'lucide-react';

interface Props {
  paymentLink?: string;
}

export function CreditCardRedirect({ paymentLink }: Props) {
  return (
    <div className="bg-purple-50 p-6 rounded-lg text-center">
      <CreditCard className="w-16 h-16 text-purple-600 mx-auto mb-4" />
      {paymentLink ? (
        <>
          <p className="text-gray-600 mb-2">
            Clique no botão abaixo para abrir o checkout seguro da InfinitePay
            em uma nova aba.
          </p>
          <a
            href={paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
          >
            Abrir Checkout
          </a>
        </>
      ) : (
        <>
          <p className="text-gray-600 mb-2">
            O link do checkout será retornado pela API da InfinitePay.
          </p>
          <p className="text-xs text-gray-500">
            Use o campo `paymentLink` da resposta da API para preencher este
            componente.
          </p>
        </>
      )}
    </div>
  );
}


