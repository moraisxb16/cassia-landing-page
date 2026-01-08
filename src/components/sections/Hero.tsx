import React, { useRef } from 'react';
import { Button } from '../ui/button';
import { Sparkles, Heart, Moon, Zap } from 'lucide-react';
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
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden cassia-hero-gradient">
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
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Conteúdo superior */}
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 hero-badge"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <Sparkles className="w-4 h-4 text-[var(--cassia-gold)]" />
              <span className="text-[var(--cassia-purple-dark)] text-sm">Transformação Espiritual</span>
            </motion.div>

            {/* Título Principal */}
            <motion.h2
              className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-6 text-center"
              style={{
                background: 'none',
                backgroundColor: 'transparent',
                backgroundImage:
                  'linear-gradient(90deg, #FFFFFF 0%, #EDE7F8 40%, #C7B4FF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.06em',
                textShadow: 'none',
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.25))',
                opacity: 1,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Desperte Sua Luz Interior
            </motion.h2>
            
            {/* Descrição - mais concisa e focada no valor */}
            <motion.p
              className="text-lg md:text-xl text-[var(--cassia-night)]/90 max-w-2xl mx-auto mb-8 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Transforme sua vida através da cura energética e autoconhecimento profundo.
            </motion.p>

            {/* CTA Principal - Destacado */}
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  className="w-full sm:w-auto bg-gradient-to-r from-[var(--cassia-purple-dark)] to-[var(--cassia-purple)] hover:from-[var(--cassia-purple)] hover:to-[var(--cassia-purple-dark)] text-white border-0 px-12 py-7 text-lg font-semibold min-h-[56px]"
                  style={{ boxShadow: '0 8px 24px rgba(94, 90, 154, 0.4)' }}
                  onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Começar Minha Transformação
                </Button>
              </motion.div>
            </motion.div>

            {/* Pills de benefícios - Simplificadas */}
            <motion.div
              className="flex flex-wrap gap-3 justify-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {[
                { icon: Heart, text: 'Cura Energética' },
                { icon: Moon, text: 'Desenvolvimento Espiritual' },
                { icon: Zap, text: 'Transformação Pessoal' }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-[var(--cassia-purple)]/20"
                    style={{ boxShadow: '0 2px 8px rgba(94, 90, 154, 0.15)' }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Icon className="w-4 h-4 text-[var(--cassia-purple)]" />
                    <span className="text-sm text-[var(--cassia-night)]/80 font-medium">{item.text}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Imagem Hero */}
          <motion.div
            ref={imageRef}
            className="relative max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{ y: imageParallaxY }}
          >
            {/* Glow animado */}
            <motion.div
              className="absolute -inset-12 bg-gradient-to-br from-[var(--cassia-purple)]/25 via-[var(--cassia-lavender)]/15 to-[var(--cassia-gold)]/20 rounded-full"
              style={{ filter: 'var(--blur-hard)' }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Container da imagem */}
            <div
              className="relative rounded-3xl overflow-hidden border-2 border-white/50"
              style={{ boxShadow: '0 0 14px rgba(255, 255, 255, 0.25)' }}
            >
              <ImageWithFallback
                src="https://i.ibb.co/prygpWrC/Logotipo-C-ssia-Corviniy-9-1.jpg"
                alt="Cassia Corviniy - Logotipo"
                className="w-full h-auto"
              />
              
              {/* Overlay gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--cassia-purple)]/15 via-transparent to-white/5" />
              
              {/* Borda interna */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/30" />
            </div>

            {/* Elementos decorativos flutuantes */}
            <motion.div
              className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-gradient-to-br from-[var(--cassia-purple)]/35 to-[var(--cassia-lavender)]/25"
              style={{ filter: 'var(--blur-mid)' }}
              animate={{ 
                y: [0, 18, 0],
                x: [0, 12, 0],
                opacity: [0.35, 0.65, 0.35],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-gradient-to-tl from-[var(--cassia-gold)]/35 to-[var(--cassia-gold-light)]/25"
              style={{ filter: 'var(--blur-mid)' }}
              animate={{ 
                y: [0, -18, 0],
                x: [0, -12, 0],
                opacity: [0.35, 0.65, 0.35],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Sparkles decorativos */}
            <motion.div
              className="absolute top-1/4 -right-4 w-3 h-3 rounded-full bg-[var(--cassia-gold)]"
              animate={{ 
                scale: [0, 1.2, 0],
                opacity: [0, 0.9, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
            <motion.div
              className="absolute bottom-1/3 -left-4 w-2 h-2 rounded-full bg-[var(--cassia-purple)]"
              animate={{ 
                scale: [0, 1.2, 0],
                opacity: [0, 0.9, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 1, delay: 1 }}
            />
            <motion.div
              className="absolute top-1/2 -right-8 w-2.5 h-2.5 rounded-full bg-[var(--cassia-lavender)]"
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 1.5, delay: 0.5 }}
            />
          </motion.div>
        </div>
      </div>

      {/* Partículas místicas */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            background: i % 2 === 0 ? 'rgba(255,255,255,0.85)' : 'rgba(190,185,208,0.9)',
            left: `${15 + Math.random() * 70}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -70, 0],
            opacity: [0, 0.5, 0],
            scale: [0, 1.2, 0],
          }}
          transition={{
            duration: 7 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut"
          }}
        />
      ))}
    </section>
  );
}


