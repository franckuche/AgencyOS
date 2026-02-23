import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0B0E14',
          card: '#141820',
          hover: '#1A1F2B',
          input: '#0F1218',
        },
        border: {
          DEFAULT: '#1E2430',
          active: '#2A3040',
        },
        accent: {
          cyan: '#00D4AA',
          blue: '#5B8DEF',
          orange: '#FF8C42',
          green: '#4ECB71',
          red: '#FF4757',
          yellow: '#FFB800',
          purple: '#A855F7',
        },
        text: {
          primary: '#E0E6F0',
          secondary: '#6B7B8D',
          muted: '#3D4A5C',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
