import React from 'react';
import { motion } from 'framer-motion';

const AchievementsList = () => {
    const achievements = [
        { id: 1, title: 'Primeiro Curso', description: 'Completou seu primeiro curso', icon: '🎯', date: '15 Jan 2024', unlocked: true },
        { id: 2, title: 'Estudante Dedicado', description: '50 horas de estudo', icon: '📚', date: '20 Jan 2024', unlocked: true },
        { id: 3, title: 'Streak Master', description: '7 dias consecutivos', icon: '🔥', date: '22 Jan 2024', unlocked: true },
        { id: 4, title: 'Expert em IA', description: 'Complete 5 cursos de IA', icon: '🤖', date: 'Bloqueado', unlocked: false }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6 border border-white/10"
        >
            <h3 className="text-xl font-bold text-white mb-6">Conquistas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                    <div
                        key={achievement.id}
                        className={`p-4 rounded-xl border transition-all duration-300 ${
                        achievement.unlocked
                            ? 'bg-white/5 border-white/10 hover:bg-white/10'
                            : 'bg-gray-800/30 border-gray-700/30 opacity-60'
                        }`}
                    >
                        <div className="flex items-start space-x-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                            <h4 className={`font-semibold ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                            {achievement.title}
                            </h4>
                            <p className={`text-sm ${achievement.unlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                            {achievement.description}
                            </p>
                            <p className={`text-xs mt-1 ${achievement.unlocked ? 'text-purple-400' : 'text-gray-600'}`}>
                            {achievement.date}
                            </p>
                        </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default AchievementsList;