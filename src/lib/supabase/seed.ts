
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
    const { error: statsErr } = await supabase.from('stats').insert(hardcodedStats.map((s, i) => ({ label: s.label, value: s.value, order_index: i })));
    if (statsErr) results.errors.push(`Stats: ${statsErr.message}`);
    else results.stats = hardcodedStats.length;

    // 2. Seed Members
    const { error: memErr } = await supabase.from('members').insert(hardcodedMembers.map(m => ({
      name: m.name, 
      role: m.track, 
      company: m.company, 
      skills: m.skills, 
      bio: m.description, 
      avatar_url: m.image, 
      featured: true, 
      twitter_url: m.social.twitter 
    })));
    if (memErr) results.errors.push(`Members: ${memErr.message}`);
    else results.members = hardcodedMembers.length;

    // 3. Seed Partners
    const partnerData = hardcodedPartners.map(p => ({
      name: p.name,
      slug: p.name.toLowerCase().replace(/ /g, '-'),
      logo_url: p.logo,
      description: `Leading ecosystem project building on Solana in Malaysia.`,
      long_description: `Full technical analysis of the project's impact and architecture on the high-performance Solana blockchain. This project is at the forefront of the Web3 revolution in Southeast Asia.`,
      case_study: `Successfully scaled user base by 300% within the first 6 months of the 2026 cycle by leveraging Solana's high-speed infrastructure.`,
      featured: true,
      website_url: 'https://solana.com'
    }));
    const { error: partErr } = await supabase.from('partners').insert(partnerData);
    if (partErr) results.errors.push(`Partners: ${partErr.message}`);
    else results.partners = partnerData.length;

    // 4. Seed Events
    const sampleEvents = [
      { 
        title: 'Solana Hacker House KL 2026', 
        description: 'The world-famous Solana Hacker House returns to Malaysia for 3 days of high-intensity building, workshops, and high-stakes networking.', 
        location: 'Kuala Lumpur Convention Centre', 
        event_date: '2026-10-12T09:00:00Z', 
        luma_url: 'https://lu.ma/superteammy', 
        status: 'upcoming', 
        featured: true 
      },
      { 
        title: 'Web3 Founders Breakfast', 
        description: 'An exclusive gathering for protocol founders and VCs to discuss the future of RWA and AI integration within the Solana ecosystem.', 
        location: 'Bangsar South, KL', 
        event_date: '2026-11-05T08:30:00Z', 
        luma_url: 'https://lu.ma/superteammy', 
        status: 'upcoming', 
        featured: false 
      },
      { 
        title: 'Solana Build Station KL', 
        description: 'Weekly co-working and mentorship sessions for developers shipping production-ready smart contracts.', 
        location: 'Virtual / Discord', 
        event_date: '2026-09-20T14:00:00Z', 
        luma_url: 'https://lu.ma/superteammy', 
        status: 'past', 
        featured: false 
      },
      { 
        title: 'OPOS Summit 2025', 
        description: 'The premier conference for Solana builders in the APAC region, focusing on Only Possible On Solana applications.', 
        location: 'Cyberjaya, Malaysia', 
        event_date: '2025-12-15T10:00:00Z', 
        luma_url: 'https://lu.ma/superteammy', 
        status: 'past', 
        featured: true 
      },
    ];
    const { error: evtErr } = await supabase.from('events').insert(sampleEvents);
    if (evtErr) results.errors.push(`Events: ${evtErr.message}`);
    else results.events = sampleEvents.length;

    // 5. Seed Testimonials
    const sampleTestimonials = [
      { 
        name: 'Aiman Rahman', 
        role: 'Solana Developer', 
        content: 'Superteam Malaysia is the reason I shifted from Web2 to Web3. The mentorship and support I received during the Hacker House completely changed my career path. The alpha sits in our chats.', 
        avatar_url: 'https://picsum.photos/seed/aim/200/200', 
        type: 'official' 
      },
      { 
        name: 'Sarah Chen', 
        role: 'Product Designer', 
        content: 'I love how collaborative this community is. I was able to find a team for the hackathon in less than 24 hours on the Discord server. REAL BUILDERS. REAL STORIES.', 
        avatar_url: 'https://picsum.photos/seed/sar/200/200', 
        type: 'official' 
      },
      { 
        name: 'cryptobuilder_kl', 
        role: '@builder_kl', 
        content: 'Just finished my first bounty for @superteammy! The process was super smooth and the feedback from the reviewers was actually helpful. LFG! 🚀', 
        avatar_url: 'https://picsum.photos/seed/tw1/200/200', 
        twitter_url: 'https://x.com', 
        type: 'twitter' 
      },
      { 
        name: 'DegenDev', 
        role: 'Protocol Lead', 
        content: 'The alpha in the Superteam Discord is crazy. If you are building on Solana in Malaysia and you are not here, you are missing out. The best ecosystem support in SEA.', 
        avatar_url: 'https://picsum.photos/seed/ds1/200/200', 
        type: 'discord' 
      },
    ];
    const { error: testErr } = await supabase.from('testimonials').insert(sampleTestimonials);
    if (testErr) results.errors.push(`Testimonials: ${testErr.message}`);
    else results.testimonials = sampleTestimonials.length;

    // 6. Seed FAQs
    const { error: faqErr } = await supabase.from('faqs').insert(hardcodedFAQs.map((f, i) => ({
      question: f.question,
      answer: f.answer,
      order_index: i
    })));
    if (faqErr) results.errors.push(`FAQs: ${faqErr.message}`);
    else results.faqs = hardcodedFAQs.length;

    // 7. Seed News
    const news = [
      { 
        title: 'Superteam Malaysia Hits 70k Builders', 
        slug: 'builders-milestone', 
        excerpt: 'Our community continues to grow at an unprecedented rate, signaling a massive shift in local developer interest.', 
        content: 'In a landmark achievement for the Malaysian Web3 ecosystem, Superteam Malaysia has officially crossed the 70,000 builder mark. This milestone is not just a number—it represents a vibrant community of developers, designers, and founders dedicated to scaling the Solana blockchain.\n\nOver the past year, we have seen a 400% increase in hackathon submissions and local project launches. From the heart of Kuala Lumpur to the digital hubs of Cyberjaya, the energy is undeniable.', 
        image_url: 'https://picsum.photos/seed/news1/1200/600', 
        published_at: new Date().toISOString() 
      },
      { 
        title: 'Announcing KL Hacker House 2026', 
        slug: 'hacker-house-2026', 
        excerpt: 'Join us for 3 days of building in the heart of KL with global mentorship and high-stakes bounties.', 
        content: 'The world-famous Solana Hacker House returns to Malaysia for 3 days of building, workshops, and high-stakes networking. This year, we are focusing on RWA and AI integration within the Solana ecosystem.\n\nParticipants will have direct access to core Solana Foundation engineers, project founders, and venture capitalists. Registration is now open.', 
        image_url: 'https://picsum.photos/seed/news2/1200/600', 
        published_at: new Date().toISOString() 
      }
    ];
    const { error: newsErr } = await supabase.from('news').insert(news);
    if (newsErr) results.errors.push(`News: ${newsErr.message}`);
    else results.news = news.length;

  } catch (err: any) {
    results.errors.push(err.message);
  }

  return results;
}
