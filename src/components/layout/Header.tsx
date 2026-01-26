import React, { useEffect, useState } from 'react';
import { Instagram, ShoppingCart, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'motion/react';
import { useCart } from '../../cart/useCart';

export function Header() {
  const { totalItems, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollToDiagnostico = () => {
    const el =
      document.getElementById('agendar-diagnostico') ??
      document.getElementById('diagnostico');
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Função para scroll suave até a seção
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Itens de navegação do header (movidos do Hero)
  const navItems = [
    { label: 'Quem Sou', id: 'quem-eu-sou' },
    { label: 'Trabalho', id: 'meu-trabalho' },
    { label: 'Cursos', id: 'courses' },
    { label: 'Ferramentas', id: 'minhas-ferramentas' },
  ];

  // Menu original (Serviços, Cursos, Produtos)
  const menuItems = [
    { label: 'Serviços', id: 'services' },
    { label: 'Cursos', id: 'courses' },
    { label: 'Produtos', id: 'products' },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#2B163F]/80 backdrop-blur-xl border-b border-white/10'
          : 'bg-[var(--cassia-lavender-light)]/40 border-b border-transparent'
      }`}
      style={{ boxShadow: isScrolled ? '0 8px 24px rgba(15, 10, 40, 0.16)' : 'var(--shadow-soft)' }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo à esquerda - Reduzido */}
          <motion.div 
            className="flex items-center gap-2 md:gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-[var(--cassia-gold)]" />
            </div>
            <div>
              <h1 className="text-base md:text-[17px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[var(--cassia-purple-dark)] via-[var(--cassia-purple)] to-[var(--cassia-gold)]">
                Cássia Corviniy
              </h1>
              <a 
                href="https://www.instagram.com/cassiacorviniy/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[var(--cassia-purple-dark)] hover:text-[var(--cassia-purple)] transition-colors"
              >
                <Instagram className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-xs md:text-[13px] opacity-80">@cassiacorviniy</span>
              </a>
            </div>
          </motion.div>

          {/* Nav centralizado - Botões de navegação do Hero */}
          <nav className="hidden lg:flex items-center justify-center gap-1 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item, i) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className="nav-link px-3 py-2.5 rounded-[10px] text-white/90 text-[15px] font-medium transition-all relative group cursor-pointer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--cassia-purple)] to-[var(--cassia-gold)] group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </nav>

          {/* Menu original (Serviços, Cursos, Produtos) - Desktop */}
          <nav className="hidden md:flex items-center justify-center gap-6 absolute left-1/2 transform -translate-x-1/2 lg:hidden">
            {menuItems.map((item, i) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className="text-[var(--cassia-purple-dark)] hover:text-[var(--cassia-purple)] transition-colors relative group cursor-pointer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--cassia-purple)] to-[var(--cassia-gold)] group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </nav>

          {/* CTA + Carrinho à direita */}
          <div className="flex items-center gap-3 ml-auto">
            {/* CTA Secundário - Agendar Atendimento */}
            <motion.button
              className="hidden md:block px-4 py-2 text-sm font-medium text-white bg-[var(--cassia-purple)]/80 hover:bg-[var(--cassia-purple)] rounded-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToDiagnostico}
            >
              Agendar Atendimento
            </motion.button>

            {/* Carrinho */}
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
      </div>
    </motion.header>
  );
}
