import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fdf8ee',
          100: '#f5e6c0',
          200: '#ecd090',
          300: '#e0b85a',
          400: '#C8A96E',
          500: '#b8922a',
          600: '#8B6914',
          700: '#5e460d',
        },
        ios: {
          bg:       '#0a0a0b',
          surface:  'rgba(28,28,30,0.95)',
          surface2: 'rgba(44,44,46,0.90)',
          surface3: 'rgba(58,58,60,0.80)',
          glass:    'rgba(255,255,255,0.08)',
          glass2:   'rgba(255,255,255,0.12)',
          border:   'rgba(255,255,255,0.10)',
          text:     '#ffffff',
          text2:    'rgba(255,255,255,0.60)',
          text3:    'rgba(255,255,255,0.35)',
          green:    '#30D158',
          blue:     '#0A84FF',
          red:      '#FF453A',
          tbar:     'rgba(18,18,20,0.92)',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '22px',
        '4xl': '28px',
        '5xl': '36px',
      },
      fontFamily: {
        sans: ['-apple-system', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'sans-serif'],
      },
      backdropBlur: {
        ios: '20px',
      },
      animation: {
        'spring-in': 'springIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        'fade-up':   'fadeUp 0.3s ease-out',
        'slide-up':  'slideUp 0.4s cubic-bezier(0.4,0,0.2,1)',
      },
      keyframes: {
        springIn: {
          '0%':   { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
