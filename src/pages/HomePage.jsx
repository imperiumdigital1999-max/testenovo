import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Play, Clock, Star, TrendingUp, BookOpen, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const HomePage = () => {
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [userName, setUserName] = useState('Estudante');

  useEffect(() => {
    if (userProfile?.nome) {
      setUserName(userProfile.nome);
    }
  }, [userProfile]);


  const banners = [
    {
      id: 1,
      title: 'Novo Curso: IA Generativa',
      subtitle: 'Aprenda a criar conteúdo com inteligência artificial',
      image: 'Futuristic AI brain with neural networks and glowing connections',
      gradient: 'from-purple-600 to-blue-600'
    },
    {
      id: 2,
      title: 'Ferramentas de IA Atualizadas',
      subtitle: 'Novas funcionalidades para turbinar seus projetos',
      image: 'Modern digital workspace with AI tools and holographic interfaces',
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      id: 3,
      title: 'Webinar Exclusivo',
      subtitle: 'O futuro da programação com IA - 25/01 às 20h',
      image: 'Professional online webinar setup with multiple screens showing code',
      gradient: 'from-cyan-600 to-teal-600'
    }
  ];

  const recentCourses = [
    {
      id: 1,
      title: 'React Avançado',
      progress: 75,
      image: 'Modern React development environment with code editor',
      duration: '2h restantes'
    },
    {
      id: 2,
      title: 'Python para IA',
      progress: 45,
      image: 'Python programming with AI and machine learning concepts',
      duration: '4h restantes'
    },
    {
      id: 3,
      title: 'Design UX/UI',
      progress: 90,
      image: 'Creative UX/UI design workspace with mockups and prototypes',
      duration: '30min restantes'
    }
  ];

  const stats = [
    { icon: BookOpen, label: 'Cursos Concluídos', value: '12', color: 'text-green-400' },
    { icon: Clock, label: 'Horas de Estudo', value: '156', color: 'text-blue-400' },
    { icon: Star, label: 'Certificados', value: '8', color: 'text-yellow-400' },
    { icon: TrendingUp, label: 'Streak Atual', value: '15 dias', color: 'text-purple-400' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handleBannerClick = () => {
    toast({
      title: "🚧 Este recurso ainda não foi implementado—mas não se preocupe! Você pode solicitá-lo no seu próximo prompt! 🚀",
      duration: 3000,
    });
  };

  return (
    <>
      <Helmet>
        <title>Início - Universidade Digital</title>
        <meta name="description" content="Página inicial da área de membros com destaques, cursos recentes e estatísticas de progresso." />
      </Helmet>

      <div className="p-4 lg:p-8 space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 lg:p-8 border border-white/10"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                Olá, <span className="gradient-text">{userName}</span>! 👋
              </h1>
              <p className="text-gray-300 text-lg">
                Pronto para continuar sua jornada de aprendizado?
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Online</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Banner Carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative h-64 lg:h-80 rounded-2xl overflow-hidden cursor-pointer"
          onClick={handleBannerClick}
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${banners[currentBanner].gradient} opacity-90`}></div>
          <img    
            className="absolute inset-0 w-full h-full object-cover"
            alt={banners[currentBanner].title} src="https://images.unsplash.com/photo-1678995635432-d9e89c7a8fc5" />
          
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="absolute inset-0 flex items-center justify-center text-center p-6">
            <div>
              <motion.h2 
                key={currentBanner}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl lg:text-4xl font-bold text-white mb-4"
              >
                {banners[currentBanner].title}
              </motion.h2>
              <motion.p 
                key={`${currentBanner}-subtitle`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg lg:text-xl text-gray-200 mb-6"
              >
                {banners[currentBanner].subtitle}
              </motion.p>
              <Button className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-3">
                Saiba Mais
              </Button>
            </div>
          </div>

          {/* Banner Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentBanner ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentBanner(index);
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <div key={index} className="glass rounded-xl p-4 lg:p-6 border border-white/10 card-hover">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-white/10 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Recent Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Continue Assistindo</h2>
            <Link to="/conteudo">
              <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
                Ver Todos
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {recentCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="glass rounded-xl overflow-hidden border border-white/10 card-hover cursor-pointer"
                onClick={() => toast({
                  title: "🚧 Este recurso ainda não foi implementado—mas não se preocupe! Você pode solicitá-lo no seu próximo prompt! 🚀",
                  duration: 3000,
                })}
              >
                <div className="relative h-40">
                  <img    
                    className="w-full h-full object-cover"
                    alt={course.title} src="https://images.unsplash.com/photo-1679521358679-301c295e2cd4" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-black/50 rounded-full p-2">
                      <Play className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-2">{course.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <span>{course.duration}</span>
                    <span>{course.progress}% concluído</span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6 border border-white/10"
        >
          <h2 className="text-xl font-bold text-white mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/ferramentas">
              <Button className="w-full h-16 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 flex flex-col items-center justify-center space-y-1">
                <Users className="h-5 w-5" />
                <span className="text-sm">Ferramentas IA</span>
              </Button>
            </Link>
            <Link to="/conteudo">
              <Button className="w-full h-16 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 flex flex-col items-center justify-center space-y-1">
                <BookOpen className="h-5 w-5" />
                <span className="text-sm">Meus Cursos</span>
              </Button>
            </Link>
            <Button 
              className="w-full h-16 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 flex flex-col items-center justify-center space-y-1"
              onClick={() => toast({
                title: "🚧 Este recurso ainda não foi implementado—mas não se preocupe! Você pode solicitá-lo no seu próximo prompt! 🚀",
                duration: 3000,
              })}
            >
              <Star className="h-5 w-5" />
              <span className="text-sm">Certificados</span>
            </Button>
            <Link to="/perfil">
              <Button className="w-full h-16 bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 flex flex-col items-center justify-center space-y-1">
                <User className="h-5 w-5" />
                <span className="text-sm">Meu Perfil</span>
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default HomePage;