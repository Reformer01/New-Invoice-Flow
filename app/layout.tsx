import type { Metadata } from 'next';
import { Playfair_Display, Space_Grotesk } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-serif', 
  weight: ['400', '600', '700', '900'] 
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  variable: '--font-sans', 
  weight: ['300', '400', '600', '700'] 
});

export const metadata: Metadata = {
  title: 'Art Deco / Bauhaus Invoice',
  description: 'Elegant Invoice Generation System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${playfair.variable}`}>
      <body className="font-sans min-h-screen box-border flex flex-col antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
