import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export function MyTools() {
  const tools = [
    'Mandala Radiônica Dragonlight',
    'Aromaterapia',
    'Reiki',
    'Apometria',
    'Cromoterapia Mental',
    "Ho'oponopono",
    'Perfil Comportamental (software)',
    'Mediunidade e conexão espiritual',
    'Exercícios Sistêmicos e Constelações',
  ];

  return (
    <section id="minhas-ferramentas" className="py-20 md:py-28 relative bg-gradient-to-b from-[var(--cassia-lavender)]/10 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-[var(--cassia-gold)]" />
              <h2 className="text-3xl md:text-4xl font-semibold text-[var(--cassia-purple-dark)]">
                Minhas Ferramentas
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                className="bg-white p-4 rounded-xl border border-[var(--cassia-purple)]/20 shadow-sm text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, shadow: 'md' }}
              >
                <p className="text-[var(--cassia-purple-dark)] font-medium">{tool}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

