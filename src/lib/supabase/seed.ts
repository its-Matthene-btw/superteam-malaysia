
import { createClient } from './client';
import { stats as hardcodedStats, members as hardcodedMembers, partners as hardcodedPartners } from '../data';

const supabase = createClient();

export async function seedDatabase() {
  const results = {
    stats: 0,
    members: 0,
    events: 0,
    partners: 0,
    testimonials: 0,
    news: 0,
    contacts: 0,
    subscribers: 0,
    errors: [] as string[]
  };

  try {
    const tables = ['stats', 'members', 'events', 'partners', 'testimonials', 'news', 'contacts', 'newsletter_subscribers'];
    for (const table of tables) {
      await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    }

    // Seed Stats
    const { error: sErr } = await supabase.from('stats').insert(hardcodedStats.map((s, i) => ({ label: s.label, value: s.value, order_index: i })));
    if (!sErr) results.stats = hardcodedStats.length;

    // Seed Members
    const { error: mErr } = await supabase.from('members').insert(hardcodedMembers.map(m => ({
      name: m.name, role: m.track, company: m.company, skills: m.skills, bio: m.description, avatar_url: m.image, featured: true, twitter_url: m.social.twitter
    })));
    if (!mErr) results.members = hardcodedMembers.length;

    // Seed Events
    const events = [
      { title: 'Solana Hacker House KL', location: 'KLCC', status: 'upcoming', event_date: '2026-10-12T09:00:00Z', featured: true },
      { title: 'DeFi Summer Meetup', location: 'Bangsar', status: 'upcoming', event_date: '2026-11-15T18:00:00Z', featured: false },
      { title: 'Rust Workshops v4', location: 'Sunway', status: 'upcoming', event_date: '2026-12-01T10:00:00Z', featured: true },
      { title: 'Web3 Breakfast', location: 'Cyberjaya', status: 'upcoming', event_date: '2026-12-20T08:30:00Z', featured: false },
      { title: 'Solana Genesis 2025', location: 'Global', status: 'past', event_date: '2025-01-01T09:00:00Z', featured: false },
      { title: 'MY NFT Week', location: 'Kuala Lumpur', status: 'past', event_date: '2025-03-10T09:00:00Z', featured: false },
      { title: 'Build Station Phase 1', location: 'Virtual', status: 'past', event_date: '2025-06-20T09:00:00Z', featured: false },
      { title: 'Solana Speedrun MY', location: 'Johor', status: 'past', event_date: '2025-09-05T09:00:00Z', featured: false }
    ];
    const { error: eErr } = await supabase.from('events').insert(events);
    if (!eErr) results.events = events.length;

    // Seed Partners
    const partnerData = hardcodedPartners.map(p => ({
      name: p.name,
      slug: p.name.toLowerCase().replace(/ /g, '-'),
      logo_url: p.logo,
      description: `A core ecosystem partner specializing in ${p.name} integration.`,
      long_description: `Leading the way in Malaysian Web3 development with high-performance infrastructure on Solana.`,
      case_study: `Successfully scaled 50+ localized dApps in the 2026 cycle.`,
      featured: true
    }));
    const { error: pErr } = await supabase.from('partners').insert(partnerData);
    if (!pErr) results.partners = partnerData.length;

    // Seed News
    const news = [
      { title: 'Superteam Malaysia Hits 70k Builders', slug: 'builders-milestone', excerpt: 'Our community continues to grow at an unprecedented rate.', content: 'Full details on our 2026 growth strategy...', image_url: 'https://picsum.photos/seed/news1/800/400', published_at: new Date().toISOString() },
      { title: 'Announcing KL Hacker House 2026', slug: 'hacker-house-2026', excerpt: 'Join us for 3 days of building in the heart of KL.', content: 'Registration is now open for the biggest event...', image_url: 'https://picsum.photos/seed/news2/800/400', published_at: new Date().toISOString() },
      { title: 'Solana DeFi Report: MY Edition', slug: 'defi-report', excerpt: 'Local volume is surging across decentralized exchanges.', content: 'An in-depth look at how Malaysians are using Jupiter...', image_url: 'https://picsum.photos/seed/news3/800/400', published_at: new Date().toISOString() }
    ];
    const { error: nErr } = await supabase.from('news').insert(news);
    if (!nErr) results.news = news.length;

    // Seed Testimonials (Tweets)
    const tweets = [
      { name: 'Anatoly Yakovenko', role: 'Solana Founder', content: 'The Superteam model is the future of ecosystem growth. Malaysia is leading the pack.', type: 'twitter', tweet_image_url: 'https://picsum.photos/seed/tweet1/600/300' },
      { name: 'Raj Gokal', role: 'Solana Co-founder', content: 'Unbelievable energy from the KL builders this week. 100% focused on shipping.', type: 'twitter', tweet_image_url: 'https://picsum.photos/seed/tweet2/600/300' }
    ];
    await supabase.from('testimonials').insert(tweets);

  } catch (err: any) {
    results.errors.push(err.message);
  }

  return results;
}
