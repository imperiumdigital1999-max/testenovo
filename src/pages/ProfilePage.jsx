import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useToast } from '@/components/ui/use-toast';
import ProfileCard from '@/components/profile/ProfileCard';
import EditProfileForm from '@/components/profile/EditProfileForm';
import StatsGrid from '@/components/profile/StatsGrid';
import AchievementsList from '@/components/profile/AchievementsList';
import SettingsSection from '@/components/profile/SettingsSection';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { toast } = useToast();
  const { userProfile, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatar: '',
    joinDate: '',
    lastAccess: ''
  });

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        name: userProfile.nome || 'Estudante',
        email: userProfile.email || '',
        avatar: '',
        joinDate: new Date(userProfile.created_at).toLocaleDateString('pt-BR'),
        lastAccess: 'Hoje'
      });
    }
  }, [userProfile]);

  const handleSave = async (editData) => {
    const updates = {
      nome: editData.name,
      email: editData.email
    };

    const { error } = await updateProfile(updates);
    
    if (!error) {
      setProfileData(prev => ({
        ...prev,
        name: editData.name,
        email: editData.email
      }));
    }
    
    setIsEditing(false);
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/login');
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
        duration: 3000,
      });
    }
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