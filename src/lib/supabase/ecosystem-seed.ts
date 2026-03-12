
import { createClient } from './client';

const supabase = createClient();

const categories = [
  { name: 'DeFi' },
  { name: 'Infrastructure' },
  { name: 'Wallets' },
  { name: 'NFTs' },
  { name: 'Dev Tools' },
  { name: 'Consumer' },
];

const projects = [
  {
    name: 'Phantom',
    slug: 'phantom',
    category: 'Wallets',
    short_description: 'The friendly crypto wallet for DeFi & NFTs. Safe and easy to use.',
    long_description: 'Phantom is a non-custodial wallet that provides a seamless and secure way to interact with the Solana blockchain. It allows users to store, send, receive, and swap tokens, as well as collect and trade NFTs.',
    logo_url: 'https://assets.coingecko.com/coins/images/29651/large/phantom.jpeg',
    hero_image_url: 'https://pro.splash.com/hubfs/integrations/phantom/phantom-pro-splash-integration-hero.png',
    website_url: 'https://phantom.app/',
    docs_url: 'https://docs.phantom.app/',
    twitter_url: 'https://twitter.com/phantom',
    discord_url: 'https://discord.com/invite/phantom',
    github_url: 'https://github.com/phantom',
    status: 'Live',
    featured: true,
  },
  {
    name: 'Jupiter',
    slug: 'jupiter',
    category: 'DeFi',
    short_description: 'The best swap aggregator on Solana. Built for smart traders.',
    long_description: 'Jupiter is a liquidity aggregator that provides the best swap rates on Solana by routing trades across multiple decentralized exchanges. It offers a suite of tools for traders, including limit orders, DCA, and perpetuals.',
    logo_url: 'https://pbs.twimg.com/profile_images/1752729938198544384/tG-8B53O_400x400.jpg',
    hero_image_url: 'https://www.jupresear.ch/img/jupiter-gradient.png',
    website_url: 'https://jup.ag/',
    docs_url: 'https://docs.jup.ag/',
    twitter_url: 'https://twitter.com/JupiterExchange',
    discord_url: 'https://discord.com/invite/jup',
    github_url: 'https://github.com/jup-ag',
    status: 'Live',
    featured: true,
  },
  {
    name: 'Pyth',
    slug: 'pyth',
    category: 'Infrastructure',
    short_description: 'Real-time market data for smart contracts. High fidelity oracles.',
    long_description: 'The Pyth Network is a decentralized oracle that provides real-time financial market data to smart contracts on multiple blockchains. It aims to deliver high-fidelity, tamper-resistant data to power a new generation of DeFi applications.',
    logo_url: 'https://pbs.twimg.com/profile_images/1722658869970120704/22o9_aW2_400x400.jpg',
    hero_image_url: 'https://pyth.network/og-image.png',
    website_url: 'https://pyth.network/',
    docs_url: 'https://docs.pyth.network/',
    twitter_url: 'https://twitter.com/PythNetwork',
    discord_url: 'https://discord.com/invite/pyth-network',
    github_url: 'https://github.com/pyth-network',
    status: 'Live',
    featured: false,
  },
  {
    name: 'Helius',
    slug: 'helius',
    category: 'Dev Tools',
    short_description: 'Powerful APIs and webhooks for Solana developers to build faster.',
    long_description: 'Helius provides a suite of developer tools, including RPCs, APIs, and webhooks, that make it easier for developers to build and scale applications on Solana. Their infrastructure is designed to be fast, reliable, and easy to use.',
    logo_url: 'https://pbs.twimg.com/profile_images/1691834925829988352/o1CD23Jp_400x400.jpg',
    hero_image_url: 'https://assets-global.website-files.com/641b7139f3a3a35a7751936c/64d64232a5203b90483e5a32_Helius%20-%20Dark%20Mode%20Home%20Page.png',
    website_url: 'https://www.helius.dev/',
    docs_url: 'https://docs.helius.dev/',
    twitter_url: 'https://twitter.com/heliuslabs',
    discord_url: 'https://discord.com/invite/helius',
    github_url: 'https://github.com/helius-labs',
    status: 'Live',
    featured: false,
  },
  {
    name: 'Tensor',
    slug: 'tensor',
    category: 'NFTs',
    short_description: 'Professional NFT marketplace for power users and creators.',
    long_description: 'Tensor is a high-performance NFT marketplace on Solana that offers advanced trading features, such as real-time data, customizable charts, and automated trading bots. It is designed for professional traders and serious collectors.',
    logo_url: 'https://pbs.twimg.com/profile_images/1776008705096531969/8KTM4D0B_400x400.jpg',
    hero_image_url: 'https://i.ytimg.com/vi/a4-n6wI_2gU/maxresdefault.jpg',
    website_url: 'https://www.tensor.trade/',
    docs_url: 'https://docs.tensor.trade/',
    twitter_url: 'https://twitter.com/tensor_trade',
    discord_url: 'https://discord.com/invite/tensor',
    github_url: 'https://github.com/tensor-hq',
    status: 'Live',
    featured: false,
  },
  {
    name: 'Backpack',
    slug: 'backpack',
    category: 'Wallets',
    short_description: 'Next-gen wallet acting as an operating system for xNFTs.',
    long_description: 'Backpack is a wallet and operating system for xNFTs, which are a new type of non-fungible token that can contain executable code. This allows developers to create rich, interactive applications that live directly in the wallet.',
    logo_url: 'https://pbs.twimg.com/profile_images/1765038031548657664/x2b_nS2g_400x400.jpg',
    hero_image_url: 'https://miro.medium.com/v2/resize:fit:1400/1*d-B1I2h_4gA8gYQ8o8ZzZw.png',
    website_url: 'https://www.backpack.app/',
    docs_url: 'https://docs.backpack.app/',
    twitter_url: 'https://twitter.com/Backpack',
    discord_url: 'https://discord.com/invite/backpack',
    github_url: 'https://github.com/coral-xyz',
    status: 'Live',
    featured: true,
  },
  {
    name: 'Solscan',
    slug: 'solscan',
    category: 'Dev Tools',
    short_description: 'The user-friendly block explorer and analytics platform for Solana.',
    long_description: 'Solscan is a popular block explorer and analytics platform for the Solana blockchain. It provides users with a comprehensive view of transactions, accounts, tokens, and other on-chain data.',
    logo_url: 'https://solscan.io/static/media/solana-sol-logo.550f5a35.svg',
    hero_image_url: 'https://repository-images.githubusercontent.com/431818239/65c829f7-6e6a-464a-a9a3-55276365f57a',
    website_url: 'https://solscan.io/',
    docs_url: 'https://docs.solscan.io/',
    twitter_url: 'https://twitter.com/solscanofficial',
    discord_url: '',
    github_url: '',
    status: 'Live',
    featured: false,
  },
  {
    name: 'Drift',
    slug: 'drift',
    category: 'DeFi',
    short_description: 'Decentralized perpetual exchange with cross-margin trading.',
    long_description: 'Drift is a decentralized exchange for trading perpetual swaps on Solana. It offers a high-performance trading experience with features like cross-margin, low fees, and deep liquidity.',
    logo_url: 'https://pbs.twimg.com/profile_images/1758882869595840512/mm3zSlL9_400x400.jpg',
    hero_image_url: 'https://drift.trade/images/og-image.png',
    website_url: 'https://www.drift.trade/',
    docs_url: 'https://docs.drift.trade/',
    twitter_url: 'https://twitter.com/DriftProtocol',
    discord_url: 'https://discord.com/invite/driftprotocol',
    github_url: 'https://github.com/drift-labs',
    status: 'Live',
    featured: false,
  },
];

