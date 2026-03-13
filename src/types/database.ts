export interface Member {
  id: string;
  name: string;
  role: string;
  company: string;
  skills: string[];
  bio: string | null;
  avatar_url: string | null;
  twitter_url: string | null;
  featured: boolean;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  event_date: string;
  luma_url: string | null;
  image_url: string | null;
  status: 'upcoming' | 'past';
  featured: boolean;
  category: string | null;
  created_at: string;
}

export interface Partner {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  long_description: string | null;
  case_study: string | null;
  featured: boolean;
  created_at: string;
}

export interface Stat {
  id: string;
  label: string;
  value: string;
  order_index: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar_url: string | null;
  twitter_url: string | null;
  tweet_image_url: string | null;
  type: 'twitter' | 'discord' | 'official';
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  published_at: string;
  created_at: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  faq_id: string | null;
  order_index: number;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}