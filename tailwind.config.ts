import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-ibm-arabic)', 'var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-inter)', 'monospace'],
      },
      colors: {
        navy: {
          950: '#060D1D',
          900: '#0A1630',
          800: '#102044',
          700: '#192E5C',
        },
        electric: {
          DEFAULT: '#2F6BFF',
          hover: '#1E56E8',
          subtle: 'rgba(47, 107, 255, 0.08)',
        },
        surface: {
          warm: '#FAFBFC',
          silver: '#F1F4F9',
          border: '#E3E8F0',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '20px',
      },
      spacing: {
        section: '140px',
        'section-lg': '180px',
      },
    },
  },
  plugins: [],
};

export default config;
