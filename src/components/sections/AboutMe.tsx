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
              Sou <strong className="text-[var(--cassia-purple-dark)]">Cássia Corviniy</strong>, Terapeuta Integrativa, atuando há <strong>15 anos</strong>, com mais de <strong>6.500 atendimentos</strong> realizados em mais de <strong>5 países</strong>.
            </p>
            <p className="text-lg text-[var(--cassia-purple-dark)]/80 leading-relaxed mb-4">
              Sou facilitadora do processo de <strong>Desenvolvimento de Liderança Empresarial</strong> há 4 anos e criadora do <strong>Método Eu Me Vejo</strong>.
            </p>
            <p className="text-lg text-[var(--cassia-purple-dark)]/80 leading-relaxed">
              Acredito que quando uma pessoa <strong>QUER</strong> se transformar, ela pode tudo — e eu estou aqui para facilitar o seu processo. <strong>Boraaaa?!</strong>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

