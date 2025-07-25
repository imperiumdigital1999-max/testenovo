import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Save, Plus, Edit, Trash2, ChevronUp, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

const AdminCourseEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModuleForm, setShowModuleForm] = useState(false);
    const [editingModule, setEditingModule] = useState(null);

    const [courseData, setCourseData] = useState({
        titulo: '',
        descricao: '',
        categoria: '',
        capa: '',
        slug: ''
    });

    const [moduleFormData, setModuleFormData] = useState({
        titulo: '',
        descricao: '',
        capa: ''
    });

    useEffect(() => {
        if (id) {
            fetchCourse();
            fetchModules();
        }
    }, [id]);

    const fetchCourse = async () => {
        try {
            const { data, error } = await supabase
                .from('cursos')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao carregar curso",
                    description: error.message,
                });
                navigate('/admin/courses');
                return;
            }

            setCourse(data);
            setCourseData({
                titulo: data.titulo,
                descricao: data.descricao,
                categoria: data.categoria,
                capa: data.capa || '',
                slug: data.slug || ''
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao carregar curso",
                description: error.message,
            });
            navigate('/admin/courses');
        } finally {
            setLoading(false);
        }
    };

    const fetchModules = async () => {
        try {
            const { data, error } = await supabase
                .from('modulos')
                .select('*')
                .eq('curso_id', id)
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

    const handleUpdateCourse = async () => {
        if (!courseData.titulo || !courseData.descricao || !courseData.categoria) {
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
                    titulo: courseData.titulo,
                    descricao: courseData.descricao,
                    categoria: courseData.categoria,
                    capa: courseData.capa || null,
                    slug: courseData.slug || courseData.titulo.toLowerCase()
                        .replace(/[^a-z0-9\s]/g, '')
                        .replace(/\s+/g, '-'),
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

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

            // Atualizar dados locais
            setCourse(prev => ({
                ...prev,
                ...courseData
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
                    curso_id: id,
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

            await fetchModules();
            setModuleFormData({ titulo: '', descricao: '', capa: '' });
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

    const handleEditModule = (module) => {
        setEditingModule(module);
        setModuleFormData({
            titulo: module.titulo,
            descricao: module.descricao || '',
            capa: module.capa || ''
        });
        setShowModuleForm(true);
    };

    const handleUpdateModule = async () => {
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
            const { error } = await supabase
                .from('modulos')
                .update({
                    titulo: moduleFormData.titulo,
                    descricao: moduleFormData.descricao,
                    capa: moduleFormData.capa || null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', editingModule.id);

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao atualizar módulo",
                    description: error.message,
                });
                return;
            }

            toast({
                title: "Módulo atualizado!",
                description: "As informações do módulo foram salvas com sucesso.",
            });

            await fetchModules();
            setModuleFormData({ titulo: '', descricao: '', capa: '' });
            setEditingModule(null);
            setShowModuleForm(false);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao atualizar módulo",
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

            await fetchModules();
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

            await fetchModules();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao reordenar módulo",
                description: error.message,
            });
        }
    };

    const cancelModuleForm = () => {
        setShowModuleForm(false);
        setEditingModule(null);
        setModuleFormData({ titulo: '', descricao: '', capa: '' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="p-4 lg:p-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Curso não encontrado</h1>
                    <Button onClick={() => navigate('/admin/courses')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para Cursos
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Editar Curso: {course.titulo} - Admin</title>
                <meta name="description" content={`Editando o curso ${course.titulo}`} />
            </Helmet>

            <div className="p-4 lg:p-8 space-y-8">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="flex items-center justify-between"
                >
                    <div className="flex items-center space-x-4">
                        <Button 
                            variant="ghost" 
                            onClick={() => navigate('/admin/courses')}
                            className="hover:bg-white/10"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para Cursos
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Editar Curso</h1>
                            <p className="text-gray-400">{course.titulo}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Seção de Edição do Curso */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-2xl p-6 border border-white/10"
                >
                    <h2 className="text-xl font-bold text-white mb-6">Dados do Curso</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Título do Curso *
                            </label>
                            <input
                                type="text"
                                value={courseData.titulo}
                                onChange={(e) => setCourseData(prev => ({ ...prev, titulo: e.target.value }))}
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
                                value={courseData.categoria}
                                onChange={(e) => setCourseData(prev => ({ ...prev, categoria: e.target.value }))}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Ex: Programação, IA, Design"
                            />
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Descrição *
                            </label>
                            <textarea
                                value={courseData.descricao}
                                onChange={(e) => setCourseData(prev => ({ ...prev, descricao: e.target.value }))}
                                rows={3}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                placeholder="Descreva o conteúdo do curso..."
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                URL da Imagem (Capa)
                            </label>
                            <input
                                type="url"
                                value={courseData.capa}
                                onChange={(e) => setCourseData(prev => ({ ...prev, capa: e.target.value }))}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="https://exemplo.com/imagem.jpg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Slug
                            </label>
                            <input
                                type="text"
                                value={courseData.slug}
                                onChange={(e) => setCourseData(prev => ({ ...prev, slug: e.target.value }))}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="react-zero-avancado"
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                        <Button 
                            onClick={handleUpdateCourse} 
                            disabled={saving} 
                            className="bg-gradient-to-r from-blue-500 to-cyan-500"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </div>
                </motion.div>

                {/* Seção de Módulos */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-2xl p-6 border border-white/10"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Módulos do Curso</h2>
                        <Button
                            onClick={() => {
                                setEditingModule(null);
                                setModuleFormData({ titulo: '', descricao: '', capa: '' });
                                setShowModuleForm(!showModuleForm);
                            }}
                            className="bg-gradient-to-r from-green-500 to-teal-500"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Módulo
                        </Button>
                    </div>

                    {/* Formulário de Módulo */}
                    {showModuleForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">
                                    {editingModule ? 'Editar Módulo' : 'Adicionar Novo Módulo'}
                                </h3>
                                <Button variant="ghost" size="icon" onClick={cancelModuleForm}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            
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
                                <Button variant="ghost" onClick={cancelModuleForm}>
                                    Cancelar
                                </Button>
                                <Button 
                                    onClick={editingModule ? handleUpdateModule : handleAddModule} 
                                    disabled={saving} 
                                    className="bg-gradient-to-r from-green-500 to-teal-500"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {saving ? 'Salvando...' : (editingModule ? 'Atualizar Módulo' : 'Salvar Módulo')}
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
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => navigate(`/admin/courses/${id}/modules/${module.id}/edit`)}
                                                className="hover:bg-white/10"
                                            >
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
                </motion.div>
            </div>
        </>
    );
};

export default AdminCourseEdit;