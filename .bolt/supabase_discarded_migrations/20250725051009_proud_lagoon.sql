/*
  # Criar tabela de aulas

  1. Nova Tabela
    - `aulas`
      - `id` (uuid, primary key)
      - `modulo_id` (uuid, foreign key para modulos)
      - `titulo` (text)
      - `descricao` (text)
      - `video_url` (text)
      - `ordem` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS na tabela `aulas`
    - Política de leitura para usuários autenticados
    - Política de escrita apenas para administradores

  3. Índices
    - Índice para `modulo_id` para performance
    - Índice para `ordem` para ordenação
*/

-- Criar tabela aulas
CREATE TABLE IF NOT EXISTS aulas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  modulo_id uuid NOT NULL REFERENCES modulos(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descricao text,
  video_url text,
  ordem integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE aulas ENABLE ROW LEVEL SECURITY;

-- Política de leitura para usuários autenticados
CREATE POLICY "Usuários autenticados podem ler aulas"
  ON aulas
  FOR SELECT
  TO authenticated
  USING (true);

-- Política de escrita apenas para administradores
CREATE POLICY "Apenas admins podem gerenciar aulas"
  ON aulas
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.tipo = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.tipo = 'admin'
    )
  );

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_aulas_modulo_id ON aulas(modulo_id);
CREATE INDEX IF NOT EXISTS idx_aulas_ordem ON aulas(ordem);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_aulas_updated_at
  BEFORE UPDATE ON aulas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();