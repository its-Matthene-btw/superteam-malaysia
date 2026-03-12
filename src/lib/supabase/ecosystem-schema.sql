
-- Create the ecosystem_projects table
CREATE TABLE ecosystem_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text,
  short_description text,
  long_description text,
  logo_url text,
  hero_image_url text,
  website_url text,
  docs_url text,
  twitter_url text,
  discord_url text,
  github_url text,
  contract_address text,
  network text,
  token_symbol text,
  status text,
  featured boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

-- Create the ecosystem_categories table
CREATE TABLE ecosystem_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamp DEFAULT now()
);

-- Create the ecosystem_features table
CREATE TABLE ecosystem_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES ecosystem_projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text
);

-- Create the ecosystem_opportunities table
CREATE TABLE ecosystem_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text,
  link text,
  created_at timestamp DEFAULT now()
);

-- Create the ecosystem-assets storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('ecosystem-assets', 'ecosystem-assets', true);
