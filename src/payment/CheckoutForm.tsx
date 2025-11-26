import { useState, FormEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { CheckCircle2 } from 'lucide-react';
import { useCart } from '../cart/useCart';
import { PaymentSelector } from './PaymentSelector';
import { PixQRCode } from './PixQRCode';
import { CreditCardRedirect } from './CreditCardRedirect';
import { usePayment } from './usePayment';
import type { CheckoutFormData } from '../types';

const defaultForm: CheckoutFormData = {
  name: '',
  email: '',
  phone: '',
  cpf: '',
  street: '',
  number: '',
  city: '',
  state: '',
  zip: '',
  paymentMethod: 'pix',
};

export function CheckoutForm() {
  const {
    state: { items, isCheckoutOpen },
    totalPrice,
    closeCheckout,
    clearCart,
  } = useCart();

  const { state: paymentState, pay, reset, setMethod } = usePayment();
  const [form, setForm] = useState<CheckoutFormData>(defaultForm);

  const handleClose = () => {
    reset();
    setForm(defaultForm);
    closeCheckout();
  };

  const handleChange =
    (field: keyof CheckoutFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await pay(form, items, totalPrice);
    if (response?.success) {
      clearCart();
    }
  };

  const isSuccess = paymentState.status === 'success';

  return (
    <Dialog open={isCheckoutOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle>Finalizar Compra</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-purple-900 mb-3">Resumo do Pedido</h3>
                <div className="space-y-2 mb-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="text-purple-900">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-purple-200 pt-2 flex justify-between">
                  <span className="text-purple-900">Total</span>
                  <span className="text-purple-900">
                    R$ {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-purple-900">Informações Pessoais</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      placeholder="Seu nome"
                      value={form.name}
                      onChange={handleChange('name')}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={form.email}
                      onChange={handleChange('email')}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      placeholder="(00) 00000-0000"
                      value={form.phone}
                      onChange={handleChange('phone')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      placeholder="000.000.000-00"
                      value={form.cpf}
                      onChange={handleChange('cpf')}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-purple-900">Endereço de Entrega</h3>
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="street">Rua</Label>
                      <Input
                        id="street"
                        placeholder="Nome da rua"
                        value={form.street}
                        onChange={handleChange('street')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="number">Número</Label>
                      <Input
                        id="number"
                        placeholder="123"
                        value={form.number}
                        onChange={handleChange('number')}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        placeholder="Sua cidade"
                        value={form.city}
                        onChange={handleChange('city')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        placeholder="UF"
                        value={form.state}
                        onChange={handleChange('state')}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="zip">CEP</Label>
                    <Input
                      id="zip"
                      placeholder="00000-000"
                      value={form.zip}
                      onChange={handleChange('zip')}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-purple-900">Forma de Pagamento</h3>
                <PaymentSelector
                  method={form.paymentMethod}
                  onChange={(method) => {
                    setForm((prev) => ({ ...prev, paymentMethod: method }));
                    setMethod(method);
                  }}
                />
                {form.paymentMethod === 'pix' ? (
                  <PixQRCode qrCode={paymentState.response?.pixQrCode} />
                ) : (
                  <CreditCardRedirect
                    paymentLink={paymentState.response?.paymentLink}
                  />
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={paymentState.status === 'processing'}
              >
                {paymentState.status === 'processing'
                  ? 'Processando...'
                  : `Pagar R$ ${totalPrice.toFixed(2)}`}
              </Button>
              {paymentState.error && (
                <p className="text-xs text-red-600">
                  Erro ao processar pagamento: {paymentState.error}
                </p>
              )}
            </form>
          </>
        ) : (
          <div className="py-12 text-center">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-purple-900 mb-4">Compra Realizada com Sucesso!</h2>
            <p className="text-gray-600 mb-6">
              Obrigada pela sua compra! Você receberá um email com os detalhes do
              seu pedido.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Para cursos, você receberá as instruções de acesso em até 24 horas.
              Produtos físicos serão enviados em até 3 dias úteis.
            </p>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleClose}
            >
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


