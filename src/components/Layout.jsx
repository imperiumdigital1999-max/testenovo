import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, Wrench, User, Menu, X, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const isAdmin = localStorage.getItem('userRole') === 'admin';

  const navItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: BookOpen, label: 'Conteúdo', path: '/conteudo' },
    { icon: Wrench, label: 'Ferramentas', path: '/ferramentas' },
    { icon: User, label: 'Perfil', path: '/perfil' },
  ];

  if (isAdmin) {
    navItems.push({ icon: ShieldCheck, label: 'Painel Admin', path: '/admin' });
  }

  const isActive = (path) => location.pathname === path || (path === '/admin' && location.pathname.startsWith('/admin'));


  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex lg:flex-col lg:w-64 glass border-r border-white/10"
      >
        <div className="p-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center neon-glow">
              <span className="text-white font-bold text-lg">UD</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Universidade</h1>
              <p className="text-sm text-gray-400">Digital</p>
            </div>
          </motion.div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`w-full justify-start h-12 text-left transition-all duration-300 ${
                    isActive(item.path) 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white neon-glow' 
                      : 'hover:bg-white/5 hover:text-purple-300'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="p-4">
          <div className="glass rounded-lg p-4 border border-purple-500/20">
            <p className="text-sm text-gray-300 mb-2">Bem-vindo de volta!</p>
            <p className="text-xs text-gray-400">Continue seus estudos onde parou</p>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">UD</span>
            </div>
            <span className="font-bold gradient-text">Universidade Digital</span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:bg-white/10"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="lg:hidden fixed top-16 left-0 right-0 z-40 glass border-b border-white/10"
          >
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className={`w-full justify-start h-12 ${
                      isActive(item.path) 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                        : 'hover:bg-white/5 hover:text-purple-300'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-auto lg:pt-0 pt-16">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;