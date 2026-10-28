import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import "@/components/nd/nd.css";
import { Header } from "@/components/Header";
import { NdFooter } from "@/components/nd/NdFooter";
import { NotOnHome } from "@/components/nd/NotOnHome";
import { NdMotion } from "@/components/nd/ui";
import { Analytics } from "@/components/Analytics";
import { organizationJsonLd } from "@/lib/seo";
import { site } from "@/content/site";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
  robots: process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1" ? { index: false, follow: false } : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0D0D",
  width: "device-width",
  initialScale: 1,
};


/** The approved black footer closes every page except the homepage, which renders it in its own flow. */
function NdFooterSlot() {
  return (
    <NotOnHome>
      <div className="nd">
        <NdFooter />
      </div>
    </NotOnHome>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <head>
        {/* Marks JS as available so reveal animations may hide content until animated. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
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
        <main id="main" className="nd">{children}</main>
        <NotOnHome>
          <div className="nd">
            <NdMotion />
          </div>
        </NotOnHome>
        <NdFooterSlot />
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      </body>
    </html>
  );
}
