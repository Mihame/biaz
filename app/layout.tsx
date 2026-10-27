import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BIAZ Shoes - Souliers en Cuir pour Homme au Maroc',
  description: "Boutique en ligne de souliers en cuir haut de gamme pour hommes au Maroc. Richelieus, Derbies et Mocassins d'exception. Contact et commande via WhatsApp.",
  icons: {
    icon: '/assets/aistudio/favicon_147b139c.png',
    apple: '/assets/aistudio/favicon_147b139c.png',
  },
  openGraph: {
    title: 'BIAZ Shoes - Souliers en Cuir pour Homme au Maroc',
    description: "Boutique en ligne de souliers en cuir haut de gamme pour hommes au Maroc. Richelieus, Derbies et Mocassins d'exception. Contact et commande via WhatsApp.",
    type: 'website',
    locale: 'fr_MA',
    alternateLocale: 'ar_MA',
    images: ['/assets/aistudio/favicon_147b139c.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BIAZ Shoes - Souliers en Cuir pour Homme au Maroc',
    description: "Boutique en ligne de souliers en cuir haut de gamme pour hommes au Maroc. Richelieus, Derbies et Mocassins d'exception. Contact et commande via WhatsApp.",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-[#FAF8F5] text-[#1E1A17] antialiased">
        {children}
      </body>
    </html>
  );
}
