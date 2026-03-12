
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
      category: 'General',
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
      },
      {
        title: 'Backpack: The xNFT Revolution',
        slug: 'backpack-xnft',
        excerpt: 'Backpack is not just a wallet; it is an operating system for Web3. Discover how xNFTs allow developers to build native applications directly within the wallet interface.',
        content: 'The launch of Backpack represents a paradigm shift in how we interact with blockchain technology. By treating the wallet as an operating system, the xNFT standard allows for native, secure, and interactive applications to run directly where your assets live.\n\nIn Malaysia, we are seeing a massive uptick in developers exploring the Backpack SDK to build localized mini-apps for payment and loyalty programs.',
        image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
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

export async function seedFAQsOnly() {
  const faqs = [
    // Grants
    { category: 'Grants & Funding', faq_id: 'G_01', question: 'What is an Ecosystem Grant?', answer: 'An ecosystem grant is equity-free funding provided to builders creating public goods, open-source infrastructure, or high-impact projects on the Solana network. In Malaysia, we prioritize projects that onboard local users or solve regional pain points.', order_index: 0 },
    { category: 'Grants & Funding', faq_id: 'G_02', question: 'How much funding can I apply for?', answer: 'Regional grants typically range from $1,000 to $25,000 USDC depending on the scope of the project and the track record of the team.', order_index: 1 },
    { category: 'Grants & Funding', faq_id: 'G_03', question: 'What is the evaluation process?', answer: '1. Initial Screen (1 week). 2. Technical Interview deep dive into architecture. 3. Committee Vote and milestone setting.', order_index: 2 },
    { category: 'Grants & Funding', faq_id: 'G_04', question: 'Can non-technical teams apply?', answer: 'Yes. We offer community grants for events, marketing initiatives, and content creation that significantly benefit the ecosystem.', order_index: 3 },
    
    // Bounties
    { category: 'Superteam Earn', faq_id: 'B_01', question: 'How do bounties work?', answer: 'Bounties are freelance, short-term tasks posted by Solana protocols. Anyone can submit work, and sponsors pay winners directly in crypto.', order_index: 4 },
    { category: 'Superteam Earn', faq_id: 'B_02', question: 'Do I need to be a developer to earn?', answer: 'No. Over 40% of our bounties are for design, writing, video editing, and community management.', order_index: 5 },
    { category: 'Superteam Earn', faq_id: 'B_03', question: 'How do I get paid?', answer: 'Payments are handled entirely on-chain via smart contracts to your Solana wallet, usually in USDC.', order_index: 6 },
    
    // Build Stations
    { category: 'Build Stations', faq_id: 'S_01', question: 'What is a Build Station?', answer: 'A physical co-working popup designed for builders during hackathons. We provide free workspace, food, and direct access to mentors.', order_index: 7 },
    { category: 'Build Stations', faq_id: 'S_02', question: 'Is it free to attend?', answer: 'Yes. Access is entirely free for approved participants. You must submit a brief application to secure a desk.', order_index: 8 },
    { category: 'Build Stations', faq_id: 'S_03', question: 'Where are the stations located?', answer: 'Our primary node is in Kuala Lumpur, but we frequently run satellite stations in Penang and Johor during major hackathons.', order_index: 9 },
    
    // General
    { category: 'General Ops', faq_id: 'O_01', question: 'How do I become a Superteam Member?', answer: 'Membership is earned. The standard path is to first become a Contributor by participating in bounties and attending events.', order_index: 10 },
    { category: 'General Ops', faq_id: 'O_02', question: 'Can Superteam sponsor my university event?', answer: 'Yes, we actively support university blockchain clubs with speakers, workshop materials, and budgets.', order_index: 11 },
  ];

  await supabase.from('faqs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error } = await supabase.from('faqs').insert(faqs);
  if (error) throw error;
  return faqs.length;
}
