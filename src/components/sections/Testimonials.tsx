import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const testimonials = [
  {
    id: 1,
    name: 'GEOVANO LEITE',
    text: 'Conheci a Cássia há pelo menos 5 anos, desde então muitas crenças vencidas e mais ainda, voltei a conversar e respeitar minha mãe, algo que não havia conseguido em mais de 20 anos mesmo frequentando igreja, esses foram alguns dos benefícios pessoais e na vida profissional, 1 dia após um ritual da prosperidade, desenvolvi a empresa que hoje realiza projetos pelo Brasil todo e gera muitos empregos diretos e indiretos!',
    rating: 5,
  },
  {
    id: 2,
    name: 'MAÍRA MENDONÇA',
    text: 'Fazer o curso da mesa violeta com a Ca foi um divisor de águas na minha vida! Tudo que precisou ser limpo foi tudo que precisou ficar ficou! A Ca é uma querida! Foi muito paciente e a didática foi ótima! Farei mais vezes e nao so esse! Que venha a mesa dourada! Obrigada.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Juliana Santos',
    text: 'Produtos de alta qualidade e energizados. A diferença é perceptível desde o primeiro uso.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 relative bg-gradient-to-b from-white to-[var(--cassia-lavender)]/10">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl text-[var(--cassia-purple-dark)] mb-4">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-lg text-[var(--cassia-purple-dark)]/70 max-w-2xl mx-auto">
            Mais de 6.500+ atendimentos realizados com resultados transformadores
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-white/90 backdrop-blur-sm border-[var(--cassia-border-soft)] hover:border-[var(--cassia-purple)] transition-all">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-[var(--cassia-gold)] mb-4" />
                  <p className="text-[var(--cassia-purple-dark)]/80 mb-4 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[var(--cassia-gold)] text-[var(--cassia-gold)]" />
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-[var(--cassia-purple-dark)]">
                    {testimonial.name}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

