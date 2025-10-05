import type { Config } from 'tailwindcss';
import lineClamp from '@tailwindcss/line-clamp';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'shop-light-pink': '#fcf0e4',
        'shop-dark-green': '#063c28',
        'shop-btn-dark-green': '#063D29',
        'shop-light-bg': '#f6f6f6',
        'shop-orange': '#fb6c08',
        'dark-color': '#151515',
        'light-color': '#52525b',
        'shop-light-green': '#3b9c3c',
        'shop-lighter-green': '#93D991',
        'dark-blue': '#6c7fd6',
        'shop-lighter-bg': '#f1f3f6',
        'shop-light-text': '#686e7d',
        'deal-bg': '#f1f3f8',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
      },
    },
  },
  plugins: [lineClamp],
};

export default config;
