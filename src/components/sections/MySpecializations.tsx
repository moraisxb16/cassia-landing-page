import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Award } from 'lucide-react';

export function MySpecializations() {
  const specializations = [
    {
      title: 'Comunicadora e Publicitária',
      institution: 'Faculdades Anhanguera',
      year: '2003',
    },
    {
      title: 'Aromaterapeuta Clínica',
      institution: 'Aromaluz',
      period: '2007–2011',
    },
    {
      title: 'Mestre e Terapeuta Dragonlight',
      institution: 'Dragon Energy Center',
      period: 'Brasil 2016 / Irlanda 2019',
    },
    {
      title: 'Formação Internacional em Conhecimentos Sistêmicos e Constelações Familiares',
      institution: 'Faculdade Fex Educação',
      year: '2024',
    },
    {
      title: 'Gestora das Emoções',
      institution: 'Grupo Altis',
      year: '2025',
    },
    {
      title: 'Mais de 8 anos de voluntariado em Apometria',
      institution: '',
      year: '',
    },
  ];

  return (
    <section id="minhas-especializacoes" className="py-20 md:py-28 relative bg-white">
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
              <GraduationCap className="w-5 h-5 text-[var(--cassia-gold)]" />
              <h2 className="text-3xl md:text-4xl font-semibold text-[var(--cassia-purple-dark)]">
                Minhas Especializações
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {specializations.map((spec, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-r from-white to-[var(--cassia-lavender)]/5 p-6 rounded-xl border border-[var(--cassia-purple)]/20 shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Award className="w-5 h-5 text-[var(--cassia-purple)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--cassia-purple-dark)] mb-1">
                      {spec.title}
                    </h3>
                    {spec.institution && (
                      <p className="text-[var(--cassia-purple-dark)]/70">
                        {spec.institution}
                        {(spec.year || spec.period) && (
                          <span className="ml-2 text-[var(--cassia-gold)] font-medium">
                            {spec.year || spec.period}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

