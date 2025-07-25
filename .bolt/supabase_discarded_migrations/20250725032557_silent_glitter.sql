/*
  # Criar tabela de acessos

  1. Nova Tabela
    - `acessos`
      - `id` (uuid, primary key)
      - `user_id` (uuid, referência para auth.users)
      - `curso_id` (uuid, referência para cursos)
      - `created_at` (timestamp)

  2. Segurança
    - Habilitar RLS na tabela `acessos`
    - Adicionar política para usuários lerem apenas seus próprios acessos
    - Adicionar política para admins gerenciarem todos os acessos

  3. Índices
    - Índice único para user_id + curso_id
    - Índice para consultas rápidas
*/

CREATE TABLE IF NOT EXISTS acessos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  curso_id uuid NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, curso_id)
);

ALTER TABLE acessos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios acessos"
  ON acessos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins podem gerenciar todos os acessos"
  ON acessos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.tipo = 'admin'
    )
  );

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_acessos_user_id ON acessos(user_id);
CREATE INDEX IF NOT EXISTS idx_acessos_curso_id ON acessos(curso_id);
CREATE INDEX IF NOT EXISTS idx_acessos_user_curso ON acessos(user_id, curso_id);