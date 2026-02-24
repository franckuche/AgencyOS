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
          elevated: '#1D2331', // New elevated background for depth
          input: '#0F1218',
        },
        border: {
          DEFAULT: '#222938', // Slightly lighter for better visibility
          active: '#3A445C',  // More contrast when active
        },
        accent: {
          cyan: '#00E6B8', // Brighter cyan for better contrast
          cyanDark: '#00B38F',
          blue: '#5B8DEF',
          orange: '#FF8C42',
          green: '#4ECB71',
          red: '#FF4757',
          yellow: '#FFB800',
          purple: '#A855F7',
        },
        text: {
          primary: '#F0F4F8', // Brighter white for primary text
          secondary: '#94A3B8', // More legible secondary text (Slate 400)
          muted: '#64748B',     // More legible muted text (Slate 500)
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 15px -3px rgba(0, 230, 184, 0.3)',
        'glow-cyan-strong': '0 0 20px -2px rgba(0, 230, 184, 0.5)',
        'elevated': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px -3px rgba(0, 230, 184, 0.3)' },
          '50%': { boxShadow: '0 0 20px -2px rgba(0, 230, 184, 0.5)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'check-in': {
          '0%': { opacity: '0', transform: 'scale(0) rotate(-45deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'scale-in': 'scale-in 0.2s ease-out',
        'slide-in-right': 'slide-in-right 0.25s ease-out',
        'check-in': 'check-in 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      },
    },
  },
  plugins: [],
};

export default config;
