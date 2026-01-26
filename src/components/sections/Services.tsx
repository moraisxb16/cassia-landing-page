import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const services = [
  {
    title: 'Terapia em Grupo – 100% online (Zoom)',
    description: 'Terapia em Grupo – Cuidando da DOR\n\nO que é:\nEspaço seguro e acolhedor de escuta e consciência, onde olhamos para nossas dores com respeito e profundidade.\nAo final de cada encontro haverá uma prática de encerramento: meditação guiada, mensagens de reflexão, exercícios sistêmicos ou constelação.\n\nFormato:\n• 100% online (Zoom)\n• Quartas-feiras\n• 19h30 às 20h30\n• Quinzenal\n\nParticipação:\n• 3 meses –\n• 6 meses –\n• 12 meses –\n\nConsultar valores',
  },
  {
    title: 'Mentoria em Grupo – Método EMV (Eu Me Vejo)',
    description: 'Organiza o Caminho\n\nO que é:\nEspaço de direcionamento consciente para mulheres que desejam clareza emocional para organizar escolhas e avançar com consciência na vida.\n\nFormato:\n• Dois sábados por mês\n• 15h às 18h\n\nInvestimento:\n(Manter configurável)',
  },
  {
    title: 'Atendimentos Individuais – Mandala Dragonlight',
    description: 'Atendimento individual com a Mandala Radiônica Dragonlight.',
  },
  {
    title: 'Atendimentos Individuais – Dragon Coaching',
    description: 'Atendimento individual de coaching com ferramentas energéticas Dragonlight.',
  },
  {
    title: 'Atendimentos Residenciais',
    description: 'Atendimentos realizados na residência do cliente.',
  },
  {
    title: 'Atendimentos Empresariais',
    description: 'Saúde Mental (NR1), Desenvolvimento de Líderes, Palestras e Oficinas.',
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 relative">
      {/* Background místico suave */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--cassia-lavender)]/10 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-[var(--cassia-purple)]/30 mb-6"
            style={{ boxShadow: 'var(--shadow-soft)' }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5 text-[var(--cassia-gold)]" />
            <span className="text-[var(--cassia-purple-dark)]">Nossos Serviços</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[var(--cassia-purple-dark)] via-[var(--cassia-purple)] to-[var(--cassia-gold)] mb-6">
            Caminhos para sua transformação
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div 
                  className="group relative overflow-hidden bg-white/95 backdrop-blur-sm border border-[var(--cassia-purple)]/20 rounded-2xl p-6 h-full hover:border-[var(--cassia-purple)] transition-all duration-500"
                  style={{ boxShadow: 'var(--shadow-soft)' }}
                >
                  <h3 className="text-lg font-semibold text-[var(--cassia-purple-dark)] mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-[var(--cassia-purple-dark)]/72 text-sm leading-relaxed whitespace-pre-line">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
