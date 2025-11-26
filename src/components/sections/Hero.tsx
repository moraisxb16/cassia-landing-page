import { Button } from '../ui/button';
import { Sparkles, Heart, Moon, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../shared/ImageWithFallback';

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden cassia-hero-gradient">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-[var(--cassia-purple)]/30 mb-8"
              style={{ boxShadow: 'var(--shadow-soft)' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-[var(--cassia-gold)]" />
              <span className="text-[var(--cassia-purple-dark)] text-sm">Transformação Espiritual</span>
            </motion.div>
            
            {/* Título Principal */}
            <motion.h2 
              className="text-5xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-[var(--cassia-purple-dark)] via-[var(--cassia-purple)] to-[var(--cassia-gold)] leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Desperte Sua Luz Interior
            </motion.h2>
            
            {/* Descrição */}
            <motion.p 
              className="text-lg md:text-xl text-[var(--cassia-night)]/80 max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Descubra o poder da cura energética através dos Cursos Dragonlight 
              e produtos holísticos para transformar sua vida espiritual.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  className="w-full sm:w-auto bg-gradient-to-r from-[var(--cassia-purple-dark)] to-[var(--cassia-purple)] hover:opacity-90 text-white border-0 px-10 py-6 text-base"
                  style={{ boxShadow: 'var(--shadow-glow)' }}
                  onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Explorar Cursos
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline"
                  className="w-full sm:w-auto border-[var(--cassia-purple)]/40 bg-white/80 backdrop-blur-sm text-[var(--cassia-purple-dark)] hover:bg-[var(--cassia-purple)]/10 hover:border-[var(--cassia-purple)]/60 px-10 py-6 text-base"
                  style={{ boxShadow: 'var(--shadow-soft)' }}
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Ver Produtos
                </Button>
              </motion.div>
            </motion.div>

            {/* Pills de benefícios */}
            <motion.div 
              className="flex flex-wrap gap-3 justify-center"
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
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-[var(--cassia-purple)]/20"
                    style={{ boxShadow: 'var(--shadow-soft)' }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Icon className="w-4 h-4 text-[var(--cassia-purple)]" />
                    <span className="text-sm text-[var(--cassia-night)]/80">{item.text}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Imagem Hero */}
          <motion.div 
            className="relative max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
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
              className="relative rounded-3xl overflow-hidden border-2 border-white/70"
              style={{ boxShadow: 'var(--shadow-strong)' }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1608581821109-f825056e31c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsaW5nJTIwY3J5c3RhbHMlMjBlc3NlbnRpYWwlMjBvaWxzJTIwemVufGVufDF8fHx8MTc2MzY1MzMzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Cristais, Óleos Essenciais e Produtos Holísticos"
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
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            background: i % 3 === 0 ? 'var(--cassia-purple)' : i % 3 === 1 ? 'var(--cassia-gold)' : 'var(--cassia-lavender)',
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


