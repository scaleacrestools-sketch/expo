import { Instagram, Twitter, Youtube } from 'lucide-react';

const columns = [
  {
    title: 'Destinations',
    links: ['Rajasthan', 'Kerala', 'Ladakh', 'Goa', 'Varanasi', 'Northeast India'],
  },
  {
    title: 'Journeys',
    links: ['The Golden Triangle', 'Himalayan Horizons', 'Kerala, Slowly', 'Custom Journeys'],
  },
  {
    title: 'Company',
    links: ['About Turex', 'Our Hosts', 'Careers', 'Press', 'Contact'],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div className="max-w-sm">
            <a href="#" className="text-2xl font-bold tracking-tight">
              Tu<span className="accent-serif text-violet-bright">rex</span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Curated journeys across India for modern explorers. Fewer stops, deeper stays, real
              people.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { icon: Instagram, label: 'Turex on Instagram' },
                { icon: Twitter, label: 'Turex on Twitter' },
                { icon: Youtube, label: 'Turex on YouTube' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:border-violet-bright hover:bg-violet-core hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-white/70 transition-colors duration-300 hover:text-white"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Turex Travel Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-white">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Terms
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Sustainability
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
