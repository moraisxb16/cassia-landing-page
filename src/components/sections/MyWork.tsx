import React from 'react';
import { motion } from 'motion/react';
import { Brain, Heart, Sparkles } from 'lucide-react';

export function MyWork() {
  return (
    <section id="meu-trabalho" className="py-20 md:py-28 relative bg-gradient-to-b from-white to-[var(--cassia-lavender)]/10">
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
                Meu Trabalho
              </h2>
            </div>
            <p className="text-lg text-[var(--cassia-purple-dark)]/80 max-w-2xl mx-auto">
              Meu trabalho une abordagem <strong>Mental, Física e Espiritual</strong>.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <motion.div
              className="bg-white p-6 rounded-2xl border border-[var(--cassia-purple)]/20 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-[var(--cassia-purple)]/10">
                  <Brain className="w-6 h-6 text-[var(--cassia-purple)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--cassia-purple-dark)]">Mental</h3>
              </div>
              <p className="text-[var(--cassia-purple-dark)]/80">
                Pensamentos, comportamentos e crenças.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-2xl border border-[var(--cassia-purple)]/20 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-[var(--cassia-gold)]/10">
                  <Heart className="w-6 h-6 text-[var(--cassia-gold)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--cassia-purple-dark)]">Físico</h3>
              </div>
              <p className="text-[var(--cassia-purple-dark)]/80">
                O corpo físico e os ambientes onde você está inserido (casa e trabalho).
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-2xl border border-[var(--cassia-purple)]/20 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-[var(--cassia-lavender)]/10">
                  <Sparkles className="w-6 h-6 text-[var(--cassia-lavender)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--cassia-purple-dark)]">Espiritual</h3>
              </div>
              <p className="text-[var(--cassia-purple-dark)]/80">
                Não se refere à religião, mas a algo maior — energia, natureza ou, para quem fizer sentido, Deus.
              </p>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 text-center p-6 bg-gradient-to-r from-[var(--cassia-purple)]/10 to-[var(--cassia-gold)]/10 rounded-2xl border border-[var(--cassia-purple)]/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-lg text-[var(--cassia-purple-dark)]/90 font-medium">
              Nos afastamos de partes de nós ao longo da vida, mas nossa essência sempre foi integrada.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

