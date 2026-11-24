import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ROUTES } from './config/routes';
import Disclaimer from './pages/Disclaimer';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ThankYou from './pages/ThankYou';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTES.home} element={<Home />} />
        <Route path={ROUTES.thankYou} element={<ThankYou />} />
        <Route path={ROUTES.privacyPolicy} element={<PrivacyPolicy />} />
        <Route path={ROUTES.disclaimer} element={<Disclaimer />} />
      </Route>
    </Routes>
  );
}
