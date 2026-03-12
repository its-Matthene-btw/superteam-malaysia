
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
    const tables = ['stats', 'members', 'events', 'partners', 'testimonials', 'news', 'faqs', 'contacts', 'newsletter_subscribers'];
    for (const table of tables) {
      await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    }

    // Seed Stats
    await supabase.from('stats').insert(hardcodedStats.map((s, i) => ({ label: s.label, value: s.value, order_index: i })));
    results.stats = hardcodedStats.length;

    // Seed Members
    await supabase.from('members').insert(hardcodedMembers.map(m => ({
      name: m.name, role: m.track, company: m.company, skills: m.skills, bio: m.description, avatar_url: m.image, featured: true, twitter_url: m.social.twitter
    })));
    results.members = hardcodedMembers.length;

    // Seed Partners
    const partnerData = hardcodedPartners.map(p => ({
      name: p.name,
      slug: p.name.toLowerCase().replace(/ /g, '-'),
      logo_url: p.logo,
      description: `Leading ecosystem project building on Solana in Malaysia.`,
      long_description: `Full technical analysis of the project's impact and architecture on the high-performance Solana blockchain.`,
      case_study: `Successfully scaled user base by 300% within the first 6 months of the 2026 cycle.`,
      featured: true,
      website_url: '#'
    }));
    await supabase.from('partners').insert(partnerData);
    results.partners = partnerData.length;

    // Seed FAQs
    await supabase.from('faqs').insert(hardcodedFAQs.map((f, i) => ({
      question: f.question,
      answer: f.answer,
      order_index: i
    })));
    results.faqs = hardcodedFAQs.length;

    // Seed News
    const news = [
      { title: 'Superteam Malaysia Hits 70k Builders', slug: 'builders-milestone', excerpt: 'Our community continues to grow at an unprecedented rate, signaling a massive shift in local developer interest.', content: 'In a landmark achievement for the Malaysian Web3 ecosystem, Superteam Malaysia has officially crossed the 70,000 builder mark. This milestone is not just a number—it represents a vibrant community of developers, designers, and founders dedicated to scaling the Solana blockchain.\n\nOver the past year, we have seen a 400% increase in hackathon submissions and local project launches. From the heart of Kuala Lumpur to the digital hubs of Cyberjaya, the energy is undeniable.', image_url: 'https://picsum.photos/seed/news1/1200/600', published_at: new Date().toISOString() },
      { title: 'Announcing KL Hacker House 2026', slug: 'hacker-house-2026', excerpt: 'Join us for 3 days of building in the heart of KL with global mentorship and high-stakes bounties.', content: 'The world-famous Solana Hacker House returns to Malaysia for 3 days of building, workshops, and high-stakes networking. This year, we are focusing on RWA and AI integration within the Solana ecosystem.\n\nParticipants will have direct access to core Solana Foundation engineers, project founders, and venture capitalists. Registration is now open.', image_url: 'https://picsum.photos/seed/news2/1200/600', published_at: new Date().toISOString() }
    ];
    await supabase.from('news').insert(news);
    results.news = news.length;

  } catch (err: any) {
    results.errors.push(err.message);
  }

  return results;
}
