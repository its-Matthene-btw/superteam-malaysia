import { createClient } from '@/lib/supabase/client';
import { Testimonial } from '@/types/database';

const supabase = createClient();

export async function getTestimonials() {
  const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Testimonial[];
}

export async function createTestimonial(testimonial: Partial<Testimonial>) {
  const { data, error } = await supabase.from('testimonials').insert([testimonial]).select();
  if (error) throw error;
  return data[0];
}

export async function updateTestimonial(id: string, testimonial: Partial<Testimonial>) {
  const { data, error } = await supabase.from('testimonials').update(testimonial).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

export async function deleteTestimonial(id: string) {
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw error;
}
