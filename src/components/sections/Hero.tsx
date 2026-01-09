import React from 'react';
import { Button } from '../ui/button';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../shared/ImageWithFallback';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden cassia-hero-gradient min-h-screen flex items-center">
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

      {/* Partículas místicas flutuantes melhoradas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => {
          const randomX = Math.random();
          const randomY = Math.random();
          const size = Math.random() * 4 + 2;
          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${randomX * 100}%`,
                top: `${randomY * 100}%`,
                background: 'radial-gradient(circle, rgba(248, 227, 187, 0.8) 0%, rgba(207, 175, 99, 0.4) 50%, transparent 100%)',
              }}
              animate={{
                y: [0, -80 - Math.random() * 40, -120 - Math.random() * 40],
                x: [0, (randomX - 0.5) * 100, (randomX - 0.5) * 160],
                opacity: [0, 0.8, 0.6, 0],
                scale: [0, 1, 1, 0],
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Foto da Cássia - Centralizada acima do título */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative inline-block">
              <div 
                className="absolute inset-0 rounded-full -z-10"
                style={{
                  border: '4px solid #CFAF63',
                  boxShadow: '0 0 0 8px rgba(207, 175, 99, 0.2), 0 0 40px rgba(207, 175, 99, 0.5), 0 8px 32px rgba(162, 117, 227, 0.3)',
                }}
              />
              <ImageWithFallback
                src="https://via.placeholder.com/140x140/CFAF63/FFFFFF?text=C%C3%A1ssia"
                alt="Cássia Corviniy"
                className="w-[140px] h-[140px] rounded-full object-cover"
                style={{
                  border: '4px solid #CFAF63',
                }}
              />
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 hero-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <Sparkles className="w-4 h-4 text-[var(--cassia-gold)]" />
            <span className="text-[var(--cassia-purple-dark)] text-sm">✨ Transformação Mental, Física e Espiritual</span>
          </motion.div>

          {/* Título Principal - 60px com gradiente holográfico */}
          <motion.h2
            className="hero-title text-[48px] md:text-[60px] font-bold leading-[1.15] mb-6"
            style={{
              letterSpacing: '-0.02em',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            QUERER é o início de toda transformação.
          </motion.h2>
          
          {/* Subtítulo - 20px, visível, opacity 0.95 */}
          <motion.p
            className="hero-subtitle text-lg md:text-[20px] leading-[1.6] text-[#FDF6FF] font-normal max-w-[650px] mx-auto mb-10"
            style={{ opacity: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Terapeuta Holística e Mestra Dragonlight, guiando sua jornada de autoconhecimento e transformação espiritual.
          </motion.p>

          {/* CTA Principal - Premium com sombra pulsante */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              className="hero-cta inline-flex items-center gap-3 bg-gradient-to-r from-[#A275E3] to-[#8A4FC3] text-white font-semibold rounded-2xl border-none cursor-pointer"
              style={{
                padding: '20px 48px',
                fontSize: '19px',
                fontWeight: 600,
              }}
              whileHover={{ 
                y: -4,
                scale: 1.03,
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('diagnostico')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Sparkles size={20} />
              Começar Minha Transformação
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Logo pequeno no canto inferior direito (opcional) */}
      <motion.div
        className="absolute bottom-10 right-10 opacity-85 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{ delay: 1.2 }}
      >
        <div className="w-[120px] h-auto">
          <ImageWithFallback
            src="https://i.ibb.co/prygpWrC/Logotipo-C-ssia-Corviniy-9-1.jpg"
            alt="Cássia Corviniy - Logotipo"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </motion.div>
    </section>
  );
}
