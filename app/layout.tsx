import './globals.css';
import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans, DM_Mono } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://threshold.digital'),
  title: 'THRESHOLD — Mathematics Made Visible',
  description:
    'An immersive digital experience exploring the construction of form from void. Watch a Platonic solid emerge from scattered light into crystalline reality.',
  keywords: ['digital art', 'generative', '3D', 'interactive', 'WebGL', 'icosahedron'],
  authors: [{ name: 'THRESHOLD' }],
  openGraph: {
    title: 'THRESHOLD — Mathematics Made Visible',
    description: 'An immersive experience exploring construction from void.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'THRESHOLD — Mathematics Made Visible',
    description: 'An immersive experience exploring construction from void.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
