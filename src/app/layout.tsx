
import type { Metadata } from 'next';
import './globals.css';
import { createClient } from '@/lib/supabase/server';
import LoadingScreen from '@/components/layout/LoadingScreen';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase.from('site_settings').select('*');
  
  const settings = data?.reduce((acc: Record<string, string>, item) => {
    acc[item.id] = item.value;
    return acc;
  }, {}) || {};

  const title = settings.site_title || 'Superteam Connect Malaysia | Solana Ecosystem Hub';
  const description = settings.site_description || 'The premier community for developers, designers, and creators building on Solana in Malaysia.';
  const ogImage = settings.site_og_image || 'https://picsum.photos/seed/stmyog/1200/630';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground overflow-x-hidden">
        <LoadingScreen />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