const features = [
  {
    project_slug: 'jupiter',
    title: 'Smart Routing',
    description: 'Proprietary algorithm splits trades across multiple liquidity pools to guarantee the best possible price execution.',
  },
  {
    project_slug: 'jupiter',
    title: 'Limit Orders',
    description: 'Place decentralized limit orders that execute automatically when target prices are reached without locking funds.',
  },
  {
    project_slug: 'jupiter',
    title: 'DCA (Dollar Cost Averaging)',
    description: 'Automate your investment strategy with on-chain DCA to accumulate tokens over time with zero manual intervention.',
  },
  {
    project_slug: 'jupiter',
    title: 'Perpetuals',
    description: 'Trade with up to 100x leverage on a decentralized, oracle-powered perpetuals exchange with zero price impact.',
  },
];

const opportunities = [
  {
    title: 'Regional Growth Grant',
    description: 'Receive up to $25,000 in equity-free funding to build public goods or infrastructure for the Malaysian market.',
    type: 'Grant',
    link: '#',
  },
  {
    title: 'Solana Pay Integration Bounty',
    description: 'Build an open-source plugin integrating Solana Pay with local e-commerce platforms. Reward: 2,000 USDC.',
    type: 'Bounty',
    link: '#',
  },
  {
    title: 'Senior Rust Developer',
    description: 'Join a top-tier DeFi protocol based out of Kuala Lumpur. Experience with Anchor framework required.',
    type: 'Job',
    link: '#',
  },
];

