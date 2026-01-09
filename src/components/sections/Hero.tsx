import React, { useRef } from 'react';
import { Button } from '../ui/button';
import { Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ImageWithFallback } from '../shared/ImageWithFallback';

export function Hero() {
  const imageRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ['start center', 'end start'],
  });
  const imageParallaxY = useTransform(scrollYProgress, [0, 1], [6, -6]);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden cassia-hero-gradient">
      {/* Overlay sutil sobre o gradiente animado */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10" />
      
      {/* Orbs de luz místicos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--cassia-lavender)]/20 rounded-full"
          style={{ filter: 'var(--blur-hard)' }}
          animate={{
            y: [0, 60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[var(--cassia-gold)]/15 rounded-full"
          style={{ filter: 'var(--blur-hard)' }}
          animate={{
            y: [0, -50, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--cassia-purple)]/12 rounded-full"
          style={{ filter: 'var(--blur-hard)' }}
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.12, 0.2, 0.12],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Partículas sutis flutuantes */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            background: i % 3 === 0 ? 'rgba(255,255,255,0.4)' : i % 3 === 1 ? 'rgba(162,117,227,0.3)' : 'rgba(207,175,99,0.3)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30 - Math.random() * 40, 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        />
      ))}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Layout 2 colunas no desktop */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16">
            {/* Coluna esquerda: Foto da Cássia */}
            <motion.div
              className="flex justify-center md:justify-start order-2 md:order-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                {/* Foto circular com borda dourada e glow */}
                <div className="relative w-[140px] h-[140px] md:w-[140px] md:h-[140px]">
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: '4px solid #CFAF63',
                      boxShadow: '0 0 20px rgba(207,175,99,0.4), 0 0 40px rgba(162,117,227,0.2), inset 0 0 20px rgba(207,175,99,0.1)',
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full overflow-hidden"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(207,175,99,0.4), 0 0 40px rgba(162,117,227,0.2)',
                        '0 0 30px rgba(207,175,99,0.6), 0 0 50px rgba(162,117,227,0.3)',
                        '0 0 20px rgba(207,175,99,0.4), 0 0 40px rgba(162,117,227,0.2)',
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ImageWithFallback
                      src="https://via.placeholder.com/140x140/CFAF63/FFFFFF?text=C%C3%A1ssia"
                      alt="Cássia Corviniy"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Coluna direita: Título + Subtítulo + CTA */}
            <motion.div
              className="text-center md:text-left order-1 md:order-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6 hero-badge"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <Sparkles className="w-4 h-4 text-[var(--cassia-gold)]" />
                <span className="text-[var(--cassia-purple-dark)] text-sm">✨ Transformação Mental, Física e Espiritual</span>
              </motion.div>

              {/* Título Principal - Premium */}
              <motion.h2
                className="text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight mb-6 text-white"
                style={{
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 20px rgba(255,255,255,0.1), 0 4px 40px rgba(162,117,227,0.2)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                QUERER é o início de toda transformação.
              </motion.h2>
              
              {/* Subtítulo - Melhorado */}
              <motion.p
                className="text-base md:text-lg text-[var(--cassia-purple)] max-w-[640px] mx-auto md:mx-0 mb-6 font-medium leading-relaxed"
                style={{ lineHeight: '1.6' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Um espaço seguro para se compreender, transformar padrões e se reconectar com SUA ESSÊNCIA.
              </motion.p>

              {/* CTA Principal - Premium */}
              <motion.div
                className="flex justify-center md:justify-start mt-5 md:mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div 
                  whileHover={{ scale: 1.02, y: -3 }} 
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    boxShadow: [
                      '0 8px 32px rgba(162,117,227,0.45)',
                      '0 12px 40px rgba(162,117,227,0.55)',
                      '0 8px 32px rgba(162,117,227,0.45)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Button 
                    className="w-full sm:w-auto bg-gradient-to-r from-[#A275E3] to-[#8A4FC3] hover:from-[#8A4FC3] hover:to-[#A275E3] text-white border-0 px-12 py-6 text-lg font-semibold"
                    style={{ 
                      height: '56px',
                      boxShadow: '0 8px 32px rgba(162,117,227,0.45)',
                    }}
                    onClick={() => document.getElementById('diagnostico')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Começar a minha transformação
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Chips - Menos destaque (abaixo do CTA) */}
          <motion.div
            className="flex flex-wrap gap-3 justify-center mb-8 md:mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {[
              { text: 'Quem Eu Sou' },
              { text: 'Meu Trabalho' },
              { text: 'Minhas Especializações' },
              { text: 'Minhas Ferramentas' }
            ].map((item, i) => {
              return (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-[var(--cassia-purple)]/15"
                  style={{ 
                    boxShadow: '0 2px 8px rgba(94, 90, 154, 0.1)',
                    opacity: 0.85,
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.85, scale: 1 }}
                  transition={{ delay: 1.1 + i * 0.05 }}
                  whileHover={{ scale: 1.05, opacity: 1 }}
                >
                  <span className="text-sm text-[var(--cassia-night)]/70 font-medium">{item.text}</span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Logo Hero - Reduzido (25-30% da viewport) */}
          <motion.div
            ref={imageRef}
            className="relative max-w-3xl mx-auto"
            style={{ maxHeight: '30vh' }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {/* Glow animado */}
            <motion.div
              className="absolute -inset-8 bg-gradient-to-br from-[var(--cassia-purple)]/20 via-[var(--cassia-lavender)]/10 to-[var(--cassia-gold)]/15 rounded-full"
              style={{ filter: 'var(--blur-mid)' }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Container da imagem */}
            <div
              className="relative rounded-2xl overflow-hidden border-2 border-white/40"
              style={{ 
                boxShadow: '0 0 14px rgba(255, 255, 255, 0.2)',
                maxHeight: '30vh',
              }}
            >
              <div className="w-full" style={{ aspectRatio: '16/9', maxHeight: '30vh' }}>
                <ImageWithFallback
                  src="https://i.ibb.co/prygpWrC/Logotipo-C-ssia-Corviniy-9-1.jpg"
                  alt="Cássia Corviniy - Logotipo"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Overlay gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--cassia-purple)]/10 via-transparent to-white/5" />
              
              {/* Borda interna */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
