/*
  # Criar tabela de módulos dos cursos

  1. Nova Tabela
    - `modulos`
      - `id` (uuid, primary key)
      - `curso_id` (uuid, foreign key para cursos)
      - `titulo` (text)
      - `descricao` (text)
      - `capa` (text - URL da imagem)
      - `ordem` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Enable RLS na tabela `modulos`
    - Políticas para admins gerenciarem módulos
*/

CREATE TABLE IF NOT EXISTS modulos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  curso_id uuid NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descricao text,
  capa text,
  ordem integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE modulos ENABLE ROW LEVEL SECURITY;

-- Política para admins gerenciarem todos os módulos
CREATE POLICY "Admins can manage all modules"
  ON modulos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.tipo = 'admin'
    )
  );

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_modulos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_modulos_updated_at
  BEFORE UPDATE ON modulos
  FOR EACH ROW
  EXECUTE FUNCTION update_modulos_updated_at();

-- Índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_modulos_curso_id ON modulos(curso_id);
CREATE INDEX IF NOT EXISTS idx_modulos_ordem ON modulos(curso_id, ordem);