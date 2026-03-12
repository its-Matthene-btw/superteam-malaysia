
import { createClient } from './client';
import { stats as hardcodedStats, members as hardcodedMembers, partners as hardcodedPartners, faqs as hardcodedFAQs } from '../data';

const supabase = createClient();

export async function seedDatabase() {
  const results = {
    stats: 0,
    members: 0,
    events: 0,
    partners: 0,
    testimonials: 0,
    news: 0,
    faqs: 0,
    errors: [] as string[]
  };

  try {
    // 1. Seed Stats
    const { error: statsErr } = await supabase.from('stats').upsert(hardcodedStats.map((s, i) => ({ label: s.label, value: s.value, order_index: i })), { onConflict: 'label' });
    if (statsErr) results.errors.push(`Stats: ${statsErr.message}`);
    else results.stats = hardcodedStats.length;

    // 2. Seed Members
    const { error: memErr } = await supabase.from('members').upsert(hardcodedMembers.map(m => ({
      name: m.name, 
      role: m.track, 
      company: m.company, 
      skills: m.skills, 
      bio: m.description, 
      avatar_url: m.image, 
      featured: true, 
      twitter_url: m.social.twitter 
    })), { onConflict: 'name' });
    if (memErr) results.errors.push(`Members: ${memErr.message}`);
    else results.members = hardcodedMembers.length;

    // 3. Seed FAQs
    const { error: faqErr } = await supabase.from('faqs').upsert(hardcodedFAQs.map((f, i) => ({
      question: f.question,
      answer: f.answer,
      order_index: i
    })), { onConflict: 'question' });
    if (faqErr) results.errors.push(`FAQs: ${faqErr.message}`);
    else results.faqs = hardcodedFAQs.length;

    // 4. Seed News
    const news = [
      { 
        title: 'The Blueprint for Solana Malaysia', 
        slug: 'blueprint-2026', 
        excerpt: 'A comprehensive look into our 2026 roadmap, community grants, and the expansion of the KL Build Station.', 
        content: 'The heartbeat of the Solana ecosystem in Malaysia has reached a critical frequency. After twelve months of intensive community building, we are unveiling the next phase of our residency program: The KL Build Station 2.0.\n\nOur objective is to move beyond mere co-working. The new residency model provides builders with high-speed validator access, direct pipelines to the Solana Foundation grants committee, and a 24/7 technical support mesh comprised of senior Rust engineers.', 
        image_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200', 
        published_at: new Date().toISOString() 
      }
    ];
    const { error: newsErr } = await supabase.from('news').upsert(news, { onConflict: 'slug' });
    if (newsErr) results.errors.push(`News: ${newsErr.message}`);
    else results.news = news.length;

  } catch (err: any) {
    results.errors.push(err.message);
  }

  return results;
}

export async function seedEcosystemData() {
  const categories = [
    { name: 'DeFi', slug: 'defi' },
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Wallets', slug: 'wallets' },
    { name: 'NFTs & Consumer', slug: 'nfts' },
    { name: 'Dev Tools', slug: 'tools' }
  ];

  const projects = [
    { name: 'Phantom', slug: 'phantom', category: 'Wallets', short_description: 'The friendly crypto wallet for DeFi & NFTs. Safe and easy to use.', logo_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=150&q=80', featured: true },
    { name: 'Jupiter', slug: 'jupiter', category: 'DeFi', short_description: 'The best swap aggregator on Solana. Built for smart traders.', logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80', featured: true },
    { name: 'Backpack', slug: 'backpack', category: 'Wallets', short_description: 'Next-gen wallet acting as an operating system for xNFTs.', logo_url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=150&q=80', featured: true },
    { name: 'Helius', slug: 'helius', category: 'Dev Tools', short_description: 'Powerful APIs and webhooks for Solana developers to build faster.', logo_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=150&q=80' }
  ];

  const opportunities = [
    { title: 'Regional Growth Grant', description: 'Receive up to $25,000 in equity-free funding to build public goods for Malaysia.', type: 'Grant', link: 'https://earn.superteam.fun' },
    { title: 'Solana Pay Integration', description: 'Build an open-source plugin for local e-commerce. Reward: 2,000 USDC.', type: 'Bounty', link: 'https://earn.superteam.fun' }
  ];

  await supabase.from('ecosystem_categories').upsert(categories, { onConflict: 'slug' });
  await supabase.from('ecosystem_projects').upsert(projects, { onConflict: 'slug' });
  await supabase.from('ecosystem_opportunities').upsert(opportunities, { onConflict: 'title' });

  return { categories: categories.length, projects: projects.length, opportunities: opportunities.length };
}
