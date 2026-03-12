
export type EcosystemProject = {
  id: string;
  name: string;
  slug: string;
  category: string;
  short_description: string;
  long_description: string;
  logo_url: string;
  hero_image_url: string;
  website_url: string;
  docs_url: string;
  twitter_url: string;
  discord_url: string;
  github_url: string;
  contract_address: string;
  network: string;
  token_symbol: string;
  status: string;
  featured: boolean;
  created_at: string;
};

export type EcosystemCategory = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type EcosystemOpportunity = {
  id: string;
  title: string;
  description: string;
  type: string;
  link: string;
  created_at: string;
};

export type EcosystemFeature = {
  id: string;
  project_id: string;
  title: string;
  description: string;
};
