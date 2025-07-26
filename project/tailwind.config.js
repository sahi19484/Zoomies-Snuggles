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
          '10%, 30%, 50%, 70%, 90%': { transform: 'scale(1.05)' },
          '20%, 40%, 60%, 80%': { transform: 'scale(1.08)' },
        },
        'heartbeat-mobile': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'wiggle-mobile': {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        'bounce-gentle-mobile': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-1px)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-mobile': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-gentle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      },
      animation: {
        heartbeat: 'heartbeat 1.2s ease-in-out infinite',
        'heartbeat-mobile': 'heartbeat-mobile 2s ease-in-out infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        'wiggle-mobile': 'wiggle-mobile 1.5s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 2.5s infinite',
        'bounce-gentle-mobile': 'bounce-gentle-mobile 3s infinite',
        'fade-in': 'fade-in 0.6s ease-out',
        'fade-in-mobile': 'fade-in-mobile 0.3s ease-out',
        'pulse-gentle': 'pulse-gentle 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

