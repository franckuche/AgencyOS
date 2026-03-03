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
          primary: '#FFFFFF',
          card: '#FFFFFF',
          hover: '#F3F4F6',
          elevated: '#F9FAFB',
          input: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E5E7EB',
          active: '#D1D5DB',
        },
        accent: {
          cyan: '#3B82F6',
          cyanDark: '#2563EB',
          blue: '#5B8DEF',
          orange: '#FF8C42',
          green: '#16A34A',
          red: '#FF4757',
          yellow: '#FFB800',
          purple: '#A855F7',
        },
        text: {
          primary: '#111827',
          secondary: '#4B5563',
          muted: '#9CA3AF',
        },
      },
      boxShadow: {
        'glow-cyan': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'glow-cyan-strong': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'elevated': '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
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
          '0%, 100%': { boxShadow: '0 0 15px -3px rgba(59, 130, 246, 0.2)' },
          '50%': { boxShadow: '0 0 20px -2px rgba(59, 130, 246, 0.3)' },
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
