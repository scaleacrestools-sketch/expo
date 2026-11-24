import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useEnquiry } from '../context/useEnquiry';
import { scrollToHash } from '../lib/scroll';
import About from '../sections/About';
import Amenities from '../sections/Amenities';
import Contact from '../sections/Contact';
import Faq from '../sections/Faq';
import FloorPlans from '../sections/FloorPlans';
import Gallery from '../sections/Gallery';
import Hero from '../sections/Hero';
import Highlights from '../sections/Highlights';
import LifestyleBanner from '../sections/LifestyleBanner';
import Location from '../sections/Location';
import Overview from '../sections/Overview';
import Pricing from '../sections/Pricing';
import Rera from '../sections/Rera';
import Specifications from '../sections/Specifications';

export default function Home() {
  const { hash } = useLocation();
  const { openEnquiry } = useEnquiry();

  useEffect(() => {
    const t = window.setTimeout(() => openEnquiry('Register Your Interest'), 3000);
    return () => window.clearTimeout(t);
  }, [openEnquiry]);

  useEffect(() => {
    if (!hash) return undefined;
    const t = window.setTimeout(() => scrollToHash(hash), 150);
    return () => window.clearTimeout(t);
  }, [hash]);

  return (
    <>
      <Hero />
      <Overview />
      <Highlights />
      <LifestyleBanner />
      <Amenities />
      <Pricing />
      <FloorPlans />
      <Specifications />
      <Gallery />
      <Location />
      <About />
      <Rera />
      <Faq />
      <Contact />
    </>
  );
}
