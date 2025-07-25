import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Search, Filter, Play, Clock, Star, Users, ChevronRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const ContentPage = () => {
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [cursos, setCursos] = useState([]);
  const [userAccess, setUserAccess] = useState(new Set());
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchCursos();
    if (userProfile) {
      fetchUserAccess();
    }
  }, [userProfile]);

  const fetchCursos = async () => {
    try {
      const { data, error } = await supabase
        .from('cursos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar cursos:', error);
        // Usar cursos mock se não conseguir buscar do Supabase
        setCursos(mockCourses);
        return;
      }

      setCursos(data && data.length > 0 ? data : mockCourses);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      setCursos(mockCourses);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAccess = async () => {
    if (!userProfile?.id) return;

    try {
      const { data, error } = await supabase
        .from('acessos')
        .select('curso_id')
        .eq('user_id', userProfile.id);

      if (error) {
        console.error('Erro ao buscar acessos:', error);
        return;
      }

      const accessSet = new Set(data?.map(item => item.curso_id) || []);
      setUserAccess(accessSet);
    } catch (error) {
      console.error('Erro ao buscar acessos:', error);
    }
  };

  // Cursos mock para fallback
  const mockCourses = [
    {
      id: 1,
      titulo: 'React do Zero ao Avançado',
      descricao: 'Aprenda React desde o básico até conceitos avançados com projetos práticos.',
      capa: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
      slug: 'react-zero-avancado',
      categoria: 'Programação'
    },
    {
      id: 2,
      titulo: 'IA Generativa na Prática',
      descricao: 'Domine as ferramentas de IA mais modernas do mercado.',
      capa: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
      slug: 'ia-generativa-pratica',
      categoria: 'Inteligência Artificial'
    },
    {
      id: 3,
      titulo: 'UX/UI Design Moderno',
      descricao: 'Crie interfaces incríveis e experiências memoráveis.',
      capa: 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
      slug: 'ux-ui-design-moderno',
      categoria: 'Design'
    },
    {
      id: 4,
      titulo: 'Python para Data Science',
      descricao: 'Análise de dados e machine learning com Python.',
      capa: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0',
      slug: 'python-data-science',
      categoria: 'Programação'
    },
    {
      id: 5,
      titulo: 'Marketing Digital Avançado',
      descricao: 'Estratégias completas para dominar o marketing online.',
      capa: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      slug: 'marketing-digital-avancado',
      categoria: 'Marketing Digital'
    },
    {
      id: 6,
      titulo: 'Node.js e APIs REST',
      descricao: 'Desenvolvimento backend completo com Node.js.',
      capa: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479',
      slug: 'nodejs-apis-rest',
      categoria: 'Programação'
    }
  ];
  const hasAccess = (cursoId) => {
    return userAccess.has(cursoId);
  };

  const handleCourseClick = (curso) => {
    if (hasAccess(curso.id)) {
      toast({
        title: "🚧 Este recurso ainda não foi implementado—mas não se preocupe! Você pode solicitá-lo no seu próximo prompt! 🚀",
        duration: 3000,
      });
    } else {
      showAccessOptions(curso);
    }
  };

  const showAccessOptions = (curso) => {
    toast({
      title: "🔒 Curso Bloqueado",
      description: `Opções para acessar "${curso.titulo}": 1) Comprar curso individual 2) Assinar plano Premium`,
      duration: 5000,
    });
  };

  const categories = [
    'Todos',
    'Programação',
    'Inteligência Artificial',
    'Design',
    'Marketing Digital',
    'Negócios'
  ];

  const filteredCourses = cursos.filter(course => {
    const matchesCategory = selectedCategory === 'Todos' || course.categoria === selectedCategory;
    const matchesSearch = course.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

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
              className="glass rounded-2xl overflow-hidden border border-white/10 card-hover cursor-pointer group relative"
              onClick={() => handleCourseClick(course)}
            >
              {/* Course Image */}
              <div className="relative h-48 overflow-hidden">
                <img  
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt={course.titulo}
                  src={course.capa} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Play Button ou Lock Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 neon-glow">
                    {hasAccess(course.id) ? (
                      <Play className="h-8 w-8 text-white" />
                    ) : (
                      <Lock className="h-8 w-8 text-white" />
                    )}
                  </div>
                </div>

                {/* Lock Icon - aparece sempre se não tem acesso */}
                {!hasAccess(course.id) && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-black/50 rounded-full p-2">
                      <Lock className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {course.titulo}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">{course.descricao}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>2h 30min</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>4.8</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Botão de ação */}
                {!hasAccess(course.id) && (
                  <div className="pt-2">
                    <Button 
                      className="w-full bg-gray-600 hover:bg-gray-500 text-white text-sm cursor-not-allowed"
                      disabled
                      onClick={(e) => {
                        e.stopPropagation();
                        showAccessOptions(course);
                      }}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Desbloquear
                    </Button>
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