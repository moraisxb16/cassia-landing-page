import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../shared/ImageWithFallback';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden cassia-hero-gradient min-h-screen flex items-center justify-center">
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

      {/* Partículas místicas flutuantes - 30 elementos dourados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => {
          const randomX = Math.random();
          const randomY = Math.random();
          const size = Math.random() * 3 + 1;
          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full bg-[#F8E3BB]"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${randomX * 100}%`,
                top: `${randomY * 100}%`,
                opacity: 0.6,
              }}
              animate={{
                y: [0, -80 - Math.random() * 40, -120 - Math.random() * 40],
                x: [0, (randomX - 0.5) * 100, (randomX - 0.5) * 160],
                opacity: [0, 0.6, 1, 0.4, 0],
                scale: [0, 1, 1.5, 1, 0.5],
              }}
              transition={{
                duration: 10 + Math.random() * 15,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="hero-content max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
          {/* Foto da Cássia - Centralizada acima do título */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative inline-block">
              <div className="relative">
                <ImageWithFallback
                  src="https://i.ibb.co/rGPhdZm2/Logotipo-C-ssia-Corviniy-9-1.jpg"
                  alt="Cássia Corviniy - Terapeuta Holística"
                  className="w-[140px] h-[140px] md:w-[160px] md:h-[160px] rounded-full object-cover border-4 border-[#CFAF63]"
                  style={{
                    boxShadow: '0 0 0 8px rgba(207, 175, 99, 0.2), 0 0 40px rgba(207, 175, 99, 0.5), 0 8px 32px rgba(162, 117, 227, 0.3)',
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full hero-badge"
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
            className="hero-title text-[48px] md:text-[56px] lg:text-[60px] font-bold leading-[1.2]"
            style={{
              letterSpacing: '-0.02em',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            QUERER é o início de toda transformação.
          </motion.h2>
          
          {/* Subtítulo - 20px, opacity 0.95, text-shadow */}
          <motion.p
            className="hero-subtitle text-lg md:text-[20px] leading-[1.6] text-[#FDF6FF] font-normal max-w-[650px] mx-auto"
            style={{ 
              opacity: 0.95,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Terapeuta Holística e Mestra Dragonlight, guiando sua jornada de autoconhecimento e transformação espiritual.
          </motion.p>

          {/* CTA Principal - Premium com glow pulsante forte */}
          <motion.div
            className="flex justify-center mt-4"
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
              <Sparkles className="w-5 h-5" />
              Começar a minha transformação
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
