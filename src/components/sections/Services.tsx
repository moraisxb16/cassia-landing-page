import { Sparkles, Heart, Moon, Star, Flame, Eye } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { motion } from 'motion/react';

const services = [
  {
    icon: Sparkles,
    title: 'Leitura Energética',
    description: 'Análise profunda do seu campo energético para identificar bloqueios e potenciais de crescimento espiritual.',
    gradient: 'from-[var(--cassia-purple)] to-[var(--cassia-lavender)]',
    bg: 'bg-[var(--cassia-purple)]/5',
  },
  {
    icon: Heart,
    title: 'Terapia Holística',
    description: 'Sessões personalizadas de cura energética para equilibrar corpo, mente e espírito.',
    gradient: 'from-[var(--cassia-lavender)] to-[var(--cassia-purple)]',
    bg: 'bg-[var(--cassia-lavender)]/10',
  },
  {
    icon: Moon,
    title: 'Ritual Lunar',
    description: 'Cerimônias especiais alinhadas com as fases da lua para manifestação e liberação.',
    gradient: 'from-[var(--cassia-purple-dark)] to-[var(--cassia-purple)]',
    bg: 'bg-[var(--cassia-purple-dark)]/5',
  },
  {
    icon: Star,
    title: 'Mapa Astral',
    description: 'Compreenda sua essência através da interpretação dos astros e seu propósito de vida.',
    gradient: 'from-[var(--cassia-gold)] to-[var(--cassia-gold-light)]',
    bg: 'bg-[var(--cassia-gold-light)]/20',
  },
  {
    icon: Flame,
    title: 'Ativação de Chakras',
    description: 'Harmonização e desbloqueio dos centros energéticos para maior vitalidade.',
    gradient: 'from-[var(--cassia-purple)] to-[var(--cassia-gold)]',
    bg: 'bg-[var(--cassia-purple)]/8',
  },
  {
    icon: Eye,
    title: 'Consulta Espiritual',
    description: 'Orientação personalizada para questões do seu caminho espiritual e desenvolvimento pessoal.',
    gradient: 'from-[var(--cassia-purple-dark)] to-[var(--cassia-lavender)]',
    bg: 'bg-[var(--cassia-lavender)]/15',
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
            Caminhos para Sua Transformação
          </h2>
          
          <p className="text-lg text-[var(--cassia-purple-dark)]/70 max-w-3xl mx-auto">
            Oferecemos uma variedade de serviços espirituais para apoiar sua jornada 
            de autoconhecimento e cura interior.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`group relative overflow-hidden bg-[var(--cassia-surface)]/95 backdrop-blur-sm border-[var(--cassia-border-soft)] hover:border-[var(--cassia-purple)] transition-all duration-500 h-full ${service.bg}`}
                  style={{ boxShadow: 'var(--shadow-soft)' }}
                >
                  {/* Animated gradient background on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    initial={false}
                  />
                  
                  <CardContent className="p-6 relative z-10">
                    <motion.div 
                      className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-5`}
                      style={{ boxShadow: 'var(--shadow-medium)' }}
                      whileHover={{ 
                        rotate: [0, -10, 10, -10, 0],
                        scale: 1.1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl text-[var(--cassia-purple-dark)] mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--cassia-purple-dark)] group-hover:to-[var(--cassia-gold)] transition-all">
                      {service.title}
                    </h3>
                    
                    <p className="text-[var(--cassia-purple-dark)]/72 text-sm leading-relaxed">
                      {service.description}
                    </p>

                    {/* Decorative corner */}
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 rounded-bl-3xl transition-opacity`} />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-[var(--cassia-purple-dark)]/72">
            Entre em contato pelo{' '}
            <a 
              href="https://www.instagram.com/cassiacorviniy/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cassia-purple)] to-[var(--cassia-gold)] hover:from-[var(--cassia-gold)] hover:to-[var(--cassia-purple)] underline underline-offset-4 transition-all"
            >
              Instagram
            </a>
            {' '}para agendar sua sessão
          </p>
        </motion.div>
      </div>
    </section>
  );
}


