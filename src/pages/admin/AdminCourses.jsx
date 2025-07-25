import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Search, PlusCircle, Edit, Trash2, Save, X, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const AdminCourses = () => {
    const { toast } = useToast();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [showModuleForm, setShowModuleForm] = useState(false);
    const [editCourseData, setEditCourseData] = useState({
        titulo: '',
        descricao: '',
        categoria: '',
        capa: ''
    });
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        categoria: '',
        capa: ''
    });
    const [moduleFormData, setModuleFormData] = useState({
        titulo: '',
        descricao: '',
        capa: '',
        ordem: 1
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

    const fetchModules = async (cursoId) => {
        try {
            const { data, error } = await supabase
                .from('modulos')
                .select('*')
                .eq('curso_id', cursoId)
                .order('ordem', { ascending: true });

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao carregar módulos",
                    description: error.message,
                });
                return;
            }

            setModules(data || []);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao carregar módulos",
                description: error.message,
            });
        }
    };

    const handleEditCourse = async (course) => {
        setEditingCourse(course);
        setEditCourseData({
            titulo: course.titulo,
            descricao: course.descricao,
            categoria: course.categoria,
            capa: course.capa || ''
        });
        await fetchModules(course.id);
    };

    const handleUpdateCourse = async () => {
        if (!editCourseData.titulo || !editCourseData.descricao || !editCourseData.categoria) {
            toast({
                variant: "destructive",
                title: "Campos obrigatórios",
                description: "Preencha título, descrição e categoria.",
            });
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase
                .from('cursos')
                .update({
                    titulo: editCourseData.titulo,
                    descricao: editCourseData.descricao,
                    categoria: editCourseData.categoria,
                    capa: editCourseData.capa || null,
                    slug: editCourseData.titulo.toLowerCase()
                        .replace(/[^a-z0-9\s]/g, '')
                        .replace(/\s+/g, '-'),
                    updated_at: new Date().toISOString()
                })
                .eq('id', editingCourse.id);

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao atualizar curso",
                    description: error.message,
                });
                return;
            }

            toast({
                title: "Curso atualizado!",
                description: "As informações do curso foram salvas com sucesso.",
            });

            // Atualizar lista de cursos e dados do curso em edição
            fetchCourses();
            setEditingCourse(prev => ({
                ...prev,
                titulo: editCourseData.titulo,
                descricao: editCourseData.descricao,
                categoria: editCourseData.categoria,
                capa: editCourseData.capa
            }));
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao atualizar curso",
                description: error.message,
            });
        } finally {
            setSaving(false);
        }
    };

    const handleAddModule = async () => {
        if (!moduleFormData.titulo) {
            toast({
                variant: "destructive",
                title: "Campo obrigatório",
                description: "Preencha o título do módulo.",
            });
            return;
        }

        setSaving(true);
        try {
            const { data, error } = await supabase
                .from('modulos')
                .insert([{
                    curso_id: editingCourse.id,
                    titulo: moduleFormData.titulo,
                    descricao: moduleFormData.descricao,
                    capa: moduleFormData.capa || null,
                    ordem: modules.length + 1
                }])
                .select();

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao adicionar módulo",
                    description: error.message,
                });
                return;
            }

            toast({
                title: "Módulo adicionado!",
                description: "O módulo foi criado com sucesso.",
            });

            // Atualizar lista e limpar formulário
            await fetchModules(editingCourse.id);
            setModuleFormData({ titulo: '', descricao: '', capa: '', ordem: 1 });
            setShowModuleForm(false);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao adicionar módulo",
                description: error.message,
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteModule = async (moduleId) => {
        if (!confirm('Tem certeza que deseja excluir este módulo?')) return;

        try {
            const { error } = await supabase
                .from('modulos')
                .delete()
                .eq('id', moduleId);

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao excluir módulo",
                    description: error.message,
                });
                return;
            }

            toast({
                title: "Módulo excluído!",
                description: "O módulo foi removido com sucesso.",
            });

            await fetchModules(editingCourse.id);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao excluir módulo",
                description: error.message,
            });
        }
    };

    const handleUpdateModuleOrder = async (moduleId, newOrder) => {
        try {
            const { error } = await supabase
                .from('modulos')
                .update({ ordem: newOrder })
                .eq('id', moduleId);

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao reordenar módulo",
                    description: error.message,
                });
                return;
            }

            await fetchModules(editingCourse.id);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao reordenar módulo",
                description: error.message,
            });
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
                                                <Button variant="ghost" size="icon" onClick={() => handleEditCourse(course)}>
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

                {/* Modal de Edição do Curso com Módulos */}
                {editingCourse && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setEditingCourse(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass rounded-2xl p-6 border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Editar Curso: {editingCourse.titulo}</h2>
                                <Button variant="ghost" size="icon" onClick={() => setEditingCourse(null)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Seção de Edição do Curso */}
                            <div className="space-y-6">
                                <div className="glass rounded-xl p-6 border border-white/10">
                                    <h3 className="text-xl font-semibold text-white mb-4">Dados do Curso</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Título do Curso *
                                            </label>
                                            <input
                                                type="text"
                                                value={editCourseData.titulo}
                                                onChange={(e) => setEditCourseData(prev => ({ ...prev, titulo: e.target.value }))}
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
                                                value={editCourseData.categoria}
                                                onChange={(e) => setEditCourseData(prev => ({ ...prev, categoria: e.target.value }))}
                                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="Ex: Programação, IA, Design"
                                            />
                                        </div>
                                        
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Descrição *
                                            </label>
                                            <textarea
                                                value={editCourseData.descricao}
                                                onChange={(e) => setEditCourseData(prev => ({ ...prev, descricao: e.target.value }))}
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
                                                value={editCourseData.capa}
                                                onChange={(e) => setEditCourseData(prev => ({ ...prev, capa: e.target.value }))}
                                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="https://exemplo.com/imagem.jpg"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-end mt-4">
                                        <Button onClick={handleUpdateCourse} disabled={saving} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                                            <Save className="mr-2 h-4 w-4" />
                                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                                        </Button>
                                    </div>
                                </div>

                            {/* Seção de Módulos */}
                                <div className="border-t border-white/10 pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-semibold text-white">Módulos do Curso</h3>
                                        <Button
                                            onClick={() => setShowModuleForm(!showModuleForm)}
                                            className="bg-gradient-to-r from-green-500 to-teal-500"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Adicionar Módulo
                                        </Button>
                                    </div>

                                    {/* Formulário de Adicionar Módulo */}
                                    {showModuleForm && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Título do Módulo *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={moduleFormData.titulo}
                                                        onChange={(e) => setModuleFormData(prev => ({ ...prev, titulo: e.target.value }))}
                                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        placeholder="Ex: Introdução ao React"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        URL da Imagem
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={moduleFormData.capa}
                                                        onChange={(e) => setModuleFormData(prev => ({ ...prev, capa: e.target.value }))}
                                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        placeholder="https://exemplo.com/imagem.jpg"
                                                    />
                                                </div>
                                                
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Descrição
                                                    </label>
                                                    <textarea
                                                        value={moduleFormData.descricao}
                                                        onChange={(e) => setModuleFormData(prev => ({ ...prev, descricao: e.target.value }))}
                                                        rows={3}
                                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                                        placeholder="Descreva o conteúdo do módulo..."
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="flex justify-end mt-4 space-x-2">
                                                <Button variant="ghost" onClick={() => setShowModuleForm(false)}>
                                                    Cancelar
                                                </Button>
                                                <Button onClick={handleAddModule} disabled={saving} className="bg-gradient-to-r from-green-500 to-teal-500">
                                                    <Save className="mr-2 h-4 w-4" />
                                                    {saving ? 'Salvando...' : 'Salvar Módulo'}
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Lista de Módulos */}
                                    <div className="space-y-3">
                                        {modules.length === 0 ? (
                                            <div className="text-center py-8 text-gray-400">
                                                <p>Nenhum módulo criado ainda.</p>
                                                <p className="text-sm">Clique em "Adicionar Módulo" para começar.</p>
                                            </div>
                                        ) : (
                                            modules.map((module, index) => (
                                                <motion.div
                                                    key={module.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1 space-y-2">
                                                            <div className="flex items-center space-x-3">
                                                                <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                                    #{module.ordem}
                                                                </span>
                                                                <h4 className="font-semibold text-white">{module.titulo}</h4>
                                                            </div>
                                                            {module.descricao && (
                                                                <p className="text-gray-300 text-sm">{module.descricao}</p>
                                                            )}
                                                            {module.capa && (
                                                                <img src={module.capa} alt={module.titulo} className="w-20 h-12 object-cover rounded" />
                                                            )}
                                                        </div>
                                                        
                                                        <div className="flex items-center space-x-2">
                                                            {/* Botões de Reordenação */}
                                                            <div className="flex flex-col">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-6 w-6"
                                                                    disabled={index === 0}
                                                                    onClick={() => handleUpdateModuleOrder(module.id, module.ordem - 1)}
                                                                >
                                                                    <ChevronUp className="h-3 w-3" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-6 w-6"
                                                                    disabled={index === modules.length - 1}
                                                                    onClick={() => handleUpdateModuleOrder(module.id, module.ordem + 1)}
                                                                >
                                                                    <ChevronDown className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                            
                                                            {/* Botões de Ação */}
                                                            <Button variant="ghost" size="icon" onClick={() => handleAction('Editar Módulo')}>
                                                                <Edit className="h-4 w-4 text-gray-400 hover:text-yellow-400" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteModule(module.id)}>
                                                                <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-400" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </>
    );
};

export default AdminCourses;