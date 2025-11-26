import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { CreditCard, Smartphone } from 'lucide-react';
import type { PaymentMethod } from '../types';

interface Props {
  method: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export function PaymentSelector({ method, onChange }: Props) {
  return (
    <Tabs
      value={method}
      onValueChange={(value) => onChange(value as PaymentMethod)}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="card" className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Cartão de Crédito
        </TabsTrigger>
        <TabsTrigger value="pix" className="flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          PIX
        </TabsTrigger>
      </TabsList>

      <TabsContent value="card" className="space-y-2 text-sm text-muted-foreground">
        Pagamento via link seguro no checkout da InfinitePay. Após confirmar o
        pedido, você será redirecionada para concluir o pagamento.
      </TabsContent>
      <TabsContent value="pix" className="space-y-2 text-sm text-muted-foreground">
        Pagamento via PIX direto na API da InfinitePay. Um QR Code será gerado
        para você realizar o pagamento em poucos segundos.
      </TabsContent>
    </Tabs>
  );
}


