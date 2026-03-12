
import { createClient } from './client';
import { stats as hardcodedStats, members as hardcodedMembers, events as hardcodedEvents, partners as hardcodedPartners } from '../data';

const supabase = createClient();

export async function seedDatabase() {
  const results = {
    stats: 0,
    members: 0,
    events: 0,
    partners: 0,
    testimonials: 0,
    errors: [] as string[]
  };

  try {
    // 1. Wipe existing data to ensure a fresh start
    // We use .neq('id', '00000000-0000-0000-0000-000000000000') as a filter to bypass Supabase's protection against filterless deletes
    const tables = ['stats', 'members', 'events', 'partners', 'testimonials'];
    for (const table of tables) {
      const { error: delErr } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (delErr) {
        results.errors.push(`Clear ${table}: ${delErr.message}`);
      }
    }

    // 2. Seed Stats
    if (hardcodedStats.length > 0) {
      const { error: sErr } = await supabase.from('stats').insert(
        hardcodedStats.map((s, i) => ({
          label: s.label,
          value: s.value,
          order_index: i
        }))
      );
      if (sErr) results.errors.push(`Stats Insert: ${sErr.message}`);
      else results.stats = hardcodedStats.length;
    }

    // 3. Seed Members
    if (hardcodedMembers.length > 0) {
      const { error: mErr } = await supabase.from('members').insert(
        hardcodedMembers.map(m => ({
          name: m.name,
          role: m.track,
          company: m.company,
          skills: m.skills,
          bio: m.description,
          avatar_url: m.image,
          featured: true,
          twitter_url: m.social.twitter
        }))
      );
      if (mErr) results.errors.push(`Members Insert: ${mErr.message}`);
      else results.members = hardcodedMembers.length;
    }

    // 4. Seed Events
    if (hardcodedEvents.length > 0) {
      const { error: eErr } = await supabase.from('events').insert(
        hardcodedEvents.map(e => ({
          title: e.title,
          description: e.description,
          location: e.location,
          event_date: new Date().toISOString(), 
          luma_url: e.lumaUrl,
          status: 'upcoming',
          featured: true
        }))
      );
      if (eErr) results.errors.push(`Events Insert: ${eErr.message}`);
      else results.events = hardcodedEvents.length;
    }

    // 5. Seed Partners
    if (hardcodedPartners.length > 0) {
      const { error: pErr } = await supabase.from('partners').insert(
        hardcodedPartners.map(p => ({
          name: p.name,
          logo_url: p.logo,
          featured: true
        }))
      );
      if (pErr) results.errors.push(`Partners Insert: ${pErr.message}`);
      else results.partners = hardcodedPartners.length;
    }

    // 6. Seed Testimonials
    const testimonials = [
      { name: 'Aiman Rahman', role: 'Solana Developer', content: 'Superteam Malaysia is the ultimate launching pad for builders. The network effect here is real.', type: 'official' },
      { name: 'Sarah Chen', role: 'Product Designer', content: 'Being part of this community accelerated my transition into Web3 by months.', type: 'official' },
      { name: 'Anatoly Yakovenko', role: 'Solana Founder', content: 'Superteam is the gold standard for ecosystem communities.', type: 'twitter' }
    ];
    const { error: tErr } = await supabase.from('testimonials').insert(testimonials);
    if (tErr) results.errors.push(`Testimonials Insert: ${tErr.message}`);
    else results.testimonials = testimonials.length;

  } catch (err: any) {
    results.errors.push(`Critical: ${err.message}`);
  }

  return results;
}
