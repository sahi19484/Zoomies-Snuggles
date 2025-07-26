/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FAF9F6',
          100: '#F5F2ED',
          200: '#E8E2D5',
          300: '#D2B48C',
          400: '#C19A6B',
          500: '#A0825D',
          600: '#8B6F47',
          700: '#6B5537',
          800: '#4A3B28',
          900: '#2A211A'
        },
        secondary: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12'
        },
        accent: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A'
        },
        warm: {
          50: '#FFFBF5',
          100: '#FEF7E8',
          200: '#FDEFD1',
          300: '#FCE7BA',
          400: '#FADF9F',
          500: '#F7D084',
          600: '#E6B865',
          700: '#D1A247',
          800: '#BC8C29',
          900: '#A7760B'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Poppins', 'system-ui', 'sans-serif']
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.05)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.08)' },
          '70%': { transform: 'scale(1)' },
        },
        'heartbeat-mobile': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-2deg)' },
          '75%': { transform: 'rotate(2deg)' },
        },
        'wiggle-mobile': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-4px) scale(1.01)' },
        },
        'bounce-gentle-mobile': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'fade-in-mobile': {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-gentle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.01)' },
        },
        'smooth-appear': {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.9)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'gentle-sway': {
          '0%, 100%': { transform: 'rotate(0deg) translateX(0)' },
          '33%': { transform: 'rotate(1deg) translateX(2px)' },
          '66%': { transform: 'rotate(-0.5deg) translateX(-1px)' },
        },
        'smooth-blink': {
          '0%, 90%, 100%': { transform: 'scaleY(1)' },
          '95%': { transform: 'scaleY(0.1)' },
        },
        'pet-idle': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-2px) scale(1.005)' },
        },
        'pet-excited': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg) scale(1)' },
          '25%': { transform: 'translateY(-4px) rotate(1deg) scale(1.02)' },
          '75%': { transform: 'translateY(-2px) rotate(-0.5deg) scale(1.01)' },
        }
      },
      animation: {
        heartbeat: 'heartbeat 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'heartbeat-mobile': 'heartbeat-mobile 2.5s ease-in-out infinite',
        wiggle: 'wiggle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle-mobile': 'wiggle-mobile 2.5s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle-mobile': 'bounce-gentle-mobile 4s ease-in-out infinite',
        'fade-in': 'fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in-mobile': 'fade-in-mobile 0.5s ease-out',
        'pulse-gentle': 'pulse-gentle 3s ease-in-out infinite',
        'smooth-appear': 'smooth-appear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'gentle-sway': 'gentle-sway 4s ease-in-out infinite',
        'smooth-blink': 'smooth-blink 0.3s ease-in-out',
        'pet-idle': 'pet-idle 4s ease-in-out infinite',
        'pet-excited': 'pet-excited 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite',
      },
    },
  },
  plugins: [],
};
