import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useCart } from '../cart/useCart';
import { InfinitePayButton } from '../components/InfinitePayButton';
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
  } = useCart();

  const [form, setForm] = useState<CheckoutFormData>(defaultForm);

  const handleClose = () => {
    setForm(defaultForm);
    closeCheckout();
  };

  const handleChange =
    (field: keyof CheckoutFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  return (
    <Dialog open={isCheckoutOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <>
          <DialogHeader>
            <DialogTitle>Finalizar Compra</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
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

            <InfinitePayButton
              amount={Math.round(totalPrice * 100)}
              description="Compra na Cassia Corviniy"
            />
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
}


