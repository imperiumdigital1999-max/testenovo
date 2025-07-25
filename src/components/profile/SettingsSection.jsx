import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Settings, Bell, Shield } from 'lucide-react';

const SettingsSection = () => {
    const { toast } = useToast();

    const handleSettingsClick = () => {
        toast({
            title: "🚧 Este recurso ainda não foi implementado—mas não se preocupe! Você pode solicitá-lo no seu próximo prompt! 🚀",
            duration: 3000,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-6 border border-white/10"
        >
            <h3 className="text-xl font-bold text-white mb-6">Configurações</h3>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-purple-400" />
                        <div>
                            <p className="font-medium text-white">Notificações</p>
                            <p className="text-sm text-gray-400">Receber e-mails sobre novos cursos</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSettingsClick}
                    >
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-green-400" />
                        <div>
                            <p className="font-medium text-white">Privacidade</p>
                            <p className="text-sm text-gray-400">Gerenciar dados pessoais</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSettingsClick}
                    >
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default SettingsSection;