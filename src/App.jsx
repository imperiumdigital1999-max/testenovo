import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Layout from '@/components/Layout';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

import HomePage from '@/pages/HomePage';
import ContentPage from '@/pages/ContentPage';
import ToolsPage from '@/pages/ToolsPage';
import ProfilePage from '@/pages/ProfilePage';
import CoursePage from '@/pages/CoursePage';
import LoginPage from '@/pages/LoginPage';

import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminCourses from '@/pages/admin/AdminCourses';
import AdminTools from '@/pages/admin/AdminTools';

import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const AppRoutes = () => {
  const { session, loading, userProfile } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!session && location.pathname !== '/login') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (session) {
    if (userProfile && location.pathname === '/login') {
      if (userProfile.tipo === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }

    if (userProfile?.tipo === 'aluno' && location.pathname.startsWith('/admin')) {
      toast({
        title: 'Acesso Negado',
        description: 'Você não tem permissão para acessar o painel de administrador.',
        variant: 'destructive',
      });
      return <Navigate to="/" replace />;
    }
  }
  
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* User Routes */}
      <Route path="/" element={<Layout><Outlet/></Layout>}>
        <Route index element={<HomePage />} />
        <Route path="conteudo" element={<ContentPage />} />
        <Route path="ferramentas" element={<ToolsPage />} />
        <Route path="perfil" element={<ProfilePage />} />
        <Route path="curso/:id" element={<CoursePage />} />
      </Route>

      {/* Admin Routes */}
      <Route 
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout><Outlet/></AdminLayout>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="tools" element={<AdminTools />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};


function App() {
  return (
    <>
      <Helmet>
        <title>Universidade Digital</title>
        <meta name="description" content="Plataforma moderna de ensino digital com cursos e ferramentas de IA." />
      </Helmet>
      
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
          <Toaster />
        </div>
      </Router>
    </>
  );
}

export default App;