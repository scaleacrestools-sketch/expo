import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ROUTES } from './config/routes';
import Home from './pages/Home';

const ThankYou = lazy(() => import('./pages/ThankYou'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));

const PageFallback = () => <div className="min-h-[calc(100vh-5.5rem)] bg-white" />;

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path={ROUTES.home} element={<Home />} />
          <Route path={ROUTES.thankYou} element={<ThankYou />} />
          <Route path={ROUTES.privacyPolicy} element={<PrivacyPolicy />} />
          <Route path={ROUTES.disclaimer} element={<Disclaimer />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