export async function seedEcosystemData() {
  const results = {
    categories: 0,
    projects: 0,
    features: 0,
    opportunities: 0,
    errors: [] as string[],
  };

  // Clear existing data
  const { error: deleteOpportunitiesError } = await supabase.from('ecosystem_opportunities').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteOpportunitiesError) results.errors.push(`Opportunities: ${deleteOpportunitiesError.message}`);
  const { error: deleteFeaturesError } = await supabase.from('ecosystem_features').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteFeaturesError) results.errors.push(`Features: ${deleteFeaturesError.message}`);
  const { error: deleteProjectsError } = await supabase.from('ecosystem_projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteProjectsError) results.errors.push(`Projects: ${deleteProjectsError.message}`);
  const { error: deleteCategoriesError } = await supabase.from('ecosystem_categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteCategoriesError) results.errors.push(`Categories: ${deleteCategoriesError.message}`);

  // Seed categories
  const { data: seededCategories, error: categoriesError } = await supabase.from('ecosystem_categories').insert(categories).select();
  if (categoriesError) results.errors.push(`Categories: ${categoriesError.message}`);
  else results.categories = seededCategories?.length || 0;

  // Seed projects
  const { data: seededProjects, error: projectsError } = await supabase.from('ecosystem_projects').insert(projects).select();
  if (projectsError) results.errors.push(`Projects: ${projectsError.message}`);
  else results.projects = seededProjects?.length || 0;

  // Seed features
  if (seededProjects) {
    const projectFeatures = features.map(feature => {
      const project = seededProjects.find(p => p.slug === feature.project_slug);
      if (!project) return null;
      return {
        project_id: project.id,
        title: feature.title,
        description: feature.description,
      };
    }).filter(Boolean);
    
    if (projectFeatures.length > 0) {
        const { data: seededFeatures, error: featuresError } = await supabase.from('ecosystem_features').insert(projectFeatures).select();
        if (featuresError) results.errors.push(`Features: ${featuresError.message}`);
        else results.features = seededFeatures?.length || 0;
    }
  }

  // Seed opportunities
  const { data: seededOpportunities, error: opportunitiesError } = await supabase.from('ecosystem_opportunities').insert(opportunities).select();
  if (opportunitiesError) results.errors.push(`Opportunities: ${opportunitiesError.message}`);
  else results.opportunities = seededOpportunities?.length || 0;

  return results;
}

