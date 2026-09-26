import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Fraunces } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  style: ['normal', 'italic'],
  display: 'swap',
});

const siteUrl = 'https://turex.travel';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Turex — Discover the Soul of Incredible India',
  description:
    'Experience breathtaking destinations, unforgettable adventures, vibrant culture, and curated journeys across India — designed for modern explorers.',
  keywords: [
    'India tourism',
    'India travel packages',
    'Kerala backwaters',
    'Ladakh',
    'Jaipur',
    'Taj Mahal tours',
    'luxury travel India',
  ],
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Turex',
    title: 'Turex — Discover the Soul of Incredible India',
    description:
      'Curated journeys across India for modern explorers. Breathtaking destinations, vibrant culture, unforgettable adventures.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&h=630&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'The Taj Mahal at sunrise, Agra, India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Turex — Discover the Soul of Incredible India',
    description:
      'Curated journeys across India for modern explorers. Breathtaking destinations, vibrant culture, unforgettable adventures.',
    images: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&h=630&fit=crop&q=80',
    ],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'Turex',
  url: siteUrl,
  description:
    'Premium India tourism brand offering curated journeys, tours, and travel experiences across India.',
  areaServed: { '@type': 'Country', name: 'India' },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '12480',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${fraunces.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
