
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
    // 1. Seed Stats
    if (hardcodedStats.length > 0) {
      const { error: sErr } = await supabase.from('stats').upsert(
        hardcodedStats.map((s, i) => ({
          label: s.label,
          value: s.value,
          order_index: i
        }))
      );
      if (sErr) results.errors.push(`Stats: ${sErr.message}`);
      else results.stats = hardcodedStats.length;
    }

    // 2. Seed Members
    if (hardcodedMembers.length > 0) {
      const { error: mErr } = await supabase.from('members').upsert(
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
      if (mErr) results.errors.push(`Members: ${mErr.message}`);
      else results.members = hardcodedMembers.length;
    }

    // 3. Seed Events
    if (hardcodedEvents.length > 0) {
      const { error: eErr } = await supabase.from('events').upsert(
        hardcodedEvents.map(e => ({
          title: e.title,
          description: e.description,
          location: e.location,
          event_date: new Date().toISOString(), // Default to now for seed
          luma_url: e.lumaUrl,
          status: 'upcoming',
          featured: true
        }))
      );
      if (eErr) results.errors.push(`Events: ${eErr.message}`);
      else results.events = hardcodedEvents.length;
    }

    // 4. Seed Partners
    if (hardcodedPartners.length > 0) {
      const { error: pErr } = await supabase.from('partners').upsert(
        hardcodedPartners.map(p => ({
          name: p.name,
          logo_url: p.logo,
          featured: true
        }))
      );
      if (pErr) results.errors.push(`Partners: ${pErr.message}`);
      else results.partners = hardcodedPartners.length;
    }

    // 5. Seed Testimonials (using a few hardcoded examples)
    const testimonials = [
      { name: 'Solana Dev', role: 'Builder', content: 'Building on Solana in Malaysia has never been easier thanks to Superteam.', type: 'official' },
      { name: 'Anatoly Yakovenko', role: 'Solana Founder', content: 'Superteam is the standard for ecosystem growth.', type: 'twitter' }
    ];
    const { error: tErr } = await supabase.from('testimonials').upsert(testimonials);
    if (tErr) results.errors.push(`Testimonials: ${tErr.message}`);
    else results.testimonials = testimonials.length;

  } catch (err: any) {
    results.errors.push(`Critical: ${err.message}`);
  }

  return results;
}
