
import { createClient } from './client';

const supabase = createClient();

const categories = [
  { name: 'DeFi' },
  { name: 'Infrastructure' },
  { name: 'Wallets' },
  { name: 'NFTs & Consumer' },
  { name: 'Dev Tools' }
];

const projects = [
  {
    name: 'Jupiter Exchange',
    slug: 'jupiter',
    category: 'DeFi',
    short_description: 'The premier liquidity aggregator for Solana. Delivering the best swap rates and decentralized perpetual trading.',
    long_description: 'Jupiter brings world-class routing algorithms to the Solana network. By aggregating liquidity from multiple decentralized exchanges (DEXs), Jupiter ensures that users always receive the most optimal price execution for their token swaps.\n\nFor the Malaysian Web3 ecosystem, Jupiter serves as the primary gateway for retail traders and institutional players alike.',
    logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    hero_image_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
    network: 'Solana Mainnet',
    token_symbol: 'JUP',
    status: 'Live & Audited',
    contract_address: 'JUPyiwrYJFskUPiHa7hkeR8VUT...',
    featured: true,
    website_url: 'https://jup.ag',
    twitter_url: 'https://x.com/JupiterExchange'
  },
  {
    name: 'Phantom',
    slug: 'phantom',
    category: 'Wallets',
    short_description: 'The friendly crypto wallet for DeFi & NFTs. Safe and easy to use.',
    long_description: 'Phantom is a non-custodial wallet that provides a seamless and secure way to interact with the Solana blockchain. It allows users to store, send, receive, and swap tokens, as well as collect and trade NFTs.',
    logo_url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=200&q=80',
    hero_image_url: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=1200&q=80',
    network: 'Multi-chain',
    status: 'Live',
    featured: true,
    website_url: 'https://phantom.app',
    twitter_url: 'https://x.com/phantom'
  },
  {
    name: 'Pyth Network',
    slug: 'pyth',
    category: 'Infrastructure',
    short_description: 'High-fidelity, real-time market data directly on-chain. Powering the DeFi ecosystem pricing logic.',
    long_description: 'Pyth Network is a specialized oracle solution for latency-sensitive financial data. It connects high-fidelity market data from top traders and exchanges directly to any smart contract on Solana.',
    logo_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&w=200&q=80',
    hero_image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    network: 'Pythnet',
    token_symbol: 'PYTH',
    status: 'Operational',
    featured: false,
    website_url: 'https://pyth.network'
  }
];

const opportunities = [
  { 
    title: 'Regional Growth Grant', 
    description: 'Receive up to $25,000 in equity-free funding to build public goods for Malaysia.', 
    type: 'Grant', 
    link: 'https://earn.superteam.fun' 
  },
  { 
    title: 'Solana Pay Integration', 
    description: 'Build an open-source plugin for local e-commerce. Reward: 2,000 USDC.', 
    type: 'Bounty', 
    link: 'https://earn.superteam.fun' 
  },
  { 
    title: 'Senior Rust Developer', 
    description: 'Join a top-tier DeFi protocol based out of Kuala Lumpur.', 
    type: 'Job', 
    link: 'https://earn.superteam.fun' 
  }
];

export async function seedEcosystemData() {
  // 1. Wipe Existing Data (Strictly Ecosystem only)
  await supabase.from('ecosystem_opportunities').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('ecosystem_features').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('ecosystem_projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('ecosystem_categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 2. Seed Fresh Data
  const { data: projData } = await supabase.from('ecosystem_projects').insert(projects).select();
  await supabase.from('ecosystem_categories').insert(categories);
  await supabase.from('ecosystem_opportunities').insert(opportunities);

  // 3. Seed features for Jupiter
  if (projData) {
    const jup = projData.find(p => p.slug === 'jupiter');
    if (jup) {
      const features = [
        { project_id: jup.id, title: 'Smart Routing', description: 'Proprietary algorithm splits trades across multiple liquidity pools.' },
        { project_id: jup.id, title: 'Limit Orders', description: 'Place decentralized limit orders that execute automatically.' },
        { project_id: jup.id, title: 'DCA', description: 'Automate your investment strategy with on-chain DCA.' },
        { project_id: jup.id, title: 'Perpetuals', description: 'Trade with up to 100x leverage on a decentralized exchange.' }
      ];
      await supabase.from('ecosystem_features').insert(features);
    }
  }

  return { 
    categories: categories.length, 
    projects: projects.length, 
    opportunities: opportunities.length 
  };
}
