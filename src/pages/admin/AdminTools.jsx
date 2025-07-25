import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Search, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AdminTools = () => {
    const { toast } = useToast();

    const [tools, setTools] = useState([
        { id: 1, name: 'Criador de Texto IA', category: 'Texto', status: 'Ativo' },
        { id: 2, name: 'Gerador de Imagens', category: 'Imagem', status: 'Ativo' },
        { id: 3, name: 'Resumo de Vídeos', category: 'Vídeo', status: 'Ativo' },
        { id: 4, name: 'Assistente de Código', category: 'Código', status: 'Inativo' },
    ]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTools = tools.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const handleAction = (action) => {
        toast({
            title: `🚧 Ação '${action}' não implementada`,
            description: "Esta funcionalidade ainda está em desenvolvimento.",
            duration: 3000,
        });
    };

    return (
        <>
            <Helmet>
                <title>Gerenciar Ferramentas - Admin</title>
                <meta name="description" content="Gerencie todas as ferramentas de IA da plataforma." />
            </Helmet>
            <div className="p-4 lg:p-8 space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Gerenciar Ferramentas IA</h1>
                        <p className="text-gray-400">Adicione, edite ou remova ferramentas da plataforma.</p>
                    </div>
                     <Button onClick={() => handleAction('Adicionar Ferramenta')} className="bg-gradient-to-r from-purple-500 to-blue-500">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Ferramenta
                    </Button>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 border border-white/10">
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Buscar por nome da ferramenta..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10 text-sm text-gray-400">
                                    <th className="p-4">Nome</th>
                                    <th className="p-4">Categoria</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTools.map(tool => (
                                    <motion.tr key={tool.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-white/10 hover:bg-white/5">
                                        <td className="p-4 font-semibold text-white">{tool.name}</td>
                                        <td className="p-4 text-gray-300">{tool.category}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${tool.status === 'Ativo' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                {tool.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="inline-flex rounded-md shadow-sm">
                                                <Button variant="ghost" size="icon" onClick={() => handleAction('Editar')}>
                                                    <Edit className="h-4 w-4 text-gray-400 hover:text-yellow-400" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleAction('Excluir')}>
                                                    <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-400" />
                                                </Button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default AdminTools;