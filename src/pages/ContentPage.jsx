import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Search, Filter, Play, Clock, Star, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const ContentPage = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'Todos',
    'Programação',
    'Inteligência Artificial',
    'Design',
    'Marketing Digital',
    'Estética',
    'Negócios'
  ];

  const courses = [
    {
      id: 1,
      title: 'React do Zero ao Avançado',
      category: 'Programação',
      instructor: 'Prof. Carlos Silva',
      duration: '40h',
      lessons: 120,
      rating: 4.9,
      students: 2847,
      progress: 75,
      image: 'Modern React development workspace with multiple monitors showing code',
      description: 'Aprenda React desde o básico até conceitos avançados',
      level: 'Intermediário'
    },
    {
      id: 2,
      title: 'IA Generativa na Prática',
      category: 'Inteligência Artificial',
      instructor: 'Dra. Ana Costa',
      duration: '25h',
      lessons: 80,
      rating: 4.8,
      students: 1923,
      progress: 0,
      image: 'Futuristic AI laboratory with neural networks and data visualization',
      description: 'Domine as principais ferramentas de IA generativa',
      level: 'Avançado'
    },
    {
      id: 3,
      title: 'UX/UI Design Moderno',
      category: 'Design',
      instructor: 'Prof. Marina Oliveira',
      duration: '35h',
      lessons: 95,
      rating: 4.9,
      students: 3241,
      progress: 45,
      image: 'Creative design studio with UI mockups and design tools',
      description: 'Crie interfaces incríveis e experiências memoráveis',
      level: 'Iniciante'
    },
    {
      id: 4,
      title: 'Python para Data Science',
      category: 'Programação',
      instructor: 'Dr. Roberto Santos',
      duration: '50h',
      lessons: 150,
      rating: 4.7,
      students: 1876,
      progress: 20,
      image: 'Data science workspace with Python code and data visualizations',
      description: 'Análise de dados e machine learning com Python',
      level: 'Intermediário'
    },
    {
      id: 5,
      title: 'Marketing Digital 360°',
      category: 'Marketing Digital',
      instructor: 'Prof. Juliana Ferreira',
      duration: '30h',
      lessons: 85,
      rating: 4.8,
      students: 2156,
      progress: 0,
      image: 'Digital marketing dashboard with analytics and social media metrics',
      description: 'Estratégias completas de marketing digital',
      level: 'Iniciante'
    },
    {
      id: 6,
      title: 'Harmonização Facial Avançada',
      category: 'Estética',
      instructor: 'Dra. Patricia Lima',
      duration: '20h',
      lessons: 60,
      rating: 4.9,
      students: 987,
      progress: 90,
      image: 'Professional aesthetic clinic with modern equipment and procedures',
      description: 'Técnicas avançadas de harmonização facial',
      level: 'Avançado'
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'Todos' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getLevelColor = (level) => {
    switch (level) {
      case 'Iniciante': return 'text-green-400 bg-green-400/10';
      case 'Intermediário': return 'text-yellow-400 bg-yellow-400/10';
      case 'Avançado': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <>
      <Helmet>
        <title>Conteúdo - Universidade Digital</title>
        <meta name="description" content="Explore todos os cursos disponíveis organizados por categoria com sistema de busca e filtros." />
      </Helmet>

      <div className="p-4 lg:p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl lg:text-4xl font-bold gradient-text">
            Biblioteca de Cursos
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Explore nossa coleção completa de cursos organizados por categoria
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-white/10 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar cursos, instrutores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                onClick={() => setSelectedCategory(category)}
                className={`${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    : 'hover:bg-white/5 text-gray-300'
                } transition-all duration-300`}
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Course Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="glass rounded-2xl overflow-hidden border border-white/10 card-hover cursor-pointer group"
              onClick={() => toast({
                title: "🚧 Este recurso ainda não foi implementado—mas não se preocupe! Você pode solicitá-lo no seu próximo prompt! 🚀",
                duration: 3000,
              })}
            >
              {/* Course Image */}
              <div className="relative h-48 overflow-hidden">
                <img  
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt={course.title}
                 src="https://images.unsplash.com/photo-1635251595512-dc52146d5ae8" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 neon-glow">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Level Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>

                {/* Progress Bar (if started) */}
                {course.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">{course.description}</p>
                  <p className="text-purple-400 text-sm font-medium">{course.instructor}</p>
                </div>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Play className="h-4 w-4" />
                      <span>{course.lessons} aulas</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                {/* Students Count */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>{course.students.toLocaleString()} estudantes</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Progress (if started) */}
                {course.progress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progresso</span>
                      <span className="text-purple-400">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="glass rounded-2xl p-8 border border-white/10 max-w-md mx-auto">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Nenhum curso encontrado</h3>
              <p className="text-gray-400">
                Tente ajustar os filtros ou termo de busca
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default ContentPage;