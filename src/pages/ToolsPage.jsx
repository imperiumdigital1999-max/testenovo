import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  Wand2, 
  Image, 
  FileText, 
  Video, 
  Mic, 
  Code, 
  Palette, 
  Brain,
  Sparkles,
  Zap,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ToolsPage = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Todas', 'Texto', 'Imagem', 'Vídeo', 'Áudio', 'Código', 'Design'];

  const tools = [
    {
      id: 1,
      name: 'Criador de Texto IA',
      description: 'Gere textos criativos, artigos e conteúdo otimizado com inteligência artificial',
      icon: FileText,
      category: 'Texto',
      color: 'from-blue-500 to-cyan-500',
      features: ['Artigos', 'Posts', 'E-mails', 'Roteiros'],
      popular: true
    },
    {
      id: 2,
      name: 'Gerador de Imagens',
      description: 'Crie imagens únicas e profissionais a partir de descrições de texto',
      icon: Image,
      category: 'Imagem',
      color: 'from-purple-500 to-pink-500',
      features: ['Arte Digital', 'Logos', 'Ilustrações', 'Fotos'],
      popular: true
    },
    {
      id: 3,
      name: 'Resumo de Vídeos',
      description: 'Extraia pontos principais e crie resumos de vídeos automaticamente',
      icon: Video,
      category: 'Vídeo',
      color: 'from-green-500 to-teal-500',
      features: ['YouTube', 'Aulas', 'Webinars', 'Palestras']
    },
    {
      id: 4,
      name: 'Transcrição de Áudio',
      description: 'Converta áudio em texto com alta precisão e velocidade',
      icon: Mic,
      category: 'Áudio',
      color: 'from-orange-500 to-red-500',
      features: ['Podcasts', 'Reuniões', 'Entrevistas', 'Aulas']
    },
    {
      id: 5,
      name: 'Assistente de Código',
      description: 'Gere, otimize e corrija código em múltiplas linguagens de programação',
      icon: Code,
      category: 'Código',
      color: 'from-indigo-500 to-purple-500',
      features: ['Python', 'JavaScript', 'React', 'Node.js'],
      popular: true
    },
    {
      id: 6,
      name: 'Designer de Paletas',
      description: 'Crie paletas de cores harmoniosas para seus projetos de design',
      icon: Palette,
      category: 'Design',
      color: 'from-pink-500 to-rose-500',
      features: ['Cores', 'Gradientes', 'Temas', 'Harmonia']
    },
    {
      id: 7,
      name: 'Brainstorm IA',
      description: 'Gere ideias criativas e soluções inovadoras para seus projetos',
      icon: Brain,
      category: 'Texto',
      color: 'from-cyan-500 to-blue-500',
      features: ['Ideias', 'Conceitos', 'Estratégias', 'Soluções']
    },
    {
      id: 8,
      name: 'Otimizador de Conteúdo',
      description: 'Melhore seus textos para SEO e engajamento nas redes sociais',
      icon: Sparkles,
      category: 'Texto',
      color: 'from-yellow-500 to-orange-500',
      features: ['SEO', 'Hashtags', 'Títulos', 'Meta Tags']
    }
  ];

  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === 'Todas' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToolClick = (toolName) => {
    toast({
      title: "🚧 Este recurso ainda não foi implementado—mas não se preocupe! Você pode solicitá-lo no seu próximo prompt! 🚀",
      duration: 3000,
    });
  };

  return (
    <>
      <Helmet>
        <title>Ferramentas IA - Universidade Digital</title>
        <meta name="description" content="Acesse ferramentas de inteligência artificial para criação de conteúdo, imagens, código e muito mais." />
      </Helmet>

      <div className="p-4 lg:p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 neon-glow">
              <Wand2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold gradient-text">
            Ferramentas de IA
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Potencialize sua criatividade com nossas ferramentas de inteligência artificial
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
              placeholder="Buscar ferramentas..."
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

        {/* Tools Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="glass rounded-2xl p-6 border border-white/10 card-hover cursor-pointer group relative overflow-hidden"
              onClick={() => handleToolClick(tool.name)}
            >
              {/* Popular Badge */}
              {tool.popular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                  <Zap className="h-3 w-3" />
                  <span>Popular</span>
                </div>
              )}

              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>

              <div className="relative z-10 space-y-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon className="h-6 w-6 text-white" />
                </div>

                {/* Tool Info */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide">
                    Recursos
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tool.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Use Button */}
                <Button className={`w-full bg-gradient-to-r ${tool.color} hover:opacity-90 text-white font-semibold group-hover:scale-105 transition-all duration-300`}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Usar Ferramenta
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredTools.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="glass rounded-2xl p-8 border border-white/10 max-w-md mx-auto">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Nenhuma ferramenta encontrada</h3>
              <p className="text-gray-400">
                Tente ajustar os filtros ou termo de busca
              </p>
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-8 border border-white/10 text-center"
        >
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold gradient-text">
              Precisa de uma ferramenta específica?
            </h2>
            <p className="text-gray-300">
              Nossa equipe está sempre desenvolvendo novas ferramentas. Envie sua sugestão!
            </p>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-8 py-3"
              onClick={() => toast({
                title: "🚧 Este recurso ainda não foi implementado—mas não se preocupe! Você pode solicitá-lo no seu próximo prompt! 🚀",
                duration: 3000,
              })}
            >
              Sugerir Ferramenta
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ToolsPage;