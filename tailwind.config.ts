import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';
import daisyuiTypo from '@tailwindcss/typography';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  },
  plugins: [daisyuiTypo, daisyui],
} satisfies Config;
