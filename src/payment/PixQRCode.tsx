import { Smartphone } from 'lucide-react';

interface Props {
  qrCode?: string;
}

export function PixQRCode({ qrCode }: Props) {
  return (
    <div className="bg-purple-50 p-6 rounded-lg text-center">
      <Smartphone className="w-16 h-16 text-purple-600 mx-auto mb-4" />
      {qrCode ? (
        <>
          <p className="text-gray-600 mb-2">
            Escaneie o QR Code abaixo com o app do seu banco para concluir o
            pagamento.
          </p>
          {/* Placeholder visual para QR Code - aqui você pode substituir por um componente real */}
          <div className="mt-4 inline-flex items-center justify-center border-2 border-dashed border-purple-300 rounded-xl px-8 py-6 text-xs text-purple-700 bg-white">
            {qrCode}
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-600 mb-2">
            O QR Code PIX será gerado assim que o pedido for enviado para a
            InfinitePay.
          </p>
          <p className="text-xs text-gray-500">
            Integre aqui a resposta da API (`pixQrCode`) quando estiver com a
            chave configurada.
          </p>
        </>
      )}
    </div>
  );
}


