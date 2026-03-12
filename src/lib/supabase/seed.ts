
import { createClient } from './client';
import { stats as hardcodedStats, members as hardcodedMembers, partners as hardcodedPartners, faqs as hardcodedFAQs } from '../data';

const supabase = createClient();

/**
 * Main System Seed: Non-destructive.
 * Seeds stats, members, FAQs, news, testimonials, events.
 */
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
