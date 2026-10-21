import { project } from '@/content/project';
import { site } from '@/content/site';
import { resolveAsset } from '@/lib/assets.server';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { MobileBar } from '@/components/MobileBar';
import { Hero } from '@/components/sections/Hero';
import { Meaning } from '@/components/sections/Meaning';
import { EightRays } from '@/components/sections/EightRays';
import { Architecture } from '@/components/sections/Architecture';
import { Residences } from '@/components/sections/Residences';
import { Balcony } from '@/components/sections/Balcony';
import { Shibui } from '@/components/sections/Shibui';
import { Landscape } from '@/components/sections/Landscape';
import { ShikiClub } from '@/components/sections/ShikiClub';
import { Exclusivity } from '@/components/sections/Exclusivity';
import { Location } from '@/components/sections/Location';
import { Collection } from '@/components/sections/Collection';
import { Plans } from '@/components/sections/Plans';
import { Gallery, type GalleryItem } from '@/components/sections/Gallery';
import { Walkthrough } from '@/components/sections/Walkthrough';
import { Partners } from '@/components/sections/Partners';
import { Legacy } from '@/components/sections/Legacy';
import { SiteVisit } from '@/components/sections/SiteVisit';
import { Final } from '@/components/sections/Final';

export default function Page() {
  const a = resolveAsset;
  const logo = a('brand/godrej-sora-logo');
  const gallery: GalleryItem[] = [
    { asset: a('hero/tower-elevation'), category: 'Architecture', span: 'wide' },
    { asset: a('architecture/torii-facade'), category: 'Architecture', span: 'tall' },
    { asset: a('residences/living-dining'), category: 'Residences' },
    { asset: a('clubhouse/shiki-elevation'), category: 'Shiki Clubhouse', span: 'wide' },
    { asset: a('clubhouse/onsen-pool'), category: 'Wellness' },
    { asset: a('landscape/japanese-garden'), category: 'Landscape', span: 'wide' },
    { asset: a('residences/bedroom'), category: 'Residences' },
    { asset: a('balconies/balcony-view'), category: 'Residences', span: 'tall' },
    { asset: a('clubhouse/rooftop-pool'), category: 'Wellness' },
    { asset: a('architecture/exterior-elevation-3'), category: 'Architecture' },
    { asset: a('landscape/sunken-seating'), category: 'Landscape' },
    { asset: a('residences/kitchen'), category: 'Residences' },
    { asset: a('amenities/spa'), category: 'Wellness' },
    { asset: a('architecture/triple-height-lobby'), category: 'Architecture', span: 'wide' },
    { asset: a('gallery/lifestyle-01'), category: 'Lifestyle' },
    { asset: a('gallery/lifestyle-02'), category: 'Lifestyle' },
  ];
  const amenityImages = Object.fromEntries(project.amenities.map((x) => [x.image, a(x.image)]));
  const plans = Object.fromEntries(project.configurations.map((c) => [c.floorPlan, a(c.floorPlan)]));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ApartmentComplex',
    name: project.name,
    description: `${project.descriptor}, ${project.address}.`,
    url: site.url || undefined,
    address: { '@type': 'PostalAddress', addressLocality: 'Gurugram', addressRegion: 'Haryana', addressCountry: 'IN', streetAddress: 'Sector 53, Golf Course Road' },
    numberOfAccommodationUnits: project.headline.totalResidences.value,
    identifier: project.rera.number,
    ...(site.contact.phone ? { telephone: `+${site.contact.phone}` } : {}),
  };

  return (
    <>
      <Nav logoSrc={logo.src} />
      <main id="main">
        <Hero image={a('hero/tower-elevation')} />
        <Meaning artwork={a('brand/red-sun-blossom')} blossom={a('landscape/cherry-blossom-court')} />
        <EightRays emblem={a('brand/eight-rays-sun')} />
        <Architecture images={[a('architecture/torii-facade'), a('architecture/facade-closeup'), a('architecture/exterior-elevation-2')]} />
        <Residences images={[a('residences/living-dining'), a('residences/interior-natural-light'), a('residences/bedroom')]} />
        <Balcony image={a('balconies/fifty-foot-balcony')} />
        <Shibui images={[a('landscape/shibui-01'), a('landscape/shibui-02')]} />
        <Landscape images={[a('landscape/japanese-garden'), a('landscape/cherry-blossom-court'), a('landscape/sunken-seating')]} />
        <ShikiClub hero={a('clubhouse/shiki-elevation')} amenityImages={amenityImages} />
        <Exclusivity image={a('hero/aerial-render')} />
        <Location map={a('location/map')} />
        <Collection plans={plans} />
        <Plans items={[a('floor-plans/master-plan'), a('floor-plans/3bhk-typical'), a('floor-plans/4bhk-typical')]} />
        <Gallery items={gallery} />
        <Walkthrough poster={a(project.walkthrough.poster)} />
        <Partners />
        <Legacy logo={a('brand/godrej-properties-logo')} />
        <SiteVisit />
        <Final image={a('hero/aerial-render')} />
      </main>
      <Footer logoSrc={logo.src} />
      <MobileBar />
      <div className="h-14 lg:hidden" aria-hidden="true" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
