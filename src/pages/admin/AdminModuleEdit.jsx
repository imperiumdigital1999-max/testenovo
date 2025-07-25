import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Save, Plus, Edit, Trash2, ChevronUp, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

const AdminModuleEdit = () => {
    const { courseId, moduleId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [module, setModule] = useState(null);
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showLessonForm, setShowLessonForm] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);

    const [moduleData, setModuleData] = useState({
        titulo: '',
        descricao: '',
        capa: '',
        ordem: 1
    });

    const [lessonFormData, setLessonFormData] = useState({
        titulo: '',
        descricao: '',
        video_url: ''
    });

    useEffect(() => {
        if (courseId && moduleId) {
            fetchModule();
            fetchCourse();
            fetchLessons();
        }
    }, [courseId, moduleId]);

    const fetchModule = async () => {
        try {
            const { data, error } = await supabase
                .from('modulos')
                .select('*')
                .eq('id', moduleId)
                .single();

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao carregar módulo",
                    description: error.message,
                });
                navigate(`/admin/courses/${courseId}/edit`);
                return;
            }

            setModule(data);
            setModuleData({
                titulo: data.titulo,
                descricao: data.descricao || '',
                capa: data.capa || '',
                ordem: data.ordem
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao carregar módulo",
                description: error.message,
            });
            navigate(`/admin/courses/${courseId}/edit`);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourse = async () => {
        try {
            const { data, error } = await supabase
                .from('cursos')
                .select('titulo')
                .eq('id', courseId)
                .single();

            if (error) {
                console.error('Erro ao carregar curso:', error);
                return;
            }

            setCourse(data);
        } catch (error) {
            console.error('Erro ao carregar curso:', error);
        }
    };

    const fetchLessons = async () => {
        try {
            const { data, error } = await supabase
                .from('aulas')
                .select('*')
                .eq('modulo_id', moduleId)
                .order('ordem', { ascending: true });

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao carregar aulas",
                    description: error.message,
                });
                return;
            }

            setLessons(data || []);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao carregar aulas",
                description: error.message,
            });
        }
    };

    const handleUpdateModule = async () => {
        if (!moduleData.titulo) {
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
                    titulo: moduleData.titulo,
                    descricao: moduleData.descricao,
                    capa: moduleData.capa || null,
                    ordem: moduleData.ordem,
                    updated_at: new Date().toISOString()
                })
                .eq('id', moduleId);

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

            // Atualizar dados locais
            setModule(prev => ({
                ...prev,
                ...moduleData
            }));
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

    const handleAddLesson = async () => {
        if (!lessonFormData.titulo) {
            toast({
                variant: "destructive",
                title: "Campo obrigatório",
                description: "Preencha o título da aula.",
            });
            return;
        }

        setSaving(true);
        try {
            const { data, error } = await supabase
                .from('aulas')
                .insert([{
                    modulo_id: moduleId,
                    titulo: lessonFormData.titulo,
                    descricao: lessonFormData.descricao,
                    video_url: lessonFormData.video_url || null,
                    ordem: lessons.length + 1
                }])
                .select();

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao adicionar aula",
                    description: error.message,
                });
                return;
            }

            toast({
                title: "Aula adicionada!",
                description: "A aula foi criada com sucesso.",
            });

            await fetchLessons();
            setLessonFormData({ titulo: '', descricao: '', video_url: '' });
            setShowLessonForm(false);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao adicionar aula",
                description: error.message,
            });
        } finally {
            setSaving(false);
        }
    };

    const handleEditLesson = (lesson) => {
        setEditingLesson(lesson);
        setLessonFormData({
            titulo: lesson.titulo,
            descricao: lesson.descricao || '',
            video_url: lesson.video_url || ''
        });
        setShowLessonForm(true);
    };

    const handleUpdateLesson = async () => {
        if (!lessonFormData.titulo) {
            toast({
                variant: "destructive",
                title: "Campo obrigatório",
                description: "Preencha o título da aula.",
            });
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase
                .from('aulas')
                .update({
                    titulo: lessonFormData.titulo,
                    descricao: lessonFormData.descricao,
                    video_url: lessonFormData.video_url || null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', editingLesson.id);

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao atualizar aula",
                    description: error.message,
                });
                return;
            }

            toast({
                title: "Aula atualizada!",
                description: "As informações da aula foram salvas com sucesso.",
            });

            await fetchLessons();
            setLessonFormData({ titulo: '', descricao: '', video_url: '' });
            setEditingLesson(null);
            setShowLessonForm(false);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao atualizar aula",
                description: error.message,
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        if (!confirm('Tem certeza que deseja excluir esta aula?')) return;

        try {
            const { error } = await supabase
                .from('aulas')
                .delete()
                .eq('id', lessonId);

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao excluir aula",
                    description: error.message,
                });
                return;
            }

            toast({
                title: "Aula excluída!",
                description: "A aula foi removida com sucesso.",
            });

            await fetchLessons();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao excluir aula",
                description: error.message,
            });
        }
    };

    const handleUpdateLessonOrder = async (lessonId, newOrder) => {
        try {
            const { error } = await supabase
                .from('aulas')
                .update({ ordem: newOrder })
                .eq('id', lessonId);

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao reordenar aula",
                    description: error.message,
                });
                return;
            }

            await fetchLessons();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao reordenar aula",
                description: error.message,
            });
        }
    };

    const cancelLessonForm = () => {
        setShowLessonForm(false);
        setEditingLesson(null);
        setLessonFormData({ titulo: '', descricao: '', video_url: '' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!module) {
        return (
            <div className="p-4 lg:p-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Módulo não encontrado</h1>
                    <Button onClick={() => navigate(`/admin/courses/${courseId}/edit`)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para Curso
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Editar Módulo: {module.titulo} - Admin</title>
                <meta name="description" content={`Editando o módulo ${module.titulo}`} />
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
                            onClick={() => navigate(`/admin/courses/${courseId}/edit`)}
                            className="hover:bg-white/10"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para Curso
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Editar Módulo</h1>
                            <p className="text-gray-400">{course?.titulo} → {module.titulo}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Seção de Edição do Módulo */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-2xl p-6 border border-white/10"
                >
                    <h2 className="text-xl font-bold text-white mb-6">Dados do Módulo</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Título do Módulo *
                            </label>
                            <input
                                type="text"
                                value={moduleData.titulo}
                                onChange={(e) => setModuleData(prev => ({ ...prev, titulo: e.target.value }))}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Ex: Introdução ao React"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Ordem
                            </label>
                            <input
                                type="number"
                                value={moduleData.ordem}
                                onChange={(e) => setModuleData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 1 }))}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                min="1"
                            />
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Descrição
                            </label>
                            <textarea
                                value={moduleData.descricao}
                                onChange={(e) => setModuleData(prev => ({ ...prev, descricao: e.target.value }))}
                                rows={3}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                placeholder="Descreva o conteúdo do módulo..."
                            />
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                URL da Imagem (Capa)
                            </label>
                            <input
                                type="url"
                                value={moduleData.capa}
                                onChange={(e) => setModuleData(prev => ({ ...prev, capa: e.target.value }))}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="https://exemplo.com/imagem.jpg"
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                        <Button 
                            onClick={handleUpdateModule} 
                            disabled={saving} 
                            className="bg-gradient-to-r from-blue-500 to-cyan-500"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </div>
                </motion.div>

                {/* Seção de Aulas */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-2xl p-6 border border-white/10"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Aulas do Módulo</h2>
                        <Button
                            onClick={() => {
                                setEditingLesson(null);
                                setLessonFormData({ titulo: '', descricao: '', video_url: '' });
                                setShowLessonForm(!showLessonForm);
                            }}
                            className="bg-gradient-to-r from-green-500 to-teal-500"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Aula
                        </Button>
                    </div>

                    {/* Formulário de Aula */}
                    {showLessonForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">
                                    {editingLesson ? 'Editar Aula' : 'Adicionar Nova Aula'}
                                </h3>
                                <Button variant="ghost" size="icon" onClick={cancelLessonForm}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Título da Aula *
                                    </label>
                                    <input
                                        type="text"
                                        value={lessonFormData.titulo}
                                        onChange={(e) => setLessonFormData(prev => ({ ...prev, titulo: e.target.value }))}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Ex: Criando seu primeiro componente"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        URL do Vídeo
                                    </label>
                                    <input
                                        type="url"
                                        value={lessonFormData.video_url}
                                        onChange={(e) => setLessonFormData(prev => ({ ...prev, video_url: e.target.value }))}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="https://youtube.com/watch?v=..."
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Descrição
                                    </label>
                                    <textarea
                                        value={lessonFormData.descricao}
                                        onChange={(e) => setLessonFormData(prev => ({ ...prev, descricao: e.target.value }))}
                                        rows={3}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                        placeholder="Descreva o conteúdo da aula..."
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-end mt-4 space-x-2">
                                <Button variant="ghost" onClick={cancelLessonForm}>
                                    Cancelar
                                </Button>
                                <Button 
                                    onClick={editingLesson ? handleUpdateLesson : handleAddLesson} 
                                    disabled={saving} 
                                    className="bg-gradient-to-r from-green-500 to-teal-500"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {saving ? 'Salvando...' : (editingLesson ? 'Atualizar Aula' : 'Salvar Aula')}
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Lista de Aulas */}
                    <div className="space-y-3">
                        {lessons.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <p>Nenhuma aula criada ainda.</p>
                                <p className="text-sm">Clique em "Adicionar Aula" para começar.</p>
                            </div>
                        ) : (
                            lessons.map((lesson, index) => (
                                <motion.div
                                    key={lesson.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center space-x-3">
                                                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                    #{lesson.ordem}
                                                </span>
                                                <h4 className="font-semibold text-white">{lesson.titulo}</h4>
                                            </div>
                                            {lesson.descricao && (
                                                <p className="text-gray-300 text-sm">{lesson.descricao}</p>
                                            )}
                                            {lesson.video_url && (
                                                <p className="text-blue-400 text-sm">📹 {lesson.video_url}</p>
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
                                                    onClick={() => handleUpdateLessonOrder(lesson.id, lesson.ordem - 1)}
                                                >
                                                    <ChevronUp className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    disabled={index === lessons.length - 1}
                                                    onClick={() => handleUpdateLessonOrder(lesson.id, lesson.ordem + 1)}
                                                >
                                                    <ChevronDown className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            
                                            {/* Botões de Ação */}
                                            <Button variant="ghost" size="icon" onClick={() => handleEditLesson(lesson)}>
                                                <Edit className="h-4 w-4 text-gray-400 hover:text-yellow-400" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteLesson(lesson.id)}>
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

export default AdminModuleEdit;