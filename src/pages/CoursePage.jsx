import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Maximize, 
  CheckCircle,
  Circle,
  Clock,
  Star,
  Users,
  ArrowLeft,
  Download,
  MessageCircle,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const CoursePage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([0, 1, 2]);

  // Mock course data
  const course = {
    id: parseInt(id),
    title: 'React do Zero ao Avançado',
    instructor: 'Prof. Carlos Silva',
    duration: '40h',
    totalLessons: 120,
    rating: 4.9,
    students: 2847,
    description: 'Aprenda React desde o básico até conceitos avançados com projetos práticos e exercícios.',
    image: 'Modern React development workspace with multiple monitors showing code'
  };

  const modules = [
    {
      id: 1,
      title: 'Introdução ao React',
      lessons: [
        { id: 1, title: 'O que é React?', duration: '15:30', type: 'video' },
        { id: 2, title: 'Configurando o ambiente', duration: '22:45', type: 'video' },
        { id: 3, title: 'Primeiro componente', duration: '18:20', type: 'video' },
        { id: 4, title: 'Exercícios práticos', duration: '30:00', type: 'exercise' }
      ]
    },
    {
      id: 2,
      title: 'Componentes e Props',
      lessons: [
        { id: 5, title: 'Criando componentes', duration: '25:15', type: 'video' },
        { id: 6, title: 'Passando props', duration: '20:30', type: 'video' },
        { id: 7, title: 'Props children', duration: '16:45', type: 'video' },
        { id: 8, title: 'Projeto prático', duration: '45:00', type: 'project' }
      ]
    },
    {
      id: 3,
      title: 'Estado e Eventos',
      lessons: [
        { id: 9, title: 'useState Hook', duration: '28:20', type: 'video' },
        { id: 10, title: 'Manipulando eventos', duration: '22:10', type: 'video' },
        { id: 11, title: 'Formulários controlados', duration: '35:30', type: 'video' },
        { id: 12, title: 'Desafio final', duration: '60:00', type: 'challenge' }
      ]
    }
  ];

  const currentLessonData = modules
    .flatMap(module => module.lessons)
    .find((_, index) => index === currentLesson) || modules[0].lessons[0];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    toast({
      title: "🚧 Este recurso ainda não foi implementado—mas não se preocupe! Você pode solicitá-lo no seu próximo prompt! 🚀",
      duration: 3000,
    });
  };

  const handleLessonComplete = (lessonIndex) => {
    if (!completedLessons.includes(lessonIndex)) {
      setCompletedLessons([...completedLessons, lessonIndex]);
      toast({
        title: "Aula concluída! 🎉",
        description: "Parabéns! Você completou mais uma aula.",
        duration: 3000,
      });
    }
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video': return Play;
      case 'exercise': return BookOpen;
      case 'project': return Circle;
      case 'challenge': return Star;
      default: return Play;
    }
  };

  const getLessonTypeColor = (type) => {
    switch (type) {
      case 'video': return 'text-blue-400';
      case 'exercise': return 'text-green-400';
      case 'project': return 'text-purple-400';
      case 'challenge': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <>
      <Helmet>
        <title>{course.title} - Universidade Digital</title>
        <meta name="description" content={course.description} />
      </Helmet>

      <div className="min-h-screen">
        {/* Header */}
        <div className="glass border-b border-white/10 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/conteudo">
                <Button variant="ghost" size="icon" className="hover:bg-white/10">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-white">{course.title}</h1>
                <p className="text-gray-400">{course.instructor}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{course.students.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>{course.rating}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)]">
          {/* Video Player */}
          <div className="lg:flex-1 bg-black">
            <div className="relative aspect-video lg:h-full">
              <img  
                className="w-full h-full object-cover"
                alt={currentLessonData.title}
               src="https://images.unsplash.com/photo-1635251595512-dc52146d5ae8" />
              
              {/* Video Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePlayPause}
                  className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center neon-glow"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8 text-white" />
                  ) : (
                    <Play className="h-8 w-8 text-white ml-1" />
                  )}
                </motion.button>
              </div>

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={handlePlayPause}>
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <SkipForward className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Volume2 className="h-5 w-5" />
                      <div className="w-20 h-1 bg-white/30 rounded-full">
                        <div className="w-3/4 h-full bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">15:30 / 22:45</span>
                    <Button variant="ghost" size="icon">
                      <Maximize className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-white/30 rounded-full mt-4">
                  <div className="w-2/3 h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Current Lesson Info */}
            <div className="p-4 lg:p-6 glass border-t border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">{currentLessonData.title}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{currentLessonData.duration}</span>
                    </div>
                    <span className={`capitalize ${getLessonTypeColor(currentLessonData.type)}`}>
                      {currentLessonData.type === 'video' ? 'Vídeo' : 
                       currentLessonData.type === 'exercise' ? 'Exercício' :
                       currentLessonData.type === 'project' ? 'Projeto' : 'Desafio'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toast({
                      title: "🚧 Este recurso ainda não foi implementado—mas não se preocupe! Você pode solicitá-lo no seu próximo prompt! 🚀",
                      duration: 3000,
                    })}
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toast({
                      title: "🚧 Este recurso ainda não foi implementado—mas não se preocupe! Você pode solicitá-lo no seu próximo prompt! 🚀",
                      duration: 3000,
                    })}
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                  <Button
                    onClick={() => handleLessonComplete(currentLesson)}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Marcar como Concluída
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Course Content Sidebar */}
          <div className="lg:w-96 glass border-l border-white/10 overflow-y-auto">
            <div className="p-4 lg:p-6">
              <h3 className="text-lg font-bold text-white mb-4">Conteúdo do Curso</h3>
              
              <div className="space-y-4">
                {modules.map((module, moduleIndex) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: moduleIndex * 0.1 }}
                    className="space-y-2"
                  >
                    <h4 className="font-semibold text-purple-300 text-sm uppercase tracking-wide">
                      Módulo {module.id}: {module.title}
                    </h4>
                    
                    <div className="space-y-1">
                      {module.lessons.map((lesson, lessonIndex) => {
                        const globalIndex = modules
                          .slice(0, moduleIndex)
                          .reduce((acc, mod) => acc + mod.lessons.length, 0) + lessonIndex;
                        
                        const isCompleted = completedLessons.includes(globalIndex);
                        const isCurrent = globalIndex === currentLesson;
                        const LessonIcon = getLessonIcon(lesson.type);
                        
                        return (
                          <motion.button
                            key={lesson.id}
                            whileHover={{ x: 4 }}
                            onClick={() => setCurrentLesson(globalIndex)}
                            className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                              isCurrent 
                                ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30' 
                                : 'hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`flex-shrink-0 ${
                                isCompleted ? 'text-green-400' : getLessonTypeColor(lesson.type)
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle className="h-5 w-5" />
                                ) : (
                                  <LessonIcon className="h-5 w-5" />
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${
                                  isCurrent ? 'text-white' : 'text-gray-300'
                                }`}>
                                  {lesson.title}
                                </p>
                                <p className="text-xs text-gray-400">{lesson.duration}</p>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursePage;