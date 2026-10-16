import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import "./themes.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Analytics } from "@/components/Analytics";
import { organizationJsonLd } from "@/lib/seo";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { PRODUCTION_HOSTS } from "@/lib/env";
import { site } from "@/content/site";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  // Pages that exist on the live site set `title: { absolute }` with their protected title.
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: ["creative agency", "digital agency", "growth agency", "branding", "web design", "performance marketing", "SEO", "video production", "Delhi", "India"],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name}® — ${site.tagline}`,
    description: site.description,
    url: site.url,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: `${site.name}® — ${site.tagline}`, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#11151A",
  width: "device-width",
  initialScale: 1,
};

/**
 * Colour-exploration boot (runs before paint, so no flash). Never active on production hosts:
 * there the approved baseline always renders and the switcher stays hidden.
 * Preview with ?theme=reddash | midnight | baseline and optional &logo=proposal.
 */
const THEME_BOOT = `(function(){try{var d=document.documentElement;if(${JSON.stringify(PRODUCTION_HOSTS)}.indexOf(location.hostname)>-1)return;d.dataset.themeLab="on";var q=new URLSearchParams(location.search),s=localStorage,t=q.get("theme"),l=q.get("logo");if(t)s.setItem("sa-theme",t);else t=s.getItem("sa-theme");if(l)s.setItem("sa-logo",l);else l=s.getItem("sa-logo");if(t==="reddash"||t==="midnight")d.dataset.theme=t;if(l==="proposal")d.dataset.logo="proposal"}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <head>
        {/* Marks JS as available so reveal animations may hide content until animated. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
        {/* Warm the connection to the showreel CDN so the first hero clip starts sooner (remove once clips are self-hosted). */}
        <link rel="preconnect" href="https://d8j0ntlcm91z4.cloudfront.net" />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-blue focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-on-accent"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <BackToTop />
        <ScrollProgress />
        <Analytics />
        <ThemeSwitcher />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      </body>
    </html>
  );
}
