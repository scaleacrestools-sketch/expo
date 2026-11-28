import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import './styles/globals.css';
import App from './App';

// ?reduced-motion=1 forces the reduced-motion experience (used for testing and media capture).
if (new URLSearchParams(window.location.search).has('reduced-motion')) document.documentElement.classList.add('reduce-motion');

const params = new URLSearchParams(window.location.search);
const renderMode = params.get('render');
const root = createRoot(document.getElementById('root')!);
if (renderMode) {
  // Media render surface (used only by scripts/render-video). Code-split so it never loads for visitors.
  const RenderApp = lazy(() => import('./render/RenderApp'));
  root.render(<Suspense fallback={null}><RenderApp mode={renderMode} /></Suspense>);
} else {
  root.render(<StrictMode><App /></StrictMode>);
}
