import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../shared/ImageWithFallback';

export function Hero() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);
  return (
    <section className="hero-section relative overflow-hidden cassia-hero-gradient min-h-screen flex items-center justify-center">
      {/* Overlay sutil sobre o gradiente animado */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10" />
      
      {/* Logo como Background Decorativo - APENAS DESKTOP */}
      <div className="hidden md:block absolute inset-0 flex items-center justify-center pointer-events-none hero-logo-bg-wrapper" style={{ zIndex: 0 }}>
        <motion.div
          className="hero-logo-bg w-full h-full flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <ImageWithFallback
            src="https://i.ibb.co/rGPhdZm2/Logotipo-C-ssia-Corviniy-9-1.jpg"
            alt=""
            className="hero-logo-bg-image"
            style={{
              objectPosition: 'center center',
            }}
          />
        </motion.div>
      </div>
      
      {/* Orbs de luz místicos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
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
      </div>

      {/* Partículas místicas flutuantes - 30 elementos dourados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
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
      
      {/* Conteúdo principal - ACIMA do background */}
      <div className="container mx-auto px-4 relative" style={{ zIndex: 1 }}>
        <div className="hero-content max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Logo/Foto da Cássia - WRAPPER ÚNICO COM LAYOUT NORMAL (mobile: acima do título) */}
          <motion.div
            className="hero-logo mb-6 md:mb-8 relative mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* FOTO - CENTRALIZADA */}
            <div className="relative">
              <ImageWithFallback
                src="https://i.ibb.co/mrqZ8sdn/a08e4f14-4dd8-421d-a7b0-ca30d2d87a11.png"
                alt="Cássia Corviniy - Terapeuta Holística"
                className="w-[85vw] max-w-[900px] object-cover mx-auto block"
                style={{
                  width: isDesktop ? '700px' : undefined,
                  height: isDesktop ? '450px' : '200px',
                  borderRadius: '48% 52% 54% 46% / 68% 32% 68% 32%',
                  boxShadow: '0 8px 32px rgba(162, 117, 227, 0.35), 0 4px 16px rgba(138, 79, 195, 0.25), 0 0 80px rgba(162, 117, 227, 0.2)',
                }}
              />
            </div>
          </motion.div>

          {/* HEADLINE PRINCIPAL - MAIOR E EM NEGRITO - Controlado via CSS */}
          <motion.h2
            className="hero-headline text-center mb-3 text-[22px] md:text-[30px]"
            style={{
              fontWeight: 700,
              color: '#FFFFFF',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            ✨ Transformação Mental, Física e Espiritual
          </motion.h2>

          {/* SUBHEADLINE - MAIOR - Controlado via CSS */}
          <motion.h2
            className="hero-subheadline text-center mb-4 text-[18px] md:text-[24px]"
            style={{
              color: '#FFFFFF',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <strong style={{ fontWeight: 700 }}>QUERER</strong> é o início de toda transformação.
          </motion.h2>
          
          {/* DESCRIÇÃO - MAIOR - Controlado via CSS */}
          <motion.p
            className="hero-description-text text-center mb-6 text-[14px] md:text-[18px]"
            style={{ color: '#FFFFFF', opacity: 1 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <strong>Terapeuta Holística e Mestra Dragonlight,</strong> guiando sua jornada de autoconhecimento e transformação espiritual.
          </motion.p>

          {/* CTA Principal - Premium com glow pulsante forte */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              className="hero-cta inline-flex items-center gap-2 md:gap-3 text-white font-semibold border-none cursor-pointer mt-8 text-[18px] md:text-[26px] w-[90vw] max-w-[320px] md:w-[480px] md:mx-[10px] py-3 md:py-5 px-4 md:px-8"
              style={{
                fontWeight: 600,
                background: 'linear-gradient(15deg, rgba(162, 117, 227, 1) 0%, rgba(0, 0, 0, 1) 100%)',
                borderRadius: '20px',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
                borderBottomRightRadius: '20px',
                borderBottomLeftRadius: '20px',
              }}
              whileHover={{ 
                y: -4,
                scale: 1.03,
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('diagnostico')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
              Começar a minha transformação
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
