import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { ROUTES } from '../config/routes';

export default function LegalPage({ title, children }) {
  const navigate = useNavigate();
  return (
    <section className="min-h-[calc(100vh-5.5rem)] bg-white pt-24 pb-12 sm:pb-16 md:pb-20 lg:pt-32">
      <div className="container mx-auto px-6 md:px-10">
        <p className="font-sans text-[10px] uppercase tracking-[0.42em] text-brand sm:text-xs">Legal</p>
        <h1 className="mt-3 font-serif text-3xl font-light tracking-wide text-neutral-900 sm:text-4xl">{title}</h1>
        <div className="mt-4 h-px w-12 bg-brand" />
        <p className="mt-4 font-sans text-sm text-neutral-500">Last updated: {new Date().getFullYear()}</p>
        {children}
        <div className="mt-10">
          <Button onClick={() => navigate(ROUTES.home)}>Back to Home</Button>
        </div>
      </div>
    </section>
  );
}
