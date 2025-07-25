import React from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, BookOpen, TrendingUp } from 'lucide-react';

const StatsGrid = () => {
    const stats = [
        { icon: BookOpen, label: 'Cursos Concluídos', value: '12', color: 'text-green-400' },
        { icon: Clock, label: 'Horas de Estudo', value: '156h', color: 'text-blue-400' },
        { icon: Award, label: 'Certificados', value: '8', color: 'text-yellow-400' },
        { icon: TrendingUp, label: 'Streak Atual', value: '15 dias', color: 'text-purple-400' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
            {stats.map((stat, index) => (
                <div key={index} className="glass rounded-xl p-4 border border-white/10 text-center">
                    <div className={`inline-flex p-2 rounded-lg bg-white/10 ${stat.color} mb-3`}>
                        <stat.icon className="h-5 w-5" />
                    </div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
            ))}
        </motion.div>
    );
};

export default StatsGrid;