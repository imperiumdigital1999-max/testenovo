import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(undefined);

// Usuário de demonstração para testes
const DEMO_USER = {
  id: 'demo-user-123',
  email: 'admin@universidadedigital.com',
  password: '123456',
  profile: {
    id: 'demo-user-123',
    nome: 'Administrador Demo',
    email: 'admin@universidadedigital.com',
    tipo: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
};

const DEMO_STUDENT = {
  id: 'demo-student-456',
  email: 'aluno@universidadedigital.com',
  password: '123456',
  profile: {
    id: 'demo-student-456',
    nome: 'João Silva',
    email: 'aluno@universidadedigital.com',
    tipo: 'aluno',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
};
export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);

  const fetchUserProfile = useCallback(async (userId) => {
    if (!userId) return null;
    
    // Verificar se é usuário demo
    if (userId === DEMO_USER.id) {
      console.log("Retornando perfil demo admin:", DEMO_USER.profile);
      return DEMO_USER.profile;
    }
    if (userId === DEMO_STUDENT.id) {
      console.log("Retornando perfil demo aluno:", DEMO_STUDENT.profile);
      return DEMO_STUDENT.profile;
    }
    
    try {
      console.log("Buscando perfil no Supabase para userId:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // Not found error is expected for new users
          console.error('Error fetching user profile:', error);
        }
        console.log("Perfil não encontrado no banco para userId:", userId);
        return null;
      }

      console.log("Perfil encontrado no Supabase:", data);
      return data;
    } catch (error) {
      if (error.name !== 'AbortError') { // Ignore abort errors
        console.error('Error fetching user profile:', error);
      }
      return null;
    }
  }, []);

  const handleSession = useCallback(async (session) => {
    setSession(session);
    setUser(session?.user ?? null);
    
    if (session?.user) {
      try {
        console.log("Carregando perfil para usuário:", session.user.id);
        const profile = await fetchUserProfile(session.user.id);
        console.log("Perfil carregado do banco:", profile);
        setUserProfile(profile);
      } catch (error) {
        console.error('Error handling session:', error);
        setUserProfile(null);
      }
    } else {
      setUserProfile(null);
      setHasRedirected(false);
    }
    
    setLoading(false);
  }, [fetchUserProfile]);

  // Redirecionamento automático após carregamento do perfil
  useEffect(() => {
    if (!loading && userProfile && session && !hasRedirected) {
      console.log("Redirecionando usuário baseado no tipo:", userProfile.tipo);
      
      if (userProfile.tipo === 'admin') {
        console.log("Redirecionando admin para /admin/dashboard");
        navigate('/admin/dashboard');
      } else {
        console.log("Redirecionando aluno para /");
        navigate('/');
      }
      
      setHasRedirected(true);
    }
  }, [loading, userProfile, session, hasRedirected, navigate]);
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        handleSession(session);
      } catch (error) {
        console.error('Error getting session:', error);
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          handleSession(session);
        } catch (error) {
          console.error('Error in auth state change:', error);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  const signUp = useCallback(async (email, password, options) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: options || {},
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign up Failed",
          description: error.message || "Something went wrong",
        });
        return { error };
      }

      toast({
        title: "Cadastro realizado!",
        description: "Verifique seu email para confirmar a conta.",
      });

      return { error: null };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor. Tente novamente.",
      });
      return { error };
    }
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    // Verificar se é login demo
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      const demoSession = {
        user: {
          id: DEMO_USER.id,
          email: DEMO_USER.email,
          user_metadata: { full_name: DEMO_USER.profile.nome }
        },
        access_token: 'demo-token',
        refresh_token: 'demo-refresh'
      };
      
      console.log("Login demo admin realizado, definindo sessão:", demoSession);
      setSession(demoSession);
      setUser(demoSession.user);
      setUserProfile(DEMO_USER.profile);
      setLoading(false);
      setHasRedirected(false); // Permitir redirecionamento
      
      toast({
        title: "Login realizado!",
        description: "Bem-vindo, Administrador!",
      });
      
      return { error: null };
    }
    
    if (email === DEMO_STUDENT.email && password === DEMO_STUDENT.password) {
      const demoSession = {
        user: {
          id: DEMO_STUDENT.id,
          email: DEMO_STUDENT.email,
          user_metadata: { full_name: DEMO_STUDENT.profile.nome }
        },
        access_token: 'demo-token',
        refresh_token: 'demo-refresh'
      };
      
      console.log("Login demo aluno realizado, definindo sessão:", demoSession);
      setSession(demoSession);
      setUser(demoSession.user);
      setUserProfile(DEMO_STUDENT.profile);
      setLoading(false);
      setHasRedirected(false); // Permitir redirecionamento
      
      toast({
        title: "Login realizado!",
        description: "Bem-vindo, João!",
      });
      
      return { error: null };
    }
    
    try {
      console.log("Tentando login no Supabase para:", email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erro no login Supabase:", error);
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: error.message || "Something went wrong",
        });
      } else {
        console.log("Login no Supabase bem-sucedido");
      }

      return { error };
    } catch (error) {
      console.error("Erro de conexão no login:", error);
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor. Tente novamente.",
      });
      return { error };
    }
  }, [toast]);

  const signOut = useCallback(async () => {
    // Se for usuário demo, apenas limpar o estado local
    if (user && (user.id === DEMO_USER.id || user.id === DEMO_STUDENT.id)) {
      setSession(null);
      setUser(null);
      setUserProfile(null);
      setHasRedirected(false);
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
      
      return { error: null };
    }
    
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao sair",
          description: error.message || "Something went wrong",
        });
      }

      return { error };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor. Tente novamente.",
      });
      return { error };
    }
  }, [toast]);

  const updateProfile = useCallback(async (updates) => {
    if (!user) return { error: new Error('Usuário não autenticado') };

    // Se for usuário demo, simular atualização
    if (user.id === DEMO_USER.id || user.id === DEMO_STUDENT.id) {
      const updatedProfile = { ...userProfile, ...updates };
      setUserProfile(updatedProfile);
      
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
      
      return { error: null };
    }
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
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor. Tente novamente.",
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
