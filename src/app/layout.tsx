
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Superteam Connect Malaysia | Solana Ecosystem Hub',
  description: 'The premier community for developers, designers, and creators building on Solana in Malaysia.',
  openGraph: {
    title: 'Superteam Connect Malaysia',
    description: 'Empowering Malaysian talent to build and scale on Solana.',
    images: ['https://picsum.photos/seed/stmyog/1200/630'],
  },
};

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
        {children}
      </body>
    </html>
  );
}
