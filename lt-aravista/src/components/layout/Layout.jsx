import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import EnquiryProvider from '../../context/EnquiryProvider';
import { captureTrackingParams, sendClickTracking } from '../../lib/leads';
import { scrollToTop } from '../../lib/scroll';
import { MobileActionBar, SiteVisitTab, WhatsAppFloat } from './FloatingActions';
import Footer from './Footer';
import Header from './Header';

function useTrackingCapture() {
  const { search, hash } = useLocation();
  useEffect(() => {
    captureTrackingParams(search, hash);
    sendClickTracking();
  }, [search, hash]);
}

export default function Layout() {
  const { pathname, hash } = useLocation();
  useTrackingCapture();
  useEffect(() => {
    if (!(pathname === ROUTES.home && hash)) scrollToTop('smooth');
  }, [pathname, hash]);
  return (
    <EnquiryProvider>
      <Header />
      <main className="pb-14 md:pb-0">
        <Outlet />
      </main>
      {pathname === ROUTES.home && <Footer />}
      <WhatsAppFloat />
      <MobileActionBar />
      <SiteVisitTab />
    </EnquiryProvider>
  );
}
