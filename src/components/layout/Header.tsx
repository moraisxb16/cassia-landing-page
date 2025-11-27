import { Instagram, ShoppingCart, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'motion/react';
import { useCart } from '../../cart/useCart';

export function Header() {
  const { totalItems, openCart } = useCart();

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[var(--cassia-lavender-light)]/70 backdrop-blur-xl border-b border-[var(--cassia-border-soft)]"
      style={{ boxShadow: 'var(--shadow-soft)' }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <Sparkles className="w-8 h-8 text-[var(--cassia-gold)]" />
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-[var(--cassia-purple)] opacity-50" />
              </motion.div>
            </div>
            <div>
              <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cassia-purple-dark)] via-[var(--cassia-purple)] to-[var(--cassia-gold)]">
                Cassia Corvini
              </h1>
              <a 
                href="https://www.instagram.com/cassiacorviniy/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[var(--cassia-purple-dark)] hover:text-[var(--cassia-purple)] transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span className="text-sm">@cassiacorviniy</span>
              </a>
            </div>
          </motion.div>

          <nav className="hidden md:flex items-center gap-8">
            {['Serviços', 'Cursos', 'Produtos'].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[var(--cassia-purple-dark)] hover:text-[var(--cassia-purple)] transition-colors relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--cassia-purple)] to-[var(--cassia-gold)] group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </nav>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              className="relative bg-[var(--cassia-surface)] border-[var(--cassia-border-soft)] hover:bg-[var(--cassia-lavender-light)] hover:border-[var(--cassia-purple)] text-[var(--cassia-purple-dark)]"
              onClick={openCart}
              style={{ boxShadow: 'var(--shadow-soft)' }}
            >
              <ShoppingCart className="w-4 h-4" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-[var(--cassia-purple)] to-[var(--cassia-purple-dark)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  style={{ boxShadow: 'var(--shadow-glow)' }}
                >
                  {totalItems}
                </motion.span>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}


