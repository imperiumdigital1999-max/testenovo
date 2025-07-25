import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Search, PlusCircle, MoreHorizontal, Edit, Trash2, User, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import React, { useState, useEffect } from 'react';

const AdminUsers = () => {
    const { toast } = useToast();
    const { userProfile } = useAuth();
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao carregar usuários",
                    description: error.message,
                });
                return;
            }

            setUsers(data || []);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao carregar usuários",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => 
        user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAction = (action) => {
        toast({
            title: `🚧 Ação '${action}' não implementada`,
            description: "Esta funcionalidade ainda está em desenvolvimento.",
            duration: 3000,
        });
    };

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
                <title>Gerenciar Usuários - Admin</title>
                <meta name="description" content="Gerencie todos os usuários da plataforma." />
            </Helmet>
            <div className="p-4 lg:p-8 space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Gerenciar Usuários</h1>
                        <p className="text-gray-400">Adicione, edite ou remova usuários da plataforma.</p>
                    </div>
                    <Button onClick={() => handleAction('Adicionar Usuário')} className="bg-gradient-to-r from-purple-500 to-blue-500">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Usuário
                    </Button>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 border border-white/10">
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou e-mail..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10 text-sm text-gray-400">
                                    <th className="p-4">Usuário</th>
                                    <th className="p-4">Função</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <motion.tr 
                                        key={user.id} 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="border-b border-white/10 hover:bg-white/5"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
                                                    {user.nome.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">{user.nome}</p>
                                                    <p className="text-sm text-gray-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.tipo === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                {user.tipo === 'admin' ? 'Admin' : 'Aluno'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                                                Ativo
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="inline-flex rounded-md shadow-sm">
                                                <Button variant="ghost" size="icon" onClick={() => handleAction('Editar')}>
                                                    <Edit className="h-4 w-4 text-gray-400 hover:text-yellow-400" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleAction('Excluir')}
                                                    disabled={user.id === userProfile?.id}
                                                >
                                                    <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-400" />
                                                </Button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {filteredUsers.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-400">Nenhum usuário encontrado</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default AdminUsers;