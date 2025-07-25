import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Users, BookOpen, Wrench, BarChart2, PlusCircle, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const stats = [
        { title: 'Total de Usuários', value: '3,846', icon: Users, color: 'text-blue-400' },
        { title: 'Total de Cursos', value: '25', icon: BookOpen, color: 'text-purple-400' },
        { title: 'Ferramentas IA', value: '8', icon: Wrench, color: 'text-green-400' },
        { title: 'Novos Usuários (Mês)', value: '172', icon: BarChart2, color: 'text-yellow-400' },
    ];

    const quickActions = [
        { title: 'Adicionar Curso', icon: PlusCircle, path: '/admin/courses' },
        { title: 'Adicionar Ferramenta', icon: PlusCircle, path: '/admin/tools' },
        { title: 'Gerenciar Usuários', icon: Users, path: '/admin/users' },
        { title: 'Enviar Notificação', icon: Bell, path: '#' },
    ];

    const recentActivities = [
        { user: 'João Silva', action: 'se inscreveu no curso React Avançado', time: '5 min atrás' },
        { user: 'Admin', action: 'adicionou a ferramenta Gerador de Imagens', time: '2 horas atrás' },
        { user: 'Maria Oliveira', action: 'completou o curso de UX/UI Design', time: '1 dia atrás' },
        { user: 'Carlos Souza', action: 'se tornou um novo usuário', time: '2 dias atrás' },
    ];

    return (
        <>
            <Helmet>
                <title>Dashboard Admin - Universidade Digital</title>
                <meta name="description" content="Painel de controle para administradores da Universidade Digital." />
            </Helmet>
            <div className="p-4 lg:p-8 space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-bold text-white">Dashboard do Administrador</h1>
                    <p className="text-gray-400">Visão geral do sistema e ações rápidas.</p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="glass rounded-2xl p-6 border border-white/10 flex items-center space-x-4 card-hover"
                            whileHover={{ y: -5 }}
                        >
                            <div className={`p-3 rounded-xl bg-white/10 ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <p className="text-sm text-gray-400">{stat.title}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div
                        className="lg:col-span-2 space-y-8"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="glass rounded-2xl p-6 border border-white/10">
                            <h2 className="text-xl font-bold text-white mb-4">Ações Rápidas</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {quickActions.map((action, index) => (
                                    <Link key={index} to={action.path}>
                                        <Button className="w-full h-24 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 flex flex-col items-center justify-center space-y-2">
                                            <action.icon className="h-6 w-6 text-purple-400" />
                                            <span className="text-sm text-center">{action.title}</span>
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="lg:col-span-1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="glass rounded-2xl p-6 border border-white/10 h-full">
                            <h2 className="text-xl font-bold text-white mb-4">Atividade Recente</h2>
                            <ul className="space-y-4">
                                {recentActivities.map((activity, index) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                                <User className="h-4 w-4 text-gray-400" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-white">
                                                <span className="font-semibold">{activity.user}</span> {activity.action}
                                            </p>
                                            <p className="text-xs text-gray-500">{activity.time}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;