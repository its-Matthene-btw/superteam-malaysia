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
    name: 'Aiman Rahman',
    title: 'Solana Dev',
    skills: ['Rust', 'Smart Contracts', 'DeFi Architecture'],
    company: 'SolFlow',
    achievements: ['Hyperdrive Hackathon Winner', 'Ecosystem Grantee'],
    social: { twitter: '#', linkedin: '#', github: '#' },
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=800&auto=format&fit=crop',
    track: 'Developer',
    description: 'Aiman has been building on Solana since 2021, leading core protocol development and mentoring junior developers in the space. His deep knowledge of Rust enables highly optimized, secure smart contract deployments.'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    title: 'UI/UX Lead',
    skills: ['Figma', 'Web3 Design', 'Brand Strategy'],
    company: 'Nexus Lab',
    achievements: ['Best Design Award - OPOS'],
    social: { twitter: '#', linkedin: '#' },
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    track: 'Designer',
    description: 'Sarah specializes in intuitive Web3 interfaces, previously designing for top-tier DeFi protocols and global NFT marketplaces. She believes good design is the key to mass crypto adoption.'
  },
  {
    id: '3',
    name: 'Daniel Lim',
    title: 'Protocol Eng',
    skills: ['Anchor Framework', 'Systems Architecture'],
    company: 'Superteam MY',
    achievements: ['Member of the Quarter'],
    social: { twitter: '#', github: '#' },
    image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=800&auto=format&fit=crop',
    track: 'Developer',
    description: 'Daniel is a master of the Anchor framework, ensuring our smart contracts are robust, scalable, and highly optimized. His rigorous testing protocols keep our TVL safe.'
  },
  {
    id: '4',
    name: 'Farah Zain',
    title: 'Community',
    skills: ['Event Marketing', 'Ecosystem Strategy'],
    company: 'Superteam MY',
    achievements: ['Hacker House Lead'],
    social: { twitter: '#' },
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
    track: 'Growth',
    description: 'Farah orchestrates our ecosystem events, bridging the gap between developers, founders, and the broader community. She has successfully launched over 20 global hacker houses.'
  },
  {
    id: '5',
    name: 'Ahmad Faiz',
    title: 'Founder',
    skills: ['Product Direction', 'Strategic Growth'],
    company: 'Superteam MY',
    achievements: ['Ecosystem Architect'],
    social: { twitter: '#' },
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    track: 'Growth',
    description: 'Ahmad steers the strategic vision, leveraging years of traditional tech experience to scale our Web3 initiatives globally and secure top-tier ecosystem partnerships.'
  },
  {
    id: '6',
    name: 'Chloe Wong',
    title: 'Marketing',
    skills: ['Copywriting', 'Content Creation'],
    company: 'Superteam MY',
    achievements: ['Content Lead'],
    social: { twitter: '#' },
    image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=800&auto=format&fit=crop',
    track: 'Writer',
    description: 'Chloe crafts compelling narratives that translate complex technical concepts into accessible, engaging ecosystem content for our global audience.'
  },
  {
    id: '7',
    name: 'Jason Lee',
    title: 'Security',
    skills: ['Smart Contract Audits', 'Cryptography'],
    company: 'Superteam MY',
    achievements: ['Security Auditor'],
    social: { twitter: '#' },
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    track: 'Developer',
    description: 'Jason rigorously audits our infrastructure, bringing top-level cryptographic security to every deployment and protocol update. He ensures zero vulnerabilities.'
  },
  {
    id: '8',
    name: 'Siti Aminah',
    title: 'Dev Rel',
    skills: ['Documentation', 'Developer Experience'],
    company: 'Superteam MY',
    achievements: ['DevEx Specialist'],
    social: { twitter: '#' },
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    track: 'Developer',
    description: 'Siti ensures external developers have seamless onboarding experiences through crystal-clear documentation, SDK tooling, and community support channels.'
  },
  {
    id: '9',
    name: 'Raj Patel',
    title: 'Tokenomics',
    skills: ['Economic Modeling', 'Game Theory'],
    company: 'Superteam MY',
    achievements: ['Economics Lead'],
    social: { twitter: '#' },
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    track: 'Growth',
    description: 'Raj designs sustainable token models and complex incentive structures that drive long-term ecosystem participation and liquidity retention.'
  },
  {
    id: '10',
    name: 'Wei Shen',
    title: 'Frontend',
    skills: ['React • Next.js', 'Creative Coding'],
    company: 'Superteam MY',
    achievements: ['UI Specialist'],
    social: { twitter: '#' },
    image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=800&auto=format&fit=crop',
    track: 'Developer',
    description: 'Wei Shen builds lightning-fast, highly responsive frontend experiences connecting users directly to the blockchain with zero latency or friction.'
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
