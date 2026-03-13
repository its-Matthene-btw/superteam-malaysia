'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const sqlCommands = [
  // Extensions
  "CREATE EXTENSION IF NOT EXISTS pgroonga;",
  "CREATE EXTENSION IF NOT EXISTS pg_trgm;",

  // Functions
  "CREATE OR REPLACE FUNCTION check_is_staff() RETURNS BOOLEAN AS $$ BEGIN RETURN (SELECT 'authenticated') = (SELECT rolname FROM pg_roles WHERE rolname = current_user); END; $$ LANGUAGE plpgsql;",
  "CREATE OR REPLACE FUNCTION to_iso_8601(timestamptz) RETURNS text AS $$ SELECT to_char($1, 'YYYY-MM-DD\"T\"HH24:MI:SS\"Z\"'); $$ LANGUAGE sql IMMUTABLE;",

  // Drop existing tables if they exist
  "DROP TABLE IF EXISTS testimonials CASCADE;",
  "DROP TABLE IF EXISTS partners CASCADE;",
  "DROP TABLE IF EXISTS stats CASCADE;",
  "DROP TABLE IF EXISTS members CASCADE;",
  "DROP TABLE IF EXISTS events CASCADE;",
  "DROP TABLE IF EXISTS news CASCADE;",
  "DROP TABLE IF EXISTS ecosystem_projects CASCADE;",
  "DROP TABLE IF EXISTS ecosystem_categories CASCADE;",
  "DROP TABLE IF EXISTS ecosystem_features CASCADE;",
  "DROP TABLE IF EXISTS ecosystem_opportunities CASCADE;",
  "DROP TABLE IF EXISTS faqs CASCADE;",

  // Create tables
  `
    CREATE TABLE stats (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      label TEXT NOT NULL,
      value TEXT NOT NULL
    );
  `,
  `
    CREATE TABLE partners (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      logo_url TEXT,
      website_url TEXT,
      category TEXT
    );
  `,
  `
    CREATE TABLE members (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      full_name TEXT NOT NULL,
      avatar_url TEXT,
      role TEXT,
      bio TEXT,
      social_links JSONB,
      featured BOOLEAN DEFAULT false
    );
  `,
  `
    CREATE TABLE events (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      event_date TIMESTAMPTZ NOT NULL,
      location TEXT,
      image_url TEXT,
      description TEXT,
      featured BOOLEAN,
      category TEXT,
      status TEXT DEFAULT 'upcoming',
      slug TEXT UNIQUE
    );
  `,
  `
    CREATE TABLE news (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      author TEXT,
      published_at TIMESTAMPTZ,
      excerpt TEXT,
      content TEXT,
      image_url TEXT,
      tags TEXT[]
    );
  `,
  `
    CREATE TABLE testimonials (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      author_name TEXT NOT NULL,
      author_role TEXT,
      author_avatar_url TEXT,
      content TEXT NOT NULL
    );
  `,
  `
    CREATE TABLE ecosystem_projects (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT,
      short_description TEXT,
      long_description TEXT,
      logo_url TEXT,
      hero_image_url TEXT,
      website_url TEXT,
      docs_url TEXT,
      twitter_url TEXT,
      discord_url TEXT,
      github_url TEXT,
      contract_address TEXT,
      network TEXT,
      token_symbol TEXT,
      status TEXT,
      featured BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `,
  `
    CREATE TABLE ecosystem_categories (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `,
  `
    CREATE TABLE ecosystem_features (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id uuid REFERENCES ecosystem_projects(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT
    );
  `,
  `
    CREATE TABLE ecosystem_opportunities (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      type TEXT NOT NULL,
      link TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `,
  `
    CREATE TABLE faqs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT
    );
  `,

  // Insert data
  // Stats
  "INSERT INTO stats (label, value) VALUES ('Ecosystem Projects', '3+'), ('Global Partners', '45+'), ('Active Builders', '2k+'), ('Community Members', '5k+');",

  // Partners
  "INSERT INTO partners (name, logo_url, category) VALUES ('Solana Foundation', 'https://res.cloudinary.com/superteam/image/upload/v1717524967/partners/solana-foundation_fn1g5n.svg', 'Ecosystem'), ('Jupiter', 'https://res.cloudinary.com/superteam/image/upload/v1717524967/partners/jup_gwprkv.png', 'Ecosystem'), ('Pyth', 'https://res.cloudinary.com/superteam/image/upload/v1717524966/partners/pyth_ykvn3u.svg', 'Ecosystem'), ('Phantom', 'https://res.cloudinary.com/superteam/image/upload/v1717524966/partners/phantom_n9z5hl.svg', 'Ecosystem');",

  // Members
  "INSERT INTO members (full_name, avatar_url, role, bio, social_links, featured) VALUES ('John Doe', 'https://randomuser.me/api/portraits/men/1.jpg', 'Founder', 'Building the future of decentralized finance.', '{\"twitter\": \"https://twitter.com/johndoe\"}', true), ('Jane Smith', 'https://randomuser.me/api/portraits/women/2.jpg', 'Developer', 'Solana enthusiast and full-stack developer.', '{\"github\": \"https://github.com/janesmith\"}', true);",

  // Events
  "INSERT INTO events (title, event_date, location, featured, category, status, slug) VALUES ('Solana Hacker House', '2024-08-15T10:00:00Z', 'Kuala Lumpur', true, 'Hackathon', 'upcoming', 'solana-hacker-house-kl'), ('Web3 Workshop', '2024-09-01T14:00:00Z', 'Virtual', false, 'Workshop', 'upcoming', 'web3-workshop-sept');",

  // News
  "INSERT INTO news (title, slug, author, published_at, excerpt, content) VALUES ('The Rise of Solana in Malaysia', 'rise-of-solana-malaysia', 'SuperteamMY', '2024-07-20T12:00:00Z', 'A deep dive into the growing adoption of Solana.', 'Full content here...');",

  // Testimonials
  "INSERT INTO testimonials (author_name, author_role, content) VALUES ('Mert Mumtaz', 'CEO, Helius', 'Superteam is a core pillar of the Solana ecosystem.');",

  // Ecosystem Projects
  "INSERT INTO ecosystem_projects (name, slug, category, short_description, featured) VALUES ('Marinade Finance', 'marinade-finance', 'DeFi', 'Liquid staking protocol on Solana.', true), ('Orca', 'orca', 'DeFi', 'User-friendly decentralized exchange.', false), ('Helium', 'helium', 'Infrastructure', 'Decentralized wireless network.', true);",
  
  // Ecosystem Categories
  "INSERT INTO ecosystem_categories (name) VALUES ('DeFi'), ('Dev Tools'), ('Infrastructure'), ('NFTs & Consumer'), ('Wallets');",

  // Ecosystem Opportunities
  "INSERT INTO ecosystem_opportunities (title, description, type, link) VALUES ('Solana Grant', 'Funding for projects building on Solana.', 'Grant', 'https://solana.org/grants'), ('Security Audit Bounty', 'Find vulnerabilities in our smart contracts.', 'Bounty', '#');",

  // FAQs
  "INSERT INTO faqs (question, answer, category) VALUES ('What is Superteam Malaysia?', 'A community of builders, creators, and operators learning and earning in the Solana ecosystem.', 'General');",

  // RLS Policies
  "ALTER TABLE stats ENABLE ROW LEVEL SECURITY;",
  "ALTER TABLE partners ENABLE ROW LEVEL SECURITY;",
  "ALTER TABLE members ENABLE ROW LEVEL SECURITY;",
  "ALTER TABLE events ENABLE ROW LEVEL SECURITY;",
  "ALTER TABLE news ENABLE ROW LEVEL SECURITY;",
  "ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;",
  "ALTER TABLE ecosystem_projects ENABLE ROW LEVEL SECURITY;",
  "ALTER TABLE ecosystem_categories ENABLE ROW LEVEL SECURITY;",
  "ALTER TABLE ecosystem_features ENABLE ROW LEVEL SECURITY;",
  "ALTER TABLE ecosystem_opportunities ENABLE ROW LEVEL SECURITY;",
  "ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;",

  // Create Policies
  "DROP POLICY IF EXISTS \"Public Read Stats\" ON stats;",
  "DROP POLICY IF EXISTS \"Public Read Partners\" ON partners;",
  "DROP POLICY IF EXISTS \"Public Read Members\" ON members;",
  "DROP POLICY IF EXISTS \"Public Read Events\" ON events;",
  "DROP POLICY IF EXISTS \"Public Read News\" ON news;",
  "DROP POLICY IF EXISTS \"Public Read Testimonials\" ON testimonials;",
  "DROP POLICY IF EXISTS \"Public Read Eco Projects\" ON ecosystem_projects;",
  "DROP POLICY IF EXISTS \"Public Read Eco Categories\" ON ecosystem_categories;",
  "DROP POLICY IF EXISTS \"Public Read Eco Features\" ON ecosystem_features;",
  "DROP POLICY IF EXISTS \"Public Read Eco Opportunities\" ON ecosystem_opportunities;",
  "DROP POLICY IF EXISTS \"Public Read FAQs\" ON faqs;",
  "DROP POLICY IF EXISTS \"Staff Modify Stats\" ON stats;",
  "DROP POLICY IF EXISTS \"Staff Modify Partners\" ON partners;",
  "DROP POLICY IF EXISTS \"Staff Modify Members\" ON members;",
  "DROP POLICY IF EXISTS \"Staff Modify Events\" ON events;",
  "DROP POLICY IF EXISTS \"Staff Modify News\" ON news;",
  "DROP POLICY IF EXISTS \"Staff Modify Testimonials\" ON testimonials;",
  "DROP POLICY IF EXISTS \"Staff Modify Eco Projects\" ON ecosystem_projects;",
  "DROP POLICY IF EXISTS \"Staff Modify Eco Categories\" ON ecosystem_categories;",
  "DROP POLICY IF EXISTS \"Staff Modify Eco Features\" ON ecosystem_features;",
  "DROP POLICY IF EXISTS \"Staff Modify Eco Opportunities\" ON ecosystem_opportunities;",
  "DROP POLICY IF EXISTS \"Staff Modify FAQs\" ON faqs;",

  "CREATE POLICY \"Public Read Stats\" ON stats FOR SELECT USING (true);",
  "CREATE POLICY \"Public Read Partners\" ON partners FOR SELECT USING (true);",
  "CREATE POLICY \"Public Read Members\" ON members FOR SELECT USING (true);",
  "CREATE POLICY \"Public Read Events\" ON events FOR SELECT USING (true);",
  "CREATE POLICY \"Public Read News\" ON news FOR SELECT USING (true);",
  "CREATE POLICY \"Public Read Testimonials\" ON testimonials FOR SELECT USING (true);",
  "CREATE POLICY \"Public Read Eco Projects\" ON ecosystem_projects FOR SELECT USING (true);",
  "CREATE POLICY \"Public Read Eco Categories\" ON ecosystem_categories FOR SELECT USING (true);",
  "CREATE POLICY \"Public Read Eco Features\" ON ecosystem_features FOR SELECT USING (true);",
  "CREATE POLICY \"Public Read Eco Opportunities\" ON ecosystem_opportunities FOR SELECT USING (true);",
  "CREATE POLICY \"Public Read FAQs\" ON faqs FOR SELECT USING (true);",

  "CREATE POLICY \"Staff Modify Stats\" ON stats FOR ALL TO authenticated USING (check_is_staff());",
  "CREATE POLICY \"Staff Modify Partners\" ON partners FOR ALL TO authenticated USING (check_is_staff());",
  "CREATE POLICY \"Staff Modify Members\" ON members FOR ALL TO authenticated USING (check_is_staff());",
  "CREATE POLICY \"Staff Modify Events\" ON events FOR ALL TO authenticated USING (check_is_staff());",
  "CREATE POLICY \"Staff Modify News\" ON news FOR ALL TO authenticated USING (check_is_staff());",
  "CREATE POLICY \"Staff Modify Testimonials\" ON testimonials FOR ALL TO authenticated USING (check_is_staff());",
  "CREATE POLICY \"Staff Modify Eco Projects\" ON ecosystem_projects FOR ALL TO authenticated USING (check_is_staff());",
  "CREATE POLICY \"Staff Modify Eco Categories\" ON ecosystem_categories FOR ALL TO authenticated USING (check_is_staff());",
  "CREATE POLICY \"Staff Modify Eco Features\" ON ecosystem_features FOR ALL TO authenticated USING (check_is_staff());",
  "CREATE POLICY \"Staff Modify Eco Opportunities\" ON ecosystem_opportunities FOR ALL TO authenticated USING (check_is_staff());",
  "CREATE POLICY \"Staff Modify FAQs\" ON faqs FOR ALL TO authenticated USING (check_is_staff());"
];

