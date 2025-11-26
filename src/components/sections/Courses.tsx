import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, Users, Award, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../shared/ImageWithFallback';
import { useCart } from '../../cart/useCart';
import type { Course } from '../../types';

const courses: Course[] = [
  {
    id: 'dragonlight-1',
    name: 'Dragonlight Nível 1',
    description:
      'Introdução ao sistema de cura energética Dragonlight. Aprenda técnicas fundamentais de canalização e limpeza energética.',
    price: 497,
    duration: '8 semanas',
    students: '120+',
    image:
      'https://images.unsplash.com/photo-1643682661044-f0c34205dd65?auto=format&fit=crop&w=1080&q=80',
    level: 'Iniciante',
    type: 'course',
  },
  {
    id: 'dragonlight-2',
    name: 'Dragonlight Nível 2',
    description:
      'Aprofunde sua conexão com a energia do Dragão. Técnicas avançadas de cura à distância e trabalho com cristais.',
    price: 697,
    duration: '10 semanas',
    students: '80+',
    image:
      'https://images.unsplash.com/photo-1643682661044-f0c34205dd65?auto=format&fit=crop&w=1080&q=80',
    level: 'Intermediário',
    type: 'course',
  },
  {
    id: 'dragonlight-master',
    name: 'Dragonlight Master',
    description:
      'Torne-se um mestre facilitador Dragonlight. Aprenda a ensinar e iniciar outros praticantes no sistema.',
    price: 997,
    duration: '12 semanas',
    students: '45+',
    image:
      'https://images.unsplash.com/photo-1643682661044-f0c34205dd65?auto=format&fit=crop&w=1080&q=80',
    level: 'Avançado',
    type: 'course',
  },
];

export function Courses() {
  const { addItem } = useCart();

  return (
    <section id="courses" className="py-20 relative">
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#A275E3]/10 rounded-full blur-3xl"
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
              className="px-6 py-2 bg-gradient-to-r from-[#8A4FC3] to-[#A275E3] border-0 text-white"
              style={{ boxShadow: 'var(--shadow-glow)' }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Cursos Dragonlight
            </Badge>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#8A4FC3] via-[#A275E3] to-[#CFAF63] mb-6">
            Domine a Arte da Cura Energética
          </h2>
          
          <p className="text-lg text-[#8A4FC3]/70 max-w-3xl mx-auto">
            O Sistema Dragonlight é uma poderosa técnica de cura que conecta você 
            à energia ancestral dos dragões para transformação e cura profunda.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card 
                className="overflow-hidden bg-white/60 backdrop-blur-sm border-[#A275E3]/20 hover:border-[#A275E3]/50 transition-all duration-500 group h-full flex flex-col"
                style={{ boxShadow: 'var(--shadow-soft)' }}
              >
                <div className="relative h-56 overflow-hidden">
                  <ImageWithFallback
                    src={course.image}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Overlay místico */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#8A4FC3]/40 via-transparent to-transparent opacity-60" />
                  
                  {/* Floating badge */}
                  <motion.div
                    className="absolute top-4 right-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Badge 
                      className={`bg-gradient-to-r ${course.gradient} border-0 text-white px-4 py-1`}
                      style={{ boxShadow: 'var(--shadow-medium)' }}
                    >
                      {course.level}
                    </Badge>
                  </motion.div>

                  {/* Decoração de canto animada */}
                  <motion.div
                    className={`absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr ${course.gradient} opacity-30`}
                    initial={{ scale: 0, rotate: 0 }}
                    whileInView={{ scale: 1, rotate: 45 }}
                    transition={{ delay: 0.5 }}
                  />
                </div>
                
                <CardContent className="p-6 flex-grow">
                  <h3 className="text-xl text-[#8A4FC3] mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#8A4FC3] group-hover:to-[#A275E3] transition-all">
                    {course.name}
                  </h3>
                  
                  <p className="text-[#8A4FC3]/70 text-sm mb-5 leading-relaxed">
                    {course.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 text-sm text-[#8A4FC3]/80 mb-5">
                    <div className="flex items-center gap-1.5 bg-[#A275E3]/10 px-3 py-1.5 rounded-full">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#A275E3]/10 px-3 py-1.5 rounded-full">
                      <Users className="w-4 h-4" />
                      <span>{course.students}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#A275E3]/10 px-3 py-1.5 rounded-full">
                      <Award className="w-4 h-4" />
                      <span>Certificado</span>
                    </div>
                  </div>

                  <div className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#8A4FC3] to-[#CFAF63]">
                    R$ {course.price.toFixed(2)}
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <motion.div 
                    className="w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      className={`w-full bg-gradient-to-r ${course.gradient} hover:opacity-90 text-white border-0`}
                      style={{ boxShadow: 'var(--shadow-medium)' }}
                      onClick={() =>
                        addItem({
                          id: course.id,
                          name: course.name,
                          price: course.price,
                          image: course.image,
                          type: 'course',
                        })
                      }
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


