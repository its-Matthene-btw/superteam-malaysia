import { 
  Wrench, 
  LayoutGrid, 
  DollarSign, 
  TrendingUp, 
  Code2, 
  Globe, 
  CheckCircle2, 
  Users 
} from 'lucide-react';

export const stats = [
  { label: 'Builders', value: '70K+', icon: Wrench },
  { label: 'Projects', value: '5K+', icon: LayoutGrid },
  { label: 'Funding', value: '$650M+', icon: DollarSign },
  { label: 'Earnings', value: '$1.7M+', icon: TrendingUp },
  { label: 'Hackathon Projects', value: '150+', icon: Code2 },
  { label: 'Global Chapters', value: '20+', icon: Globe },
  { label: 'Bounties Completed', value: '500+', icon: CheckCircle2 },
  { label: 'Talent Network', value: '160K+', icon: Users },
];

export const members = [
  {
    id: '1',
    name: 'Adam Ibrahim',
    title: 'Fullstack Developer',
    skills: ['Solana', 'Rust', 'React', 'TypeScript'],
    company: 'SolFlow',
    achievements: ['Hyperdrive Hackathon Winner', 'Ecosystem Grantee'],
    social: { twitter: '#', linkedin: '#', github: '#' },
    image: 'https://picsum.photos/seed/mem1/400/400',
    track: 'Developer'
  },
  {
    id: '2',
    name: 'Sarah Tan',
    title: 'Product Designer',
    skills: ['Figma', 'UI/UX', 'Prototyping'],
    company: 'Nexus Lab',
    achievements: ['Best Design Award - OPOS'],
    social: { twitter: '#', linkedin: '#' },
    image: 'https://picsum.photos/seed/mem2/400/400',
    track: 'Designer'
  },
  {
    id: '3',
    name: 'Kevin Wong',
    title: 'Content Strategist',
    skills: ['Copywriting', 'SEO', 'Community Growth'],
    company: 'Superteam MY',
    achievements: ['Member of the Quarter'],
    social: { twitter: '#', github: '#' },
    image: 'https://picsum.photos/seed/mem3/400/400',
    track: 'Writer'
  }
];

export const events = [
  {
    id: 'e1',
    title: 'Solana Hacker House KL',
    date: 'Oct 12 — 14, 2026',
    location: 'Kuala Lumpur City Center',
    type: 'Upcoming',
    description: 'The world-famous Solana Hacker House returns to Malaysia for 3 days of building, workshops, and high-stakes networking.',
    lumaUrl: 'https://lu.ma/example1',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop',
    ctaText: 'Register'
  },
  {
    id: 'e2',
    title: 'Web3 Founders Breakfast',
    date: 'Oct 20, 2026',
    location: 'Bangsar South, KL',
    type: 'Invite Only',
    description: 'An exclusive morning gathering for founders and builders to discuss ecosystem growth and cross-border collaboration.',
    lumaUrl: 'https://lu.ma/example2',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop',
    ctaText: 'Apply'
  },
  {
    id: 'e3',
    title: 'Superteam Build Station',
    date: 'Nov 05, 2026',
    location: 'Virtual / Discord',
    type: 'Workshop',
    description: 'Deep dive into Solana development with live coding sessions and mentorship from global Superteam contributors.',
    lumaUrl: 'https://lu.ma/example3',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800&auto=format&fit=crop',
    ctaText: 'RSVP'
  }
];

export const partners = [
  { name: 'Solana Foundation', logo: 'https://picsum.photos/seed/sol/200/100' },
  { name: 'Pyth Network', logo: 'https://picsum.photos/seed/pyth/200/100' },
  { name: 'Jupiter', logo: 'https://picsum.photos/seed/jup/200/100' },
  { name: 'MDEC', logo: 'https://picsum.photos/seed/mdec/200/100' },
];

export const faqs = [
  {
    question: "How do I join Superteam Malaysia?",
    answer: "You can start by joining our Discord community and participating in our weekly community calls. From there, you can apply for membership based on your contributions."
  },
  {
    question: "What are the benefits of being a member?",
    answer: "Members get exclusive access to grants, ecosystem bounties, co-working spaces, and mentorship from industry leaders."
  }
];
