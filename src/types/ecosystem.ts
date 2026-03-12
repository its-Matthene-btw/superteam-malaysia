
export type EcosystemProject = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  short_description: string | null;
  long_description: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  website_url: string | null;
  docs_url: string | null;
  twitter_url: string | null;
  discord_url: string | null;
  github_url: string | null;
  network: string | null;
  token_symbol: string | null;
  contract_address: string | null;
  status: string | null;
  featured: boolean;
  created_at: string;
};

export type EcosystemCategory = {
  id: string;
  name: string;
  created_at: string;
};

export type EcosystemOpportunity = {
  id: string;
  title: string | null;
  description: string | null;
  type: string | null;
  link: string | null;
  created_at: string;
};

export type EcosystemFeature = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  created_at: string;
};
