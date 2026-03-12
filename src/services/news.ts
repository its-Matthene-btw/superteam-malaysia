
import { createClient } from '@/lib/supabase/client';
import { NewsPost } from '@/types/database';

const supabase = createClient();

export async function getNews() {
  const { data, error } = await supabase.from('news').select('*').order('published_at', { ascending: false });
  if (error) throw error;
  return data as NewsPost[];
}

export async function getPostBySlug(slug: string) {
  const { data, error } = await supabase.from('news').select('*').eq('slug', slug).single();
  if (error) throw error;
  return data as NewsPost;
}

export async function createPost(post: Partial<NewsPost>) {
  const { data, error } = await supabase.from('news').insert([post]).select();
  if (error) throw error;
  return data[0];
}

export async function updatePost(id: string, post: Partial<NewsPost>) {
  const { data, error } = await supabase.from('news').update(post).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

export async function deletePost(id: string) {
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) throw error;
}
