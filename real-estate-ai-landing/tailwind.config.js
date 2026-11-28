/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'] },
      colors: {
        brand: { DEFAULT: 'rgb(var(--brand-primary-rgb) / <alpha-value>)', 2: 'rgb(var(--brand-secondary-rgb) / <alpha-value>)', accent: 'var(--brand-accent)' },
        ink: { bg: 'var(--dark-background)', surface: 'var(--dark-surface)', raised: 'var(--dark-surface-2)', border: 'var(--dark-border)', head: 'var(--dark-heading)', text: 'var(--dark-text)', muted: 'var(--dark-muted)' },
        paper: { bg: 'var(--light-background)', alt: 'var(--light-background-secondary)', surface: 'var(--light-surface)', head: 'var(--light-heading)', text: 'var(--light-text)', border: 'var(--light-border)' },
        ok: 'var(--success)', warn: 'var(--warning)', bad: 'var(--danger)',
      },
      maxWidth: { container: '1240px' },
      borderRadius: { card: '20px' },
    },
  },
  plugins: [],
};
