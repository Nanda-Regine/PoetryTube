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
        burgundy: {
          DEFAULT: '#4A0E2A',
          mid:     '#6B1840',
          light:   '#8B2252',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light:   '#E8C84A',
          dim:     '#A8892A',
        },
        bg: {
          DEFAULT: '#0F0A0A',
          card:    '#1A1015',
          hover:   '#221520',
          sidebar: '#130D10',
        },
        poetry: {
          text:       '#F5F0E8',
          muted:      '#B8A89C',
          dim:        '#7A6A62',
          border:     '#2E1E28',
          'border-light': '#3E2A36',
        },
        mood: {
          defiant:    '#E85D26',
          tender:     '#C77AC2',
          grief:      '#5B8FD4',
          joy:        '#E8C84A',
          resistance: '#4CAF72',
          love:       '#D4506A',
          identity:   '#6DB8A0',
          hope:       '#8BC34A',
        },
      },
      fontFamily: {
        display:  ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        serif:    ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans:     ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
      },
      borderRadius: {
        pill: '999px',
      },
      boxShadow: {
        gold: '0 0 20px rgba(212,175,55,0.15)',
        card: '0 4px 20px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'gradient-burgundy': 'linear-gradient(135deg, #4A0E2A 0%, #8B2252 50%, #D4AF37 100%)',
        'gradient-panel':    'linear-gradient(135deg, rgba(74,14,42,0.6), rgba(212,175,55,0.08))',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-up':   'slideUp 0.35s ease forwards',
        'dot-pulse':  'dotPulse 1.4s ease-in-out infinite',
        'shimmer':    'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { transform: 'translateY(100%)' },
          to:   { transform: 'translateY(0)' },
        },
        dotPulse: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.3' },
          '40%':           { transform: 'scale(1)',   opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
}

export default config
