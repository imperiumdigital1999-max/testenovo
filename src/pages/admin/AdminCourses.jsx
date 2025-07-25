import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Search, PlusCircle, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const AdminCourses = () => {
    const { toast } = useToast();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        categoria: '',
        capa: ''
    });
    const [saving, setSaving] = useState(false);

    React.useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data, error } = await supabase
                .from('cursos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao carregar cursos",
                    description: error.message,
                });
                return;
            }

            setCourses(data || []);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao carregar cursos",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddCourse = async () => {
        if (!formData.titulo || !formData.descricao || !formData.categoria) {
            toast({
                variant: "destructive",
                title: "Campos obrigatórios",
                description: "Preencha título, descrição e categoria.",
            });
            return;
        }

        setSaving(true);
        try {
            const { data, error } = await supabase
                .from('cursos')
                .insert([{
                    titulo: formData.titulo,
                    descricao: formData.descricao,
                    categoria: formData.categoria,
                    capa: formData.capa || null,
                    slug: formData.titulo.toLowerCase()
                        .replace(/[^a-z0-9\s]/g, '')
                        .replace(/\s+/g, '-')
                }])
                .select();

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao adicionar curso",
                    description: error.message,
                });
                return;
            }

            toast({
                title: "Curso adicionado!",
                description: "O curso foi criado com sucesso.",
            });

            // Atualizar lista e limpar formulário
            fetchCourses();
            setFormData({ titulo: '', descricao: '', categoria: '', capa: '' });
            setShowForm(false);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao adicionar curso",
                description: error.message,
            });
        } finally {
            setSaving(false);
        }
    };

    const filteredCourses = courses.filter(course =>
        course.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const handleAction = (action) => {
        toast({
            title: `🚧 Ação '${action}' não implementada`,
            description: "Esta funcionalidade ainda está em desenvolvimento.",
            duration: 3000,
        });
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div></div>;

    return (
        <>
            <Helmet>
                <title>Gerenciar Cursos - Admin</title>
                <meta name="description" content="Gerencie todos os cursos da plataforma." />
            </Helmet>
            <div className="p-4 lg:p-8 space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Gerenciar Cursos</h1>
                        <p className="text-gray-400">Adicione, edite ou remova cursos da plataforma.</p>
                    </div>
                    <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-purple-500 to-blue-500">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Curso
                    </Button>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 border border-white/10">
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        {/* Formulário de Adicionar Curso */}
                        {showForm && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">Adicionar Novo Curso</h3>
                                    <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Título do Curso *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.titulo}
                                            onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Ex: React do Zero ao Avançado"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Categoria *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.categoria}
                                            onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Ex: Programação, IA, Design"
                                        />
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Descrição *
                                        </label>
                                        <textarea
                                            value={formData.descricao}
                                            onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                                            rows={3}
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                            placeholder="Descreva o conteúdo do curso..."
                                        />
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            URL da Imagem (Capa)
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.capa}
                                            onChange={(e) => setFormData(prev => ({ ...prev, capa: e.target.value }))}
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="https://exemplo.com/imagem.jpg"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex justify-end mt-4">
                                    <Button onClick={handleAddCourse} disabled={saving} className="bg-gradient-to-r from-green-500 to-teal-500">
                                        <Save className="mr-2 h-4 w-4" />
                                        {saving ? 'Salvando...' : 'Salvar Curso'}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                        
                        <input
                            type="text"
                            placeholder="Buscar por título do curso..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10 text-sm text-gray-400">
                                    <th className="p-4">Título</th>
                                    <th className="p-4">Descrição</th>
                                    <th className="p-4">Categoria</th>
                                    <th className="p-4">Capa</th>
                                    <th className="p-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.map(course => (
                                    <motion.tr key={course.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-white/10 hover:bg-white/5">
                                        <td className="p-4 font-semibold text-white">{course.titulo}</td>
                                        <td className="p-4 text-gray-300 max-w-xs truncate">{course.descricao}</td>
                                        <td className="p-4 text-gray-300">{course.categoria}</td>
                                        <td className="p-4">
                                            {course.capa ? (
                                                <img src={course.capa} alt={course.titulo} className="w-12 h-8 object-cover rounded" />
                                            ) : (
                                                <span className="text-gray-500 text-xs">Sem imagem</span>
                                            )}
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
                        
                        {filteredCourses.length === 0 && !loading && (
                            <div className="text-center py-8">
                                <p className="text-gray-400">Nenhum curso encontrado</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default AdminCourses;