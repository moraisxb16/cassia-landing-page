import { Instagram, Heart, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function Footer() {
  return (
    <footer className="relative bg-white/60 backdrop-blur-xl border-t border-[#A275E3]/20 py-16 overflow-hidden">
      {/* Animated background elements místicos */}
      <motion.div
        className="absolute top-0 left-1/4 w-64 h-64 bg-[#A275E3]/10 rounded-full blur-3xl"
        animate={{
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#F8E3BB]/20 rounded-full blur-3xl"
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
                <Sparkles className="w-8 h-8 text-[#CFAF63]" />
              </motion.div>
              <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-[#8A4FC3] to-[#A275E3]">
                Cassia Corvini
              </h3>
            </div>
            <p className="text-[#8A4FC3]/70 text-sm leading-relaxed">
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
            <h4 className="text-[#8A4FC3] mb-6">Links Rápidos</h4>
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
                    className="text-[#8A4FC3]/70 hover:text-[#A275E3] transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#A275E3] group-hover:w-2 transition-all" />
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
            <h4 className="text-[#8A4FC3] mb-6">Conecte-se</h4>
            
            <motion.a 
              href="https://www.instagram.com/cassiacorviniy/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-[#A275E3]/30 text-[#8A4FC3] hover:border-[#A275E3]/50 transition-all mb-6 group"
              style={{ boxShadow: 'var(--shadow-soft)' }}
              whileHover={{ scale: 1.02, x: 5, boxShadow: 'var(--shadow-medium)' }}
            >
              <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs text-[#A275E3]">Siga no Instagram</div>
                <div className="text-sm">@cassiacorviniy</div>
              </div>
            </motion.a>
            
            <p className="text-sm text-[#8A4FC3]/70 leading-relaxed">
              Conteúdos diários sobre espiritualidade, rituais, dicas de cura energética e muito mais.
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="border-t border-[#A275E3]/20 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#8A4FC3]/70 text-sm flex items-center gap-2">
              Feito com <Heart className="w-4 h-4 fill-current text-[#A275E3] animate-pulse" /> para sua jornada espiritual
            </p>
            <p className="text-[#8A4FC3]/60 text-xs">
              © 2025 Cassia Corvini. Todos os direitos reservados.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}


