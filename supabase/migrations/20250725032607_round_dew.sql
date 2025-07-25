/*
  # Adicionar campo plano à tabela profiles

  1. Alterações na Tabela
    - Adicionar coluna `plano` à tabela `profiles`
    - Valores possíveis: 'gratuito', 'premium'
    - Valor padrão: 'gratuito'

  2. Constraint
    - Adicionar check constraint para valores válidos
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'plano'
  ) THEN
    ALTER TABLE profiles ADD COLUMN plano text DEFAULT 'gratuito' NOT NULL;
  END IF;
END $$;

-- Adicionar constraint para valores válidos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'profiles_plano_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_plano_check 
    CHECK (plano IN ('gratuito', 'premium'));
  END IF;
END $$;