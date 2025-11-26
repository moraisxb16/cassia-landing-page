import { ShoppingBag } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../components/ui/sheet';
import { Button } from '../components/ui/button';
import { useCart } from './useCart';
import { CartItem } from './CartItem';

export function CartDrawer() {
  const {
    state: { items, isCartOpen },
    totalPrice,
    updateQuantity,
    removeItem,
    closeCart,
    openCheckout,
  } = useCart();

  const handleOpenChange = (open: boolean) => {
    if (!open) closeCart();
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Carrinho de Compras
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full mt-6">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500">Seu carrinho está vazio</p>
              <Button 
                className="mt-4 bg-purple-600 hover:bg-purple-700" 
                onClick={closeCart}
              >
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onDecrease={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    onIncrease={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    onRemove={() => removeItem(item.id)}
                  />
                ))}
              </div>

              <div className="border-t pt-4 mt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-purple-900">
                    R$ {totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-900">Total</span>
                  <span className="text-purple-900">
                    R$ {totalPrice.toFixed(2)}
                  </span>
                </div>

                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={openCheckout}
                >
                  Finalizar Compra
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={closeCart}
                >
                  Continuar Comprando
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}


