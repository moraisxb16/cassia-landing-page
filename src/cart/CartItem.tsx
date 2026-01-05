import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/shared/ImageWithFallback';
import type { CartItem as CartItemType } from '../types';

interface Props {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function CartItem({ item, onIncrease, onDecrease, onRemove }: Props) {
  return (
    <div className="flex gap-4 p-4 bg-purple-50 rounded-lg relative">
      <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm text-purple-900 mb-1 pr-8">
          {item.name}
        </h4>
        <div className="mb-2">
          <p className="text-purple-600">
            R$ {item.price.toFixed(2).replace('.', ',')}{' '}
            <span className="text-xs text-purple-500">
              ({item.type === 'course' ? 'Curso' : item.type === 'service' ? 'Atendimento' : 'Produto'})
            </span>
          </p>
          {item.pricePix && (
            <p className="text-xs text-green-600">
              ou R$ {item.pricePix.toFixed(2).replace('.', ',')} no PIX
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={onDecrease}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="text-sm w-8 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={onIncrease}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
        onClick={onRemove}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}


