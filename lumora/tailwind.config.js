/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Instrument Serif"', 'serif'],
      },
      keyframes: {
        'train-bob': {
          '0%, 100%': { transform: 'translateY(0) scale(1.03)' },
          '50%': { transform: 'translateY(-6px) scale(1.03)' },
        },
      },
      animation: {
        'train-bob': 'train-bob 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
