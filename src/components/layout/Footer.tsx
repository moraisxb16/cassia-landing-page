import React from 'react';
import { Instagram, Heart, Sparkles, Youtube, Facebook } from 'lucide-react';
import { motion } from 'motion/react';

export function Footer() {
  return (
    <footer className="relative bg-[var(--cassia-surface)]/95 backdrop-blur-xl border-t border-[var(--cassia-border-soft)] py-16 overflow-hidden">
      {/* Animated background elements místicos */}
      <motion.div
        className="absolute top-0 left-1/4 w-64 h-64 bg-[var(--cassia-lavender)]/40 rounded-full blur-3xl"
        animate={{
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-64 h-64 bg-[var(--cassia-gold-light)]/40 rounded-full blur-3xl"
        animate={{
          y: [0, -50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-[var(--cassia-gold)]" />
              </motion.div>
              <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cassia-purple-dark)] to-[var(--cassia-purple)]">
                Cassia Corvini
              </h3>
            </div>
            <p className="text-[var(--cassia-purple-dark)]/72 text-sm leading-relaxed">
              Facilitadora de cura energética e professora do Sistema Dragonlight. 
              Ajudando pessoas a despertarem sua luz interior através da sabedoria ancestral.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-[var(--cassia-purple-dark)] mb-6">Links Rápidos</h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: '#services', label: 'Serviços' },
                { href: '#courses', label: 'Cursos Dragonlight' },
                { href: '#products', label: 'Produtos' },
              ].map((link, i) => (
                <motion.li 
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <a 
                    href={link.href} 
                    className="text-[var(--cassia-purple-dark)]/72 hover:text-[var(--cassia-purple)] transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[var(--cassia-purple)] group-hover:w-2 transition-all" />
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-[var(--cassia-purple-dark)] mb-6">Conecte-se</h4>
            
            <motion.a 
              href="https://www.instagram.com/cassiacorviniy/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--cassia-surface)]/95 backdrop-blur-sm border border-[var(--cassia-border-soft)] text-[var(--cassia-purple-dark)] hover:border-[var(--cassia-purple)] transition-all mb-6 group"
              style={{ boxShadow: 'var(--shadow-soft)' }}
              whileHover={{ scale: 1.02, x: 5, boxShadow: 'var(--shadow-medium)' }}
            >
              <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs text-[var(--cassia-purple)]">Siga no Instagram</div>
                <div className="text-sm">@cassiacorviniy</div>
              </div>
            </motion.a>

            <motion.a 
              href="https://www.youtube.com/@cassiacorviniy3950"
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--cassia-surface)]/95 backdrop-blur-sm border border-[var(--cassia-border-soft)] text-[var(--cassia-purple-dark)] hover:border-[var(--cassia-purple)] transition-all mb-6 group"
              style={{ boxShadow: 'var(--shadow-soft)' }}
              whileHover={{ scale: 1.02, x: 5, boxShadow: 'var(--shadow-medium)' }}
            >
              <Youtube className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs text-[var(--cassia-purple)]">Inscreva-se no YouTube</div>
                <div className="text-sm">@cassiacorviniy3950</div>
              </div>
            </motion.a>

            <motion.a 
              href="https://web.facebook.com/cassia.corvini"
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--cassia-surface)]/95 backdrop-blur-sm border border-[var(--cassia-border-soft)] text-[var(--cassia-purple-dark)] hover:border-[var(--cassia-purple)] transition-all mb-6 group"
              style={{ boxShadow: 'var(--shadow-soft)' }}
              whileHover={{ scale: 1.02, x: 5, boxShadow: 'var(--shadow-medium)' }}
            >
              <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs text-[var(--cassia-purple)]">Siga no Facebook</div>
                <div className="text-sm">/cassia.corvini</div>
              </div>
            </motion.a>
            
            <p className="text-sm text-[var(--cassia-purple-dark)]/72 leading-relaxed">
              Conteúdos diários sobre espiritualidade, rituais, dicas de cura energética e muito mais.
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="border-t border-[var(--cassia-border-soft)] pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[var(--cassia-purple-dark)]/72 text-sm flex items-center gap-2">
              Feito com <Heart className="w-4 h-4 fill-current text-[var(--cassia-gold)] animate-pulse" /> para sua jornada espiritual
            </p>
            <p className="text-[var(--cassia-purple-dark)]/60 text-xs">
              © 2026 Cássia Corviniy. Todos os direitos reservados.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}


