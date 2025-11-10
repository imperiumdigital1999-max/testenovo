/*
  # Create courses table

  1. New Tables
    - `cursos`
      - `id` (uuid, primary key)
      - `titulo` (text, course title)
      - `descricao` (text, course description)
      - `categoria` (text, course category)
      - `capa` (text, cover image URL, optional)
      - `slug` (text, URL-friendly identifier)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `cursos` table
    - Add policy for authenticated users to read all courses
    - Add policy for admins to manage all courses (insert, update, delete)

  3. Important Notes
    - All users can view courses
    - Only admins can create, update, or delete courses
*/

-- Create cursos table
CREATE TABLE IF NOT EXISTS cursos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text NOT NULL,
  categoria text NOT NULL,
  capa text,
  slug text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;

-- Policy for all authenticated users to read courses
CREATE POLICY "Anyone can read courses"
  ON cursos
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for admins to insert courses
CREATE POLICY "Admins can insert courses"
  ON cursos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND tipo = 'admin'
    )
  );

-- Policy for admins to update courses
CREATE POLICY "Admins can update courses"
  ON cursos
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND tipo = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND tipo = 'admin'
    )
  );

-- Policy for admins to delete courses
CREATE POLICY "Admins can delete courses"
  ON cursos
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND tipo = 'admin'
    )
  );

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_cursos_updated_at ON cursos;
CREATE TRIGGER update_cursos_updated_at
  BEFORE UPDATE ON cursos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
