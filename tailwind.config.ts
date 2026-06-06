import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0f0e0c',
        'bg-secondary': '#1a1815',
        'bg-card': '#221f1b',
        'gold': '#c8a96e',
        'gold-light': '#e8c98a',
        'cream': '#f0e4ce',
        'muted': '#7a6a54',
        'kaarvan-green': '#2d6a4f',
        'kaarvan-red': '#8b1a1a',
      },
      fontFamily: {
        serif: ['"Space Mono"', 'monospace'],
        sans: ['"Roboto Mono"', 'monospace'],
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'fadeIn': 'fadeIn 0.5s ease forwards',
        'scaleIn': 'scaleIn 0.3s ease forwards',
      },
    },
  },
  plugins: [],
};

export default config;
