/*
  # Criar tabela de perfis de usuários

  1. Nova Tabela
    - `profiles`
      - `id` (uuid, primary key, referencia auth.users)
      - `nome` (text, nome completo do usuário)
      - `email` (text, email do usuário)
      - `tipo` (text, tipo do usuário: 'aluno' ou 'admin')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS na tabela `profiles`
    - Adicionar políticas para usuários autenticados lerem seus próprios dados
    - Adicionar políticas para admins gerenciarem todos os perfis
*/

-- Criar tabela de perfis
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL,
  email text NOT NULL,
  tipo text NOT NULL DEFAULT 'aluno' CHECK (tipo IN ('aluno', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para usuários lerem seus próprios dados
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Política para usuários atualizarem seus próprios dados
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Política para admins lerem todos os perfis
CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND tipo = 'admin'
    )
  );

-- Política para admins gerenciarem todos os perfis
CREATE POLICY "Admins can manage all profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND tipo = 'admin'
    )
  );

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, nome, email, tipo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
    NEW.email,
    CASE 
      WHEN NEW.email = 'admin@universidadedigital.com' THEN 'admin'
      ELSE 'aluno'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS create_profile_trigger ON auth.users;
CREATE TRIGGER create_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();