
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

    // 5. Seed Testimonials
    const testimonials = [
      { name: 'Raj Patel', role: 'Founder, SolFlow', content: 'Superteam Malaysia provided the initial spark we needed to move from ideation to a fully functional DeFi protocol. The support mesh is unmatched.', type: 'official', created_at: new Date().toISOString() },
      { name: 'Sarah Chen', role: 'UI/UX Designer', content: 'The residency program at the KL Build Station was a game changer for my career. Building alongside the best engineers in the region is priceless.', type: 'twitter', created_at: new Date().toISOString() }
    ];
    await supabase.from('testimonials').upsert(testimonials, { onConflict: 'name' });
    results.testimonials = testimonials.length;

    // 6. Seed Events
    const events = [
      { title: 'Solana Hacker House KL', description: '3 days of building, workshops, and high-stakes networking.', location: 'Kuala Lumpur', event_date: new Date(Date.now() + 86400000 * 30).toISOString(), status: 'upcoming', featured: true },
      { title: 'Founders Breakfast', description: 'Exclusive gathering for Web3 founders.', location: 'Bangsar South', event_date: new Date(Date.now() + 86400000 * 15).toISOString(), status: 'upcoming', featured: false }
    ];
    await supabase.from('events').upsert(events, { onConflict: 'title' });
    results.events = events.length;

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
    { 
      name: 'Jupiter Exchange', 
      slug: 'jupiter', 
      category: 'DeFi', 
      short_description: 'The premier liquidity aggregator for Solana. Delivering the best swap rates and decentralized perpetual trading.', 
      long_description: 'Jupiter brings world-class routing algorithms to the Solana network. By aggregating liquidity from multiple decentralized exchanges (DEXs), Jupiter ensures that users always receive the most optimal price execution for their token swaps.\n\nFor the Malaysian Web3 ecosystem, Jupiter serves as the primary gateway for retail traders and institutional players alike.',
      logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80', 
      hero_image_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200',
      network: 'Solana Mainnet',
      token_symbol: 'JUP',
      status: 'Live & Audited',
      contract_address: 'JUPyiwrYJFskUPiHa7hkeR8VUT...',
      featured: true 
    },
    { 
      name: 'Phantom', 
      slug: 'phantom', 
      category: 'Wallets', 
      short_description: 'The friendly crypto wallet for DeFi & NFTs. Safe and easy to use.', 
      logo_url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=200&q=80',
      network: 'Solana, ETH, BTC',
      status: 'Live',
      featured: true 
    }
  ];

  const opportunities = [
    { title: 'Regional Growth Grant', description: 'Receive up to $25,000 in equity-free funding to build public goods for Malaysia.', type: 'Grant', link: 'https://earn.superteam.fun' },
    { title: 'Solana Pay Integration', description: 'Build an open-source plugin for local e-commerce. Reward: 2,000 USDC.', type: 'Bounty', link: 'https://earn.superteam.fun' }
  ];

  const { data: catData } = await supabase.from('ecosystem_categories').upsert(categories, { onConflict: 'slug' }).select();
  const { data: projData } = await supabase.from('ecosystem_projects').upsert(projects, { onConflict: 'slug' }).select();
  await supabase.from('ecosystem_opportunities').upsert(opportunities, { onConflict: 'title' });

  // Seed some features for Jupiter
  if (projData) {
    const jup = projData.find(p => p.slug === 'jupiter');
    if (jup) {
      const features = [
        { project_id: jup.id, title: 'Smart Routing', description: 'Proprietary algorithm splits trades across multiple liquidity pools.' },
        { project_id: jup.id, title: 'Limit Orders', description: 'Place decentralized limit orders that execute automatically.' }
      ];
      await supabase.from('ecosystem_features').upsert(features, { onConflict: 'title' });
    }
  }

  return { categories: categories.length, projects: projects.length, opportunities: opportunities.length };
}
