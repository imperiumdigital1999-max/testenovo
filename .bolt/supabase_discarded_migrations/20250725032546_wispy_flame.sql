/*
  # Criar tabela de cursos

  1. Nova Tabela
    - `cursos`
      - `id` (uuid, primary key)
      - `titulo` (text, título do curso)
      - `descricao` (text, descrição do curso)
      - `capa` (text, URL da imagem de capa)
      - `slug` (text, slug único para URLs)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS na tabela `cursos`
    - Adicionar política para usuários autenticados lerem cursos
*/

CREATE TABLE IF NOT EXISTS cursos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text,
  capa text,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ler cursos"
  ON cursos
  FOR SELECT
  TO authenticated
  USING (true);

-- Inserir alguns cursos de exemplo
INSERT INTO cursos (titulo, descricao, capa, slug) VALUES
('React do Zero ao Avançado', 'Aprenda React desde o básico até conceitos avançados com projetos práticos', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee', 'react-zero-avancado'),
('IA Generativa na Prática', 'Domine as principais ferramentas de IA generativa do mercado', 'https://images.unsplash.com/photo-1677442136019-21780ecad995', 'ia-generativa-pratica'),
('UX/UI Design Moderno', 'Crie interfaces incríveis e experiências memoráveis para usuários', 'https://images.unsplash.com/photo-1561070791-2526d30994b5', 'ux-ui-design-moderno'),
('Python para Data Science', 'Análise de dados e machine learning com Python', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935', 'python-data-science'),
('Marketing Digital 360°', 'Estratégias completas de marketing digital para empresas', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', 'marketing-digital-360'),
('Harmonização Facial Avançada', 'Técnicas avançadas de harmonização facial para profissionais', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56', 'harmonizacao-facial-avancada');