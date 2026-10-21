import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/manrope';
import '@fontsource/instrument-serif';
import '@fontsource/instrument-serif/400-italic.css';
import './globals.css';
import { project } from '@/content/project';
import { site } from '@/content/site';
import { Analytics } from '@/components/Analytics';
import { LeadDrawerProvider } from '@/components/forms/LeadDrawerContext';
import { LeadDrawer } from '@/components/forms/LeadDrawer';
import { Intro } from '@/components/Intro';

const title = `${project.name} — ${project.tagline} | ${project.descriptor}, ${project.address}`;
const description = `Godrej Sora, Sector 53 Gurugram: ${project.headline.totalResidences.value} Japanese-inspired ultra-luxury ${project.headline.configurations.value} residences steps from Golf Course Road. Approx. 50-ft balconies, private lift lobbies, Shiki Clubhouse. RERA ${project.rera.number}.`;

export const metadata: Metadata = {
  metadataBase: site.url ? new URL(site.url) : undefined,
  title, description,
  openGraph: { title, description, type: 'website', locale: 'en_IN', siteName: project.name },
  twitter: { card: 'summary_large_image', title, description },
  robots: { index: true, follow: true },
  alternates: site.url ? { canonical: '/' } : undefined,
};
export const viewport: Viewport = { themeColor: '#f5efe5', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <Intro />
        <LeadDrawerProvider>
          {children}
          <LeadDrawer />
        </LeadDrawerProvider>
        <Analytics />
      </body>
    </html>
  );
}
