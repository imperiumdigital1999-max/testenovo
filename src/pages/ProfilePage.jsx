import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useToast } from '@/components/ui/use-toast';
import ProfileCard from '@/components/profile/ProfileCard';
import EditProfileForm from '@/components/profile/EditProfileForm';
import StatsGrid from '@/components/profile/StatsGrid';
import AchievementsList from '@/components/profile/AchievementsList';
import SettingsSection from '@/components/profile/SettingsSection';

const ProfilePage = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatar: '',
    joinDate: '2025-07-24',
    lastAccess: '2025-07-24'
  });

  useEffect(() => {
    const savedName = localStorage.getItem('userName') || 'Estudante';
    const savedEmail = localStorage.getItem('userEmail') || 'estudante@universidadedigital.com';
    const savedAvatar = localStorage.getItem('userAvatar') || '';

    setProfileData(prev => ({
      ...prev,
      name: savedName,
      email: savedEmail,
      avatar: savedAvatar
    }));
  }, []);

  const handleSave = (editData) => {
    localStorage.setItem('userName', editData.name);
    localStorage.setItem('userEmail', editData.email);

    setProfileData(prev => ({
      ...prev,
      name: editData.name,
      email: editData.email
    }));

    setIsEditing(false);
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso",
      duration: 3000,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
      duration: 3000,
    });
    // navigate to login is handled by the protected route, but could be explicit here too
  };
  
  return (
    <>
      <Helmet>
        <title>Perfil - Universidade Digital</title>
        <meta name="description" content="Gerencie seu perfil, visualize estatísticas de progresso e conquistas na plataforma." />
      </Helmet>

      <div className="p-4 lg:p-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl lg:text-4xl font-bold gradient-text">
            Meu Perfil
          </h1>
          <p className="text-gray-300 text-lg">
            Gerencie suas informações e acompanhe seu progresso
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <ProfileCard 
              profileData={profileData} 
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
              onLogout={handleLogout}
            />
          </motion.div>

          <div className="lg:col-span-2 space-y-8">
            {isEditing && (
              <EditProfileForm 
                profileData={profileData}
                onSave={handleSave}
              />
            )}
            <StatsGrid />
            <AchievementsList />
            <SettingsSection />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;