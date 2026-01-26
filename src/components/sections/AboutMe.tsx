import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export function AboutMe() {
  return (
    <section id="quem-eu-sou" className="py-20 md:py-28 relative bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-[var(--cassia-gold)]" />
            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--cassia-purple-dark)]">
              Quem Eu Sou
            </h2>
          </div>
          
          <div className="prose prose-lg max-w-none text-left mt-8">
            <p className="text-lg text-[var(--cassia-purple-dark)]/80 leading-relaxed mb-4">
              Sou <strong className="text-[var(--cassia-purple-dark)]">Cássia Corviniy</strong>, Terapeuta Integrativa, Mestre Dragonlight e Mentora do Desenvolvimento Humano.
            </p>
            <p className="text-lg text-[var(--cassia-purple-dark)]/80 leading-relaxed mb-4">
              Há mais de <strong>15 anos</strong> conduzo pessoas e há <strong>04</strong> líderes a romper bloqueios emocionais, ganhar clareza e viver com mais equilíbrio e direção.
            </p>
            <p className="text-lg text-[var(--cassia-purple-dark)]/80 leading-relaxed mb-4">
              Já realizei mais de <strong>6.500 atendimentos</strong> em mais de <strong>5 países</strong>, sou facilitadora de <strong>Desenvolvimento de Liderança Empresarial</strong> e criadora do <strong>Método Eu Me Vejo</strong>.
            </p>
            <p className="text-lg text-[var(--cassia-purple-dark)]/80 leading-relaxed mb-4">
              Acredito que quando você decide se transformar, tudo se torna possível.
            </p>
            <p className="text-lg text-[var(--cassia-purple-dark)]/80 leading-relaxed">
              Eu estou aqui para facilitar esse caminho.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