const testimonialCommands = [
  "INSERT INTO testimonials (author_name, author_role, content, author_avatar_url, twitter_url, tweet_image_url, type) VALUES ('Vitalik Buterin', '@VitalikButerin', 'Solana is a great ecosystem for developers!', 'https://randomuser.me/api/portraits/men/2.jpg', 'https://twitter.com/VitalikButerin', 'https://pbs.twimg.com/media/GA-Py2AWYAAx3bF.jpg', 'twitter');",
  "INSERT INTO testimonials (author_name, author_role, content, author_avatar_url, twitter_url, type) VALUES ('SBF', '@SBF_FTX', 'Superteam is doing great things for the Solana ecosystem.', 'https://randomuser.me/api/portraits/men/3.jpg', 'https://twitter.com/SBF_FTX', 'twitter');",
  "INSERT INTO testimonials (author_name, author_role, content, author_avatar_url, type) VALUES ('Superteam', 'Official Statement', 'We are committed to building the best community for web3 developers in Malaysia.', 'https://pbs.twimg.com/profile_images/1785682346939224064/K2Qp1U1u_400x400.jpg', 'official');",
  "INSERT INTO testimonials (author_name, author_role, content, author_avatar_url, type) VALUES ('DiscordUser1', 'discord.gg/superteam', 'The Superteam community is so helpful and welcoming!', 'https://randomuser.me/api/portraits/women/4.jpg', 'discord');",
  "INSERT INTO testimonials (author_name, author_role, content, author_avatar_url, type) VALUES ('DiscordUser2', 'discord.gg/superteam', 'I learned so much from the workshops and events.', 'https://randomuser.me/api/portraits/men/5.jpg', 'discord');",
  "INSERT INTO testimonials (author_name, author_role, content, author_avatar_url, type) VALUES ('DiscordUser3', 'discord.gg/superteam', 'The bounties are a great way to earn and learn.', 'https://randomuser.me/api/portraits/women/6.jpg', 'discord');",
  "INSERT INTO testimonials (author_name, author_role, content, author_avatar_url, type) VALUES ('DiscordUser4', 'discord.gg/superteam', 'I met so many great people in the Superteam community.', 'https://randomuser.me/api/portraits/men/7.jpg', 'discord');",
  "INSERT INTO testimonials (author_name, author_role, content, author_avatar_url, type) VALUES ('DiscordUser5', 'discord.gg/superteam', 'Superteam is the best place to be for web3 developers in Malaysia.', 'https://randomuser.me/api/portraits/women/8.jpg', 'discord');",
];

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleSeed = async () => {
    setLoading(true);
    setLogs([]);
    setError(null);

    for (const command of sqlCommands) {
      const { error } = await supabase.rpc('execute_sql', { sql: command });
      if (error) {
        const errorMessage = `Error executing command: ${command.substring(0, 40)}... - ${error.message}`;
        setError(errorMessage);
        setLogs(prev => [...prev, errorMessage]);
        setLoading(false);
        return;
      }
      const successMessage = `Successfully executed: ${command.substring(0, 40)}...`;
      setLogs(prev => [...prev, successMessage]);
    }

    setLoading(false);
    setLogs(prev => [...prev, "Database seeding completed successfully!"]);
  };

  const handleAddTestimonials = async () => {
    setLoading(true);
    setLogs([]);
    setError(null);

    for (const command of testimonialCommands) {
      const { error } = await supabase.rpc('execute_sql', { sql: command });
      if (error) {
        const errorMessage = `Error executing command: ${command.substring(0, 40)}... - ${error.message}`;
        setError(errorMessage);
        setLogs(prev => [...prev, errorMessage]);
        setLoading(false);
        return;
      }
      const successMessage = `Successfully executed: ${command.substring(0, 40)}...`;
      setLogs(prev => [...prev, successMessage]);
    }

    setLoading(false);
    setLogs(prev => [...prev, "Testimonials added successfully!"]);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-4">Database Seed</h1>
        <p className="text-muted-foreground text-center mb-8">
          This will wipe and re-populate the database with initial schema and data.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={handleSeed} disabled={loading} className="w-full max-w-xs mx-auto flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Seed Database"}
          </Button>
          <Button onClick={handleAddTestimonials} disabled={loading} className="w-full max-w-xs mx-auto flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Testimonials"}
          </Button>
        </div>

        {(logs.length > 0 || error) && (
          <Alert className="mt-8 bg-black border-white/10 text-white">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Seeding Log</AlertTitle>
            <AlertDescription className="font-mono text-xs mt-2 space-y-2">
              {logs.map((log, i) => (
                <p key={i} className={log.startsWith('Error') ? 'text-red-500' : 'text-green-500'}>{log}</p>
              ))}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
