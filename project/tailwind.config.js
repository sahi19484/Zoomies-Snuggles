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
      }
    },
  },
  plugins: [],
};