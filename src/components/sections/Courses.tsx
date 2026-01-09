import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, Users, Award, Sparkles, Package, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../shared/ImageWithFallback';
import { useCart } from '../../cart/useCart';
import type { Course } from '../../types';

// Imagem padrão para cursos
const defaultCourseImage = 'https://images.unsplash.com/photo-1643682661044-f0c34205dd65?auto=format&fit=crop&w=1080&q=80';

const courses: Course[] = [
  // CURSOS
  {
    id: 'mesa-dragon-coaching',
    name: 'Curso Mesa Dragon Coaching',
    description: 'Ferramenta de limpeza e cocriação para acelerar resultados, trabalhando intenção e clareza energética.',
    price: 1497.00,
    hours: '8h',
    includes: 'Mesa Dragon Coaching, pêndulo, cartas, apostila e certificado PDF',
    updatePrice: 748.50,
    image: 'https://i.ibb.co/S4BXv22Y/Whats-App-Image-2025-12-26-at-11-03-29-1.jpg',
    type: 'course',
    category: 'course',
    level: 'Para todos',
    gradient: 'from-[var(--cassia-purple)] to-[var(--cassia-purple-dark)]',
  },
  {
    id: 'mesa-turquesa-dragonlight',
    name: 'Curso Mesa Turquesa Dragonlight',
    description: 'Curso introdutório para terapeutas. Trabalha identidade, futuro, carma familiar e técnicas de atendimento energético.',
    price: 2257.00,
    hours: '16h',
    includes: 'Mesa Turquesa, cartas, pêndulo, 09 essências, apostila, certificado PDF',
    updatePrice: 1128.00,
    image: defaultCourseImage,
    type: 'course',
    category: 'course',
    level: 'Iniciante',
    gradient: 'from-[var(--cassia-purple)] to-[var(--cassia-lavender)]',
  },
  {
    id: 'mesa-violet-dragonlight',
    name: 'Curso Mesa Violet Dragonlight',
    description: 'Expansão da Mesa Turquesa. Aprofunda sabedoria espiritual, limpeza energética profunda e conexão com equipe espiritual.',
    price: 2529.00,
    hours: '22h',
    includes: 'Mesa Violeta, pêndulo, cristal, apostila, certificado PDF',
    updatePrice: 1264.50,
    image: 'https://i.ibb.co/yc6CSBbC/Whats-App-Image-2025-12-26-at-11-03-29.jpg',
    type: 'course',
    category: 'course',
    level: 'Intermediário',
    gradient: 'from-[var(--cassia-purple-dark)] to-[var(--cassia-gold)]',
  },
  // ATENDIMENTOS
  {
    id: 'mesa-radionica-dragonlight',
    name: 'Atendimento Individual – Mesa Radiônica Dragonlight',
    description: 'Ferramenta de autoconhecimento que atua em três pilares: limpeza energética em todos os níveis, fortalecimento da verdadeira identidade e cocriação dos desejos do coração. Trabalho sutil e profundo, com reflexos no campo físico, emocional e espiritual.',
    price: 630.00,
    image: 'https://i.ibb.co/MxV5TLjC/Whats-App-Image-2026-01-06-at-08-52-06.jpg',
    type: 'service',
    category: 'service',
    format: 'Individual',
    gradient: 'from-[var(--cassia-gold)] to-[var(--cassia-gold-light)]',
  },
  {
    id: 'dragon-coaching',
    name: 'Atendimento Individual – Dragon Coaching',
    description: 'Atendimento de coaching com ferramentas energéticas Dragonlight para acelerar resultados, trabalhando intenção e clareza energética.',
    price: 630.00,
    image: 'https://i.ibb.co/xSNnYm7r/Whats-App-Image-2026-01-06-at-14-59-46.jpg',
    type: 'service',
    category: 'service',
    format: 'Individual',
    gradient: 'from-[var(--cassia-lavender)] to-[var(--cassia-purple)]',
  },
  {
    id: 'mesa-burgundy-conexoes-familiares',
    name: 'Mesa Burgundy – Conexões Familiares',
    description: 'Trabalho profundo de conexão e cura familiar através da Mesa Burgundy, abordando padrões ancestrais e fortalecendo vínculos familiares.',
    price: 630.00,
    image: 'https://i.ibb.co/tT0qgwvz/Whats-App-Image-2025-12-26-at-11-03-29-2.jpg',
    type: 'service',
    category: 'service',
    format: 'Individual',
    gradient: 'from-[var(--cassia-purple)] to-[var(--cassia-gold)]',
  },
  {
    id: 'mesa-dourada',
    name: 'Mesa Dourada',
    description: 'Atendimento com a Mesa Dourada, ferramenta de alta vibração para expansão espiritual e manifestação de desejos do coração.',
    price: 630.00,
    image: 'https://i.ibb.co/b5849Yy3/Whats-App-Image-2025-12-26-at-11-03-29-3.jpg',
    type: 'service',
    category: 'service',
    format: 'Individual',
    gradient: 'from-[var(--cassia-gold)] to-[var(--cassia-purple-dark)]',
  },
  {
    id: 'mesa-violeta',
    name: 'Mesa Violeta',
    description: 'Atendimento com a Mesa Violeta, ferramenta de expansão espiritual e limpeza energética profunda.',
    price: 630.00,
    image: 'https://i.ibb.co/PZK8rYtq/506dc70c-6ea6-4de9-ae18-efddc8fb11b4.jpg',
    type: 'service',
    category: 'service',
    format: 'Individual',
    gradient: 'from-[var(--cassia-purple-dark)] to-[var(--cassia-lavender)]',
  },
  // MENTORIA
  {
    id: 'mentoria-grupo',
    name: 'Mentoria em Grupo – Novo Programa',
    description: 'Encontros online e ao vivo para fortalecimento da autoestima, foco e autoconhecimento. Uma jornada profunda de cura e transformação abordando temas como Criança Interior, Adolescente, Relação com Pais e muito mais.',
    price: 2100.00,
    format: '10 meses / 2 encontros mensais',
    image: defaultCourseImage,
    type: 'mentoring',
    category: 'mentoring',
    gradient: 'from-[var(--cassia-gold)] to-[var(--cassia-purple-dark)]',
  },
];

