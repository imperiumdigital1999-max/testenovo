import React from 'react';
import { Camera, Edit3, Save, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ProfileCard = ({ profileData, isEditing, onEdit, onSave, onCancel, onLogout }) => {
  const { toast } = useToast();

  const handleAvatarChange = () => {
    toast({
      title: "🚧 Este recurso ainda não foi implementado—mas não se preocupe! Você pode solicitá-lo no seu próximo prompt! 🚀",
      duration: 3000,
    });
  };

  return (
    <div className="glass rounded-2xl p-6 border border-white/10 space-y-6">
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white neon-glow">
            {profileData.avatar ? (
              <img src={profileData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              profileData.name.charAt(0).toUpperCase()
            )}
          </div>
          <button
            onClick={handleAvatarChange}
            className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
          >
            <Camera className="h-4 w-4 text-white" />
          </button>
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-white">{profileData.name}</h2>
          <p className="text-gray-400">{profileData.email}</p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Membro desde:</span>
          <span className="text-white">{profileData.joinDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Último acesso:</span>
          <span className="text-white">Hoje</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Status:</span>
          <span className="text-green-400 flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            Ativo
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {!isEditing ? (
          <Button
            onClick={onEdit}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Edit3 className="mr-2 h-4 w-4" />
            Editar Perfil
          </Button>
        ) : (
          <div className="space-y-2">
            <Button
              onClick={onCancel}
              variant="ghost"
              className="w-full hover:bg-white/5"
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </div>
        )}
        
        <Button
          onClick={onLogout}
          variant="ghost"
          className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair da Conta
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;