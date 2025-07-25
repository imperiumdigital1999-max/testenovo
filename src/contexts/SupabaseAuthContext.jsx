import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }, []);
  const handleSession = useCallback(async (session) => {
    setSession(session);
    setUser(session?.user ?? null);
    
    if (session?.user) {
      const profile = await fetchUserProfile(session.user.id);
      setUserProfile(profile);
    } else {
      setUserProfile(null);
    }
    
    setLoading(false);
  }, [fetchUserProfile]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        handleSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  const signUp = useCallback(async (email, password, options) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up Failed",
        description: error.message || "Something went wrong",
      });
    }
      toast({
        title: "Cadastro realizado!",
        description: "Verifique seu email para confirmar a conta.",
      });

    return { error };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: error.message || "Something went wrong",
      });
    }

    return { error };
  }, [toast]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: error.message || "Something went wrong",
      });
    }

    return { error };
  }, [toast]);

  const updateProfile = useCallback(async (updates) => {
    if (!user) return { error: new Error('Usuário não autenticado') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao atualizar perfil",
          description: error.message,
        });
        return { error };
      }

      // Atualizar o perfil local
      const updatedProfile = await fetchUserProfile(user.id);
      setUserProfile(updatedProfile);

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });

      return { error: null };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: error.message,
      });
      return { error };
    }
  }, [user, fetchUserProfile, toast]);
  const value = useMemo(() => ({
    user,
    session,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }), [user, session, userProfile, loading, signUp, signIn, signOut, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
