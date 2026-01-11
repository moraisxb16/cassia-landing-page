import React, { useState, useEffect } from 'react';
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
  birthDate: '',
  street: '',
  number: '',
  city: '',
  state: '',
  zip: '',
  paymentMethod: 'card', // Padrão: cartão de crédito
};

export function CheckoutForm() {
  const {
    state: { items, isCheckoutOpen },
    totalPrice,
    getTotalPrice,
    closeCheckout,
  } = useCart();

  const [form, setForm] = useState<CheckoutFormData>(defaultForm);
  
  // Verificar se há produtos com preço PIX no carrinho
  const hasPixProducts = items.some(item => item.pricePix !== undefined && item.pricePix > 0);
  
  // Se não houver produtos com PIX, forçar método de pagamento para 'card'
  useEffect(() => {
    if (!hasPixProducts && form.paymentMethod === 'pix') {
      setForm(prev => ({ ...prev, paymentMethod: 'card' }));
    }
  }, [hasPixProducts, form.paymentMethod]);
  
  // Calcular total baseado no método de pagamento selecionado
  const currentTotal = getTotalPrice(form.paymentMethod);

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
                {items.map((item) => {
                  const itemPrice = form.paymentMethod === 'pix' && item.pricePix 
                    ? item.pricePix 
                    : item.price;
                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="text-purple-900">
                        R$ {(itemPrice * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-purple-200 pt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-purple-900">
                    Total{hasPixProducts ? ` (${form.paymentMethod === 'pix' ? 'PIX' : 'Cartão'})` : ''}
                  </span>
                  <span className="text-purple-900 font-semibold">
                    R$ {currentTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                {hasPixProducts && form.paymentMethod === 'pix' && currentTotal < totalPrice && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Economia com PIX:</span>
                    <span>R$ {(totalPrice - currentTotal).toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
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
                <div>
                  <Label htmlFor="birthDate">Data de Nascimento *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    required
                    value={form.birthDate}
                    onChange={handleChange('birthDate')}
                    max={new Date().toISOString().split('T')[0]} // Não permitir data futura
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

            {/* Seletor de Método de Pagamento - Apenas se houver produtos com PIX */}
            {hasPixProducts && (
              <div className="space-y-4">
                <h3 className="text-purple-900">Método de Pagamento</h3>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                    form.paymentMethod === 'pix'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="pix"
                      checked={form.paymentMethod === 'pix'}
                      onChange={(e) => setForm(prev => ({ ...prev, paymentMethod: e.target.value as 'pix' | 'card' }))}
                      className="mr-2"
                    />
                    <span className="font-semibold text-purple-900">PIX</span>
                    {getTotalPrice('pix') < totalPrice && (
                      <p className="text-sm text-green-600 mt-1">
                        Economize R$ {(totalPrice - getTotalPrice('pix')).toFixed(2).replace('.', ',')}
                      </p>
                    )}
                  </label>
                  <label className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                    form.paymentMethod === 'card'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={form.paymentMethod === 'card'}
                      onChange={(e) => setForm(prev => ({ ...prev, paymentMethod: e.target.value as 'pix' | 'card' }))}
                      className="mr-2"
                    />
                    <span className="font-semibold text-purple-900">Cartão de Crédito</span>
                  </label>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    💳 Você finalizará o pagamento no checkout seguro da InfinitePay. O valor será processado conforme o método escolhido.
                  </p>
                </div>
              </div>
            )}
            
            {/* Se não houver produtos com PIX, mostrar apenas informação do método */}
            {!hasPixProducts && (
              <div className="space-y-4">
                <h3 className="text-purple-900">Método de Pagamento</h3>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-800 font-semibold">
                    💳 Cartão de Crédito / PIX
                  </p>
                  <p className="text-xs text-purple-700 mt-1">
                    Você finalizará o pagamento no checkout seguro da InfinitePay.
                  </p>
                </div>
              </div>
            )}

            <InfinitePayButton
              description="Compra na Cassia Corviniy"
              totalPrice={currentTotal}
              paymentMethod={form.paymentMethod}
              items={items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: form.paymentMethod === 'pix' && item.pricePix ? item.pricePix : item.price,
                type: item.type // Incluir tipo para separar Cursos/Serviços no ClickUp
              }))}
              customerData={{
                name: form.name,
                email: form.email,
                phone: form.phone,
                cpf: form.cpf,
                birthDate: form.birthDate
              }}
              addressData={{
                street: form.street,
                number: form.number,
                city: form.city,
                state: form.state,
                zip: form.zip
              }}
            />
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
}


