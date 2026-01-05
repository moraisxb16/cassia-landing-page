import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { ShoppingBag, Star, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../shared/ImageWithFallback';
import { useCart } from '../../cart/useCart';
import type { Product } from '../../types';

type SimpleProduct = Omit<Product, 'type' | 'category'> & {
  rating: number;
  isTestProduct?: boolean; // Flag para produto de teste
  pixPrice?: number; // Preço diferenciado para PIX (opcional)
};

// Placeholder elegante para produtos sem imagem
const placeholderImage = 'https://images.unsplash.com/photo-1608571424634-58ae03e6edcf?auto=format&fit=crop&w=1080&q=80';

const products: Record<string, SimpleProduct[]> = {
  oils: [
    // ÓLEOS ESSENCIAIS - ORGANICS LIFE
    {
      id: 'oil-lavanda',
      name: 'Óleo Essencial de Lavanda – 10ml',
      description: 'ORGANICS LIFE – Relaxamento profundo e equilíbrio emocional.',
      price: 58.30,
      rating: 5,
      image: 'https://i.ibb.co/QFcYr6Q8/Whats-App-Image-2025-12-26-at-11-03-29-4.jpg',
    },
    {
      id: 'oil-alecrim',
      name: 'Óleo Essencial de Alecrim – 10ml',
      description: 'ORGANICS LIFE – Estimula clareza mental e proteção energética.',
      price: 40.70,
      rating: 5,
      image: 'https://i.ibb.co/JRS1bdjK/Whats-App-Image-2025-12-26-at-11-03-30-4.jpg',
    },
    {
      id: 'oil-manjericao',
      name: 'Óleo Essencial de Manjericão – 5ml',
      description: 'ORGANICS LIFE – Foco mental e proteção energética.',
      price: 30.80,
      rating: 5,
      image: 'https://i.ibb.co/JFmyVzqZ/Whats-App-Image-2025-12-26-at-11-03-30-1.jpg',
    },
    {
      id: 'oil-eucalipto',
      name: 'Óleo Essencial de Eucalipto Globulus – 10ml',
      description: 'ORGANICS LIFE – Purificação e clareza respiratória.',
      price: 33.00,
      rating: 5,
      image: 'https://i.ibb.co/QjP0PDHr/Whats-App-Image-2025-12-26-at-11-03-30-3.jpg',
    },
    {
      id: 'oil-cipreste',
      name: 'Óleo Essencial de Cipreste – 10ml',
      description: 'ORGANICS LIFE – Aromaterapia para equilíbrio e conexão espiritual.',
      price: 52.80,
      rating: 5,
      image: 'https://i.ibb.co/7ckLQ3n/Whats-App-Image-2025-12-26-at-11-03-30-6.jpg',
    },
    {
      id: 'oil-tea-tree',
      name: 'Óleo Essencial de Tea Tree (Melaleuca) – 10ml',
      description: 'ORGANICS LIFE – Purificação e proteção natural.',
      price: 52.80,
      rating: 5,
      image: 'https://i.ibb.co/qMx92Rz9/Whats-App-Image-2025-12-26-at-11-03-31.jpg',
    },
    // ÓLEOS ESSENCIAIS - LASZLO
    {
      id: 'oil-limao-siciliano',
      name: 'OE Limão Siciliano',
      description: 'LASZLO',
      price: 50.60,
      rating: 5,
      image: 'https://i.ibb.co/wFhQ5pjD/Whats-App-Image-2025-12-26-at-11-03-31-1.jpg',
    },
    {
      id: 'oil-copaiba',
      name: 'OE Copaíba',
      description: 'LASZLO',
      price: 53.90,
      rating: 5,
      image: 'https://i.ibb.co/CKTG8pwq/Whats-App-Image-2025-12-26-at-11-03-31-2.jpg',
    },
    {
      id: 'oil-camomila-romana',
      name: 'OE Camomila Romana',
      description: 'LASZLO',
      price: 95.70,
      rating: 5,
      image: 'https://i.ibb.co/hxkhL0fx/Whats-App-Image-2025-12-26-at-11-03-31-3.jpg',
    },
    {
      id: 'oil-vetiver',
      name: 'OE Vetiver – 5ml',
      description: 'LASZLO',
      price: 196.90,
      rating: 5,
      image: 'https://i.ibb.co/3yPWgK2M/Whats-App-Image-2025-12-26-at-11-03-31-4.jpg',
    },
    {
      id: 'oil-tomilho-branco',
      name: 'OE Tomilho Branco',
      description: 'LASZLO',
      price: 64.90,
      rating: 5,
      image: 'https://i.ibb.co/3yPWgK2M/Whats-App-Image-2025-12-26-at-11-03-31-4.jpg',
    },
    {
      id: 'oil-cedro-atlas',
      name: 'OE Cedro do Atlas',
      description: 'LASZLO',
      price: 71.50,
      rating: 5,
      image: 'https://i.ibb.co/G321V15Y/Whats-App-Image-2025-12-26-at-11-03-32.jpg',
    },
  ],
  sprays: [
    {
      id: 'spray-antigosma',
      name: 'Spray Ambiente Antigosma – 140ml',
      description: 'DRAGON ESSÊNCIAS – Limpeza energética profunda para ambientes e auras.',
      price: 108.00,
      pixPrice: 98.00,
      rating: 5,
      image: placeholderImage,
    },
    {
      id: 'spray-guardiao',
      name: 'Spray Ambiente Guardião – 140ml',
      description: 'DRAGON ESSÊNCIAS – Proteção contra energias negativas e olho gordo.',
      price: 108.00,
      pixPrice: 98.00,
      rating: 5,
      image: placeholderImage,
    },
    {
      id: 'spray-liberta',
      name: 'Spray Ambiente Liberta – 140ml',
      description: 'DRAGON ESSÊNCIAS – Libertação e transmutação energética.',
      price: 108.00,
      pixPrice: 98.00,
      rating: 5,
      image: placeholderImage,
    },
    {
      id: 'kit-sprays',
      name: 'Kit Sprays – Limpeza, Proteção e Nutrindo o Feminino',
      description: 'Kit completo com três sprays essenciais para sua jornada.',
      price: 89.00,
      pixPrice: 80.00,
      rating: 5,
      image: 'https://i.ibb.co/JWSzyvRd/Whats-App-Image-2025-12-26-at-11-03-30-5.jpg',
    },
  ],
  crystals: [],
  books: [
    {
      id: 'livro-aromaterapia-cada-dia',
      name: 'Aromaterapia para Cada Dia',
      description: 'LASZLO',
      price: 88.00,
      rating: 5,
      image: 'https://i.ibb.co/xthy4dG6/Whats-App-Image-2025-12-26-at-11-03-32-1.jpg',
    },
    {
      id: 'livro-aromaterapia-medica',
      name: 'Aromaterapia Médica',
      description: 'LASZLO',
      price: 90.20,
      rating: 5,
      image: 'https://i.ibb.co/n85Mpwf5/Whats-App-Image-2025-12-26-at-11-03-32-2.jpg',
    },
    {
      id: 'livro-aromaterapia-cura-oleos',
      name: 'Aromaterapia: A Cura pelos Óleos Essenciais',
      description: 'LASZLO',
      price: 90.20,
      rating: 5,
      image: 'https://i.ibb.co/qMXkqzkt/Whats-App-Image-2025-12-26-at-11-03-32-4.jpg',
    },
    {
      id: 'livro-alienigenas-passado',
      name: 'Alienígenas do Passado',
      description: 'LASZLO',
      price: 88.00,
      rating: 5,
      image: 'https://i.ibb.co/Kp7t3dpW/Whats-App-Image-2025-12-26-at-11-03-32-3.jpg',
    },
    {
      id: 'livro-cuidando-filhos-oleos',
      name: 'Cuidando dos Filhos com Óleos Essenciais',
      description: 'LASZLO',
      price: 96.80,
      rating: 5,
      image: 'https://i.ibb.co/gLhPTPrZ/Whats-App-Image-2025-12-26-at-11-03-32-5.jpg',
    },
    {
      id: 'livro-cura-vibracional',
      name: 'Cura Vibracional',
      description: 'LASZLO',
      price: 71.50,
      rating: 5,
      image: 'https://i.ibb.co/CK2hCCmZ/Whats-App-Image-2025-12-26-at-11-03-33.jpg',
    },
  ],
  other: [
    {
      id: 'luminaria-aromatizador',
      name: 'Luminária Aromatizador de Ambiente',
      description: 'DRIFT – Luminária aromatizadora para criar ambientes harmoniosos e energizados.',
      price: 298.00,
      rating: 5,
      image: 'https://i.ibb.co/NdzrNP95/Whats-App-Image-2025-12-26-at-11-03-30.jpg',
    },
  ],
};

interface ProductCardProps {
  product: SimpleProduct;
  index: number;
  category?: 'oils' | 'sprays' | 'books' | 'other';
}

function ProductCard({ product, index, category }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedPayment, setSelectedPayment] = React.useState<'credit' | 'pix'>('credit');
  
  // Altura do container de imagem: 260px para livros, 220px para óleos/sprays/outros
  const imageHeight = category === 'books' ? 'h-[260px]' : 'h-[220px]';
  
  // Verificar se produto tem dois preços
  const hasPixPrice = !!product.pixPrice;
  
  // Calcular preço final baseado na escolha
  const finalPrice = hasPixPrice && selectedPayment === 'pix' 
    ? product.pixPrice! 
    : product.price;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        className="overflow-hidden bg-[var(--cassia-surface)]/95 backdrop-blur-sm border-[var(--cassia-border-soft)] hover:border-[var(--cassia-purple)] transition-all duration-500 group h-full flex flex-col"
        style={{ boxShadow: 'var(--shadow-soft)' }}
      >
        <div className={`relative w-full ${imageHeight} flex items-center justify-center bg-white overflow-hidden`}>
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className={category === 'books' 
              ? "max-w-full max-h-full object-contain object-center p-4"
              : "max-w-full max-h-[90%] object-contain object-center p-4"
            }
            style={{ imageRendering: 'auto' }}
          />

          {/* Rating badge */}
          <motion.div
            className="absolute top-4 left-4"
            whileHover={{ scale: 1.1, rotate: -5 }}
          >
            <Badge
              className="bg-[var(--cassia-gold-light)] border-0 text-[var(--cassia-purple-dark)] flex items-center gap-1"
              style={{ boxShadow: 'var(--shadow-medium)' }}
            >
              <Star className="w-3 h-3 fill-current" />
              {product.rating}
            </Badge>
          </motion.div>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        <CardContent className="p-5 flex-grow">
          <h3 className="text-lg text-[var(--cassia-purple-dark)] mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--cassia-purple-dark)] group-hover:to-[var(--cassia-gold)] transition-all">
            {product.name}
          </h3>

          <p className="text-[var(--cassia-purple-dark)]/72 text-sm mb-4 leading-relaxed">
            {product.description}
          </p>

          {/* Preço único ou escolha PIX/Cartão */}
          {hasPixPrice ? (
            <div className="space-y-3 mb-2">
              <div className="text-sm font-semibold text-[var(--cassia-purple-dark)] mb-2">
                Escolha a forma de pagamento:
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 p-2 rounded-lg border-2 cursor-pointer transition-all hover:bg-[var(--cassia-lavender)]/30"
                  style={{ 
                    borderColor: selectedPayment === 'pix' 
                      ? 'var(--cassia-purple)' 
                      : 'var(--cassia-border-soft)',
                    backgroundColor: selectedPayment === 'pix' 
                      ? 'var(--cassia-lavender)/20' 
                      : 'transparent'
                  }}
                >
                  <input
                    type="radio"
                    name={`payment-${product.id}`}
                    value="pix"
                    checked={selectedPayment === 'pix'}
                    onChange={() => setSelectedPayment('pix')}
                    className="w-4 h-4 text-[var(--cassia-purple)]"
                  />
                  <span className="text-sm text-[var(--cassia-purple-dark)]">
                    PIX — R$ {product.pixPrice!.toFixed(2).replace('.', ',')}
                  </span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg border-2 cursor-pointer transition-all hover:bg-[var(--cassia-lavender)]/30"
                  style={{ 
                    borderColor: selectedPayment === 'credit' 
                      ? 'var(--cassia-purple)' 
                      : 'var(--cassia-border-soft)',
                    backgroundColor: selectedPayment === 'credit' 
                      ? 'var(--cassia-lavender)/20' 
                      : 'transparent'
                  }}
                >
                  <input
                    type="radio"
                    name={`payment-${product.id}`}
                    value="credit"
                    checked={selectedPayment === 'credit'}
                    onChange={() => setSelectedPayment('credit')}
                    className="w-4 h-4 text-[var(--cassia-purple)]"
                  />
                  <span className="text-sm text-[var(--cassia-purple-dark)]">
                    Cartão — R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-[var(--cassia-purple-dark)] to-[var(--cassia-gold)]">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-5 pt-0">
          <motion.div
            className="w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              className="w-full bg-[var(--cassia-purple)] hover:bg-[var(--cassia-purple-dark)] text-white border-0"
              style={{ boxShadow: 'var(--shadow-medium)' }}
              size="sm"
              onClick={() =>
                addItem({
                  id: product.id,
                  name: product.name,
                  price: finalPrice, // Preço final baseado na escolha do usuário
                  pricePix: hasPixPrice ? product.pixPrice : undefined,
                  image: product.image,
                  type: 'product',
                })
              }
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Adicionar ao Carrinho
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export function Products() {
  return (
    <section id="products" className="py-20 relative">
      {/* Animated background místico */}
      <motion.div 
        className="absolute top-1/3 right-1/4 w-96 h-96 bg-[var(--cassia-gold-light)]/40 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Badge 
              className="px-6 py-2 bg-gradient-to-r from-[var(--cassia-purple)] to-[var(--cassia-gold)] border-0 text-white"
              style={{ boxShadow: 'var(--shadow-glow)' }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Produtos Holísticos
            </Badge>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[var(--cassia-purple-dark)] via-[var(--cassia-purple)] to-[var(--cassia-gold)] mb-6">
            Ferramentas para Sua Jornada
          </h2>
          
          <p className="text-lg text-[var(--cassia-purple-dark)]/72 max-w-3xl mx-auto">
            Produtos cuidadosamente selecionados e energizados para apoiar 
            seu desenvolvimento espiritual e bem-estar diário.
          </p>
        </motion.div>

        {/* Seção: Óleos Essenciais */}
        {products.oils && products.oils.length > 0 && (
          <div className="mb-16">
            <motion.h3
              className="text-3xl md:text-4xl text-[var(--cassia-purple-dark)] mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Óleos Essenciais
            </motion.h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {products.oils.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} category="oils" />
              ))}
            </div>
          </div>
        )}

        {/* Seção: Sprays */}
        {products.sprays && products.sprays.length > 0 && (
          <div className="mb-16">
            <motion.h3
              className="text-3xl md:text-4xl text-[var(--cassia-purple-dark)] mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Sprays
            </motion.h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {products.sprays.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} category="sprays" />
              ))}
            </div>
          </div>
        )}

        {/* Seção: Livros */}
        {products.books && products.books.length > 0 && (
          <div className="mb-16">
            <motion.h3
              className="text-3xl md:text-4xl text-[var(--cassia-purple-dark)] mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Livros
            </motion.h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {products.books.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} category="books" />
              ))}
            </div>
          </div>
        )}

        {/* Seção: Outros Produtos */}
        {products.other && products.other.length > 0 && (
          <div className="mb-16">
            <motion.h3
              className="text-3xl md:text-4xl text-[var(--cassia-purple-dark)] mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Outros Produtos
            </motion.h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {products.other.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} category="other" />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