export function Courses() {
  const { addItem } = useCart();

  // Separar por categoria
  const coursesList = courses.filter(c => c.category === 'course');
  // Apenas 2 atendimentos específicos
  const servicesList = courses.filter(c => 
    c.category === 'service' && 
    (c.id === 'mesa-radionica-dragonlight' || c.id === 'dragon-coaching')
  );
  const mentoringList = courses.filter(c => c.category === 'mentoring');

  const renderCourseCard = (course: Course, index: number) => (
    <motion.div
      key={course.id}
      className="h-full"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      style={{ padding: 0, margin: 0 }}
    >
      <Card 
        className="overflow-hidden bg-[var(--cassia-surface)]/95 backdrop-blur-sm border border-[var(--cassia-purple)]/20 rounded-2xl hover:border-[var(--cassia-purple)]/40 transition-all duration-300 ease-out group h-full flex flex-col"
        style={{ 
          boxShadow: 'var(--shadow-md)',
          minHeight: course.category === 'service' ? '320px' : 'auto',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          e.currentTarget.style.transform = 'scale(1.03)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <div className={`relative w-full overflow-hidden rounded-t-2xl ${course.category === 'service' ? 'h-[200px]' : 'aspect-video'}`} style={{ padding: 0, margin: 0 }}>
          <ImageWithFallback
            src={course.image}
            alt={course.name}
            className="w-full h-full"
            style={{ 
              objectFit: 'cover',
              objectPosition: 'center center',
              width: '100%',
              height: '100%',
              display: 'block',
              imageRendering: 'auto'
            }}
          />
          
          {course.level && (
            <motion.div
              className="absolute top-3 right-3"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Badge 
                className={`bg-gradient-to-r ${course.gradient || 'from-[var(--cassia-purple)] to-[var(--cassia-gold)]'} border-0 text-white px-3 py-1 text-xs`}
                style={{ boxShadow: 'var(--shadow-medium)' }}
              >
                {course.level}
              </Badge>
            </motion.div>
          )}
        </div>
        
        <CardContent className={course.category === 'service' ? 'p-4 px-5 flex-grow flex flex-col gap-2' : 'p-5 flex-grow flex flex-col gap-3'}>
          <h3 className={course.category === 'service' ? 'text-base font-semibold text-[var(--cassia-purple-dark)] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--cassia-purple-dark)] group-hover:to-[var(--cassia-gold)] transition-all line-clamp-2' : 'text-lg font-semibold text-[var(--cassia-purple-dark)] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--cassia-purple-dark)] group-hover:to-[var(--cassia-gold)] transition-all line-clamp-2'}>
            {course.name}
          </h3>
          
          <p className={course.category === 'service' ? 'text-xs text-[var(--cassia-purple-dark)]/72 leading-relaxed flex-grow line-clamp-2' : 'text-sm text-[var(--cassia-purple-dark)]/72 leading-relaxed flex-grow line-clamp-2'}>
            {course.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--cassia-purple-dark)]/80">
            {course.hours && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{course.hours}</span>
              </span>
            )}
            {course.format && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{course.format}</span>
              </span>
            )}
            {(course.type === 'course' || course.type === 'mentoring') && (
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Certificado</span>
              </span>
            )}
          </div>

          <div className="mt-auto">
            <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--cassia-purple-dark)] to-[var(--cassia-gold)]">
              R$ {course.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            {course.updatePrice && (
              <div className="text-xs text-[var(--cassia-purple-dark)]/70 mt-0.5">
                Atualização: R$ {course.updatePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0 mt-auto">
          <motion.div 
            className="w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              className={`w-full bg-gradient-to-r ${course.gradient || 'from-[var(--cassia-purple)] to-[var(--cassia-gold)]'} hover:opacity-95 text-white border-0 font-semibold ${course.category === 'service' ? 'min-h-[40px] text-sm' : 'min-h-[44px] text-base'} rounded-xl transition-all duration-300 ease-out`}
              style={{ 
                boxShadow: '0 4px 16px rgba(162, 117, 227, 0.4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(162, 117, 227, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(162, 117, 227, 0.4)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onClick={() =>
                addItem({
                  id: course.id,
                  name: course.name,
                  price: course.price,
                  image: course.image,
                  type: course.type === 'service' ? 'service' : course.type === 'mentoring' ? 'mentoring' : 'course',
                })
              }
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Adicionar ao Carrinho
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );

  return (
    <section id="courses" className="py-24 md:py-32 relative">
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--cassia-lavender)]/40 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Badge 
              className="px-6 py-2 bg-gradient-to-r from-[var(--cassia-purple)] to-[var(--cassia-gold)] border-0 text-white"
              style={{ boxShadow: 'var(--shadow-glow)' }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Cursos e Atendimentos Dragonlight
            </Badge>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[var(--cassia-purple-dark)] via-[var(--cassia-purple)] to-[var(--cassia-gold)] mb-6">
            Transformação e Cura Energética
          </h2>
          
          <p className="text-lg text-[var(--cassia-purple-dark)]/72 max-w-3xl mx-auto mb-6">
            Descubra ferramentas poderosas de autoconhecimento, limpeza energética e cocriação 
            através do Sistema Dragonlight.
          </p>
          
          {/* Diagnóstico Terapêutico - Gratuito */}
          <motion.div
            id="diagnostico"
            className="max-w-2xl mx-auto bg-gradient-to-r from-[var(--cassia-lavender)]/30 to-[var(--cassia-gold)]/30 p-6 rounded-lg border border-[var(--cassia-purple)]/30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Sparkles className="w-6 h-6 text-[var(--cassia-gold)]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-[var(--cassia-purple-dark)] mb-2">
                  Diagnóstico Terapêutico (20 minutos gratuito)
                </h3>
                <p className="text-[var(--cassia-purple-dark)]/80 mb-4">
                  Um momento especial de conversa entre eu e você, para que juntas possamos entender a sua necessidade e definir seu Caminho Terapêutico.
                </p>
                <div className="flex justify-center items-center w-full">
                  <Button
                    className="bg-[var(--cassia-purple)] hover:bg-[var(--cassia-purple-dark)] text-white mx-auto"
                    onClick={() => {
                      // Abrir WhatsApp ou link de agendamento
                      const whatsappNumber = '5519996760107';
                      const message = encodeURIComponent('Olá! Gostaria de agendar um Diagnóstico Terapêutico (20 minutos gratuito).');
                      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
                    }}
                  >
                    Agendar Diagnóstico Gratuito
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ATENDIMENTOS */}
        {servicesList.length > 0 && (
          <div className="mb-16">
            <motion.h3
              className="text-3xl md:text-4xl text-[var(--cassia-purple-dark)] mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Atendimentos
            </motion.h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-8 items-stretch">
              {servicesList.map((course, index) => renderCourseCard(course, index))}
            </div>
          </div>
        )}

        {/* CURSOS */}
        {coursesList.length > 0 && (
          <div className="mb-16">
            <motion.h3
              className="text-3xl md:text-4xl text-[var(--cassia-purple-dark)] mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Cursos
            </motion.h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-8 items-stretch">
              {coursesList.map((course, index) => renderCourseCard(course, index))}
            </div>
          </div>
        )}

        {/* MENTORIA */}
        {mentoringList.length > 0 && (
          <div>
            <motion.h3
              className="text-3xl md:text-4xl text-[var(--cassia-purple-dark)] mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Mentoria
            </motion.h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-8 items-stretch">
              {mentoringList.map((course, index) => renderCourseCard(course, index))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
