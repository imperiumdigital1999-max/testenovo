import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Search, Filter, Play, Clock, Star, Users, ChevronRight, Lock, Crown } from 'lucide-react';
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
        toast({
          variant: "destructive",
          title: "Erro ao carregar cursos",
          description: error.message,
        });
        return;
      }

      setCursos(data || []);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
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

  const hasAccess = (cursoId) => {
    // Usuário premium tem acesso a tudo
    if (userProfile?.plano === 'premium') {
      return true;
    }
    // Ou tem acesso específico ao curso
    return userAccess.has(cursoId);
  };

  const handleCourseClick = (curso) => {
    if (hasAccess(curso.id)) {
      // Usuário tem acesso - navegar para o curso
      toast({
        title: "🚧 Este recurso ainda não foi implementado—mas não se preocupe! Você pode solicitá-lo no seu próximo prompt! 🚀",
        duration: 3000,
      });
    } else {
      // Usuário não tem acesso - mostrar opções
      showAccessOptions(curso);
    }
  };

  const showAccessOptions = (curso) => {
    toast({
      title: "🔒 Conteúdo Bloqueado",
      description: "Você precisa ter acesso a este curso para visualizá-lo.",
      duration: 5000,
    });
    
    // Aqui você pode implementar um modal com as opções:
    // - Comprar curso individual
    // - Assinar plano premium
  };

  const categories = [
    'Todos',
    'Programação',
    'Inteligência Artificial',
    'Design',
    'Marketing Digital',
    'Estética',
    'Negócios'
  ];

  const filteredCourses = cursos.filter(course => {
    const matchesCategory = selectedCategory === 'Todos'; // Por enquanto, mostrar todos
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

  const isPremiumUser = userProfile?.plano === 'premium';

  const renderAccessBadge = () => {
    if (isPremiumUser) {
      return (
        <div className="flex items-center space-x-2 mb-4">
          <Crown className="h-5 w-5 text-yellow-400" />
          <span className="text-yellow-400 font-semibold">Usuário Premium</span>
        </div>
      );
    }
    return null;
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
          {renderAccessBadge()}
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
                  src={course.capa || "https://images.unsplash.com/photo-1635251595512-dc52146d5ae8"} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Access Overlay */}
                {!hasAccess(course.id) && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="h-12 w-12 text-white mx-auto mb-2" />
                      <p className="text-white font-semibold">Conteúdo Bloqueado</p>
                      <p className="text-gray-300 text-sm">Clique para ver opções</p>
                    </div>
                  </div>
                )}

                {/* Play Button - só aparece se tem acesso */}
                {hasAccess(course.id) && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 neon-glow">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                )}

                {/* Access Badge */}
                <div className="absolute top-4 right-4">
                  {hasAccess(course.id) ? (
                    <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                      ✓ Liberado
                    </div>
                  ) : (
                    <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs font-medium">
                      🔒 Bloqueado
                    </div>
                  )}
                </div>

                {/* Premium Badge */}
                {isPremiumUser && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <Crown className="h-3 w-3" />
                      <span>Premium</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className={`text-xl font-bold mb-2 transition-colors ${
                    hasAccess(course.id) 
                      ? 'text-white group-hover:text-purple-300' 
                      : 'text-gray-400'
                  }`}>
                    {course.titulo}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">{course.descricao}</p>
                </div>

                {/* Access Status */}
                <div className="flex items-center justify-between">
                  <div className={`text-sm ${hasAccess(course.id) ? 'text-green-400' : 'text-red-400'}`}>
                    {hasAccess(course.id) ? '✓ Acesso liberado' : '🔒 Acesso bloqueado'}
                  </div>
                  <ChevronRight className={`h-5 w-5 group-hover:translate-x-1 transition-transform ${
                    hasAccess(course.id) ? 'text-purple-400' : 'text-gray-500'
                  }`} />
                </div>

                {/* Action Button */}
                {!hasAccess(course.id) && (
                  <div className="pt-2">
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        showAccessOptions(course);
                      }}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Desbloquear Curso
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