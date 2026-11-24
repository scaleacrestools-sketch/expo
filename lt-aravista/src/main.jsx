import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { captureTrackingParams } from './lib/leads';
import './index.css';

captureTrackingParams();

const container = document.getElementById('root');
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

if (window.location.pathname === '/' && container.hasChildNodes()) {
  // Home page HTML was prerendered at build time: attach to it instead of re-rendering.
  hydrateRoot(container, app);
} else {
  // Other routes (thank-you, legal pages) render fresh; drop any prerendered home markup.
  container.textContent = '';
  createRoot(container).render(app);
  document.documentElement.classList.remove('spa-route');
}
