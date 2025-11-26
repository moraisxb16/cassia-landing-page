import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { ShoppingBag, Star, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../shared/ImageWithFallback';
import { useCart } from '../../cart/useCart';
import type { Product } from '../../types';

type SimpleProduct = Omit<Product, 'type' | 'category'> & {
  rating: number;
};

const products: Record<string, SimpleProduct[]> = {
  oils: [
    {
      id: 'oil-lavanda',
      name: 'Óleo Essencial de Lavanda',
      description:
        'Puro óleo de lavanda para relaxamento profundo e equilíbrio emocional. 10ml.',
      price: 45,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1608571424634-58ae03e6edcf?auto=format&fit=crop&w=1080&q=80',
    },
    {
      id: 'oil-alecrim',
      name: 'Óleo Essencial de Alecrim',
      description: 'Estimula clareza mental e proteção energética. 10ml.',
      price: 42,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1608571424634-58ae03e6edcf?auto=format&fit=crop&w=1080&q=80',
    },
    {
      id: 'oil-sandalo',
      name: 'Óleo Essencial de Sândalo',
      description: 'Para meditação profunda e conexão espiritual. 5ml.',
      price: 68,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1608571424634-58ae03e6edcf?auto=format&fit=crop&w=1080&q=80',
    },
  ],
  sprays: [
    {
      id: 'spray-limpeza',
      name: 'Spray de Limpeza Energética',
      description: 'Blend especial para limpar ambientes e auras. 100ml.',
      price: 55,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1709813610121-e2a51545e212?auto=format&fit=crop&w=1080&q=80',
    },
    {
      id: 'spray-protecao',
      name: 'Spray de Proteção',
      description: 'Proteção contra energias negativas e olho gordo. 100ml.',
      price: 58,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1709813610121-e2a51545e212?auto=format&fit=crop&w=1080&q=80',
    },
    {
      id: 'spray-abundancia',
      name: 'Spray da Abundância',
      description: 'Atrai prosperidade e energias positivas. 100ml.',
      price: 60,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1709813610121-e2a51545e212?auto=format&fit=crop&w=1080&q=80',
    },
  ],
  crystals: [
    {
      id: 'crystal-ametista',
      name: 'Ametista Bruta',
      description: 'Cristal de proteção espiritual e transmutação. Aprox. 100g.',
      price: 85,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1609216970378-ce61cd74a187?auto=format&fit=crop&w=1080&q=80',
    },
    {
      id: 'crystal-quartzo',
      name: 'Quartzo Rosa Polido',
      description: 'Pedra do amor próprio e relacionamentos. Aprox. 50g.',
      price: 65,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1599767254077-ad621c8a8810?auto=format&fit=crop&w=1080&q=80',
    },
    {
      id: 'crystal-citrino',
      name: 'Citrino Natural',
      description: 'Prosperidade e manifestação. Aprox. 80g.',
      price: 95,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1599767254077-ad621c8a8810?auto=format&fit=crop&w=1080&q=80',
    },
  ],
  apparel: [
    {
      id: 'tshirt-lotus',
      name: 'Camiseta Flor de Lótus',
      description:
        'Algodão orgânico com estampa exclusiva. Tamanhos P ao GG.',
      price: 89,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1599767254077-ad621c8a8810?auto=format&fit=crop&w=1080&q=80',
    },
    {
      id: 'tshirt-mandala',
      name: 'Camiseta Mandala Sagrada',
      description: 'Design exclusivo mandala. Algodão premium. P ao GG.',
      price: 92,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1599767254077-ad621c8a8810?auto=format&fit=crop&w=1080&q=80',
    },
    {
      id: 'tshirt-dragon',
      name: 'Camiseta Dragonlight',
      description: 'Exclusiva do sistema Dragonlight. Edição limitada. P ao GG.',
      price: 95,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1599767254077-ad621c8a8810?auto=format&fit=crop&w=1080&q=80',
    },
  ],
};

interface ProductCardProps {
  product: SimpleProduct;
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        className="overflow-hidden bg-white/60 backdrop-blur-sm border-[#A275E3]/20 hover:border-[#A275E3]/50 transition-all duration-500 group h-full flex flex-col"
        style={{ boxShadow: 'var(--shadow-soft)' }}
      >
        <div className="relative h-72 overflow-hidden">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Gradient overlay místico */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#8A4FC3]/30 via-transparent to-transparent opacity-60" />

          {/* Rating badge */}
          <motion.div
            className="absolute top-4 left-4"
            whileHover={{ scale: 1.1, rotate: -5 }}
          >
            <Badge
              className="bg-gradient-to-r from-[#CFAF63] to-[#F8E3BB] border-0 text-[#8A4FC3] flex items-center gap-1"
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
          <h3 className="text-lg text-[#8A4FC3] mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#8A4FC3] group-hover:to-[#A275E3] transition-all">
            {product.name}
          </h3>

          <p className="text-[#8A4FC3]/70 text-sm mb-4 leading-relaxed">
            {product.description}
          </p>

          <div className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#8A4FC3] to-[#CFAF63]">
            R$ {product.price.toFixed(2)}
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0">
          <motion.div
            className="w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              className="w-full bg-gradient-to-r from-[#8A4FC3] to-[#A275E3] hover:opacity-90 text-white border-0"
              style={{ boxShadow: 'var(--shadow-medium)' }}
              size="sm"
              onClick={() =>
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
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
        className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#F8E3BB]/20 rounded-full blur-3xl"
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
              className="px-6 py-2 bg-gradient-to-r from-[#A275E3] to-[#CFAF63] border-0 text-white"
              style={{ boxShadow: 'var(--shadow-glow)' }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Produtos Holísticos
            </Badge>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#8A4FC3] via-[#A275E3] to-[#CFAF63] mb-6">
            Ferramentas para Sua Jornada
          </h2>
          
          <p className="text-lg text-[#8A4FC3]/70 max-w-3xl mx-auto">
            Produtos cuidadosamente selecionados e energizados para apoiar 
            seu desenvolvimento espiritual e bem-estar diário.
          </p>
        </motion.div>

        <Tabs defaultValue="oils" className="w-full">
          <TabsList 
            className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-12 bg-white/60 backdrop-blur-sm border border-[#A275E3]/20 p-1"
            style={{ boxShadow: 'var(--shadow-soft)' }}
          >
            {[
              { value: 'oils', label: 'Óleos' },
              { value: 'sprays', label: 'Sprays' },
              { value: 'crystals', label: 'Cristais' },
              { value: 'apparel', label: 'Camisetas' },
            ].map((tab) => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8A4FC3] data-[state=active]:to-[#A275E3] data-[state=active]:text-white text-[#8A4FC3]"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {(['oils', 'sprays', 'crystals', 'apparel'] as const).map((key) => (
            <TabsContent key={key} value={key}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products[key].map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}


