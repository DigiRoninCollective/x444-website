/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // x4 Protocol Official Brand Kit
        'x4-gold': {
          50: '#fefcf3',
          100: '#fef8e7',
          200: '#fcf1cf',
          300: '#fae9b7',
          400: '#f7dd7d',
          500: '#F3BA2F', // Official x4 Gold
          600: '#d9932a',
          700: '#b86c25',
          800: '#945520',
          900: '#7a3d1b',
        },
        'x4-silver': {
          50: '#f9f9f9',
          100: '#f3f3f3',
          200: '#e7e7e7',
          300: '#d4d4d4',
          400: '#b8b8b8',
          500: '#C4C4C4', // Official x4 Silver
          600: '#a8a8a8',
          700: '#8c8c8c',
          800: '#707070',
          900: '#545454',
        },
        'x4-black': {
          50: '#f5f5f5',
          100: '#ebebeb',
          200: '#d7d7d7',
          300: '#c2c2c2',
          400: '#696969',
          500: '#454545',
          600: '#2a2a2a',
          700: '#1a1a1a',
          800: '#0f0f0f',
          900: '#000000', // Official x4 Black
        },
        'primary': {
          50: '#fefcf3',
          100: '#fef8e7',
          200: '#fcf1cf',
          300: '#fae9b7',
          400: '#f7dd7d',
          500: '#F3BA2F', // x4 Gold
          600: '#d9932a',
          700: '#b86c25',
          800: '#945520',
          900: '#7a3d1b',
        },
        'accent': {
          50: '#f9f9f9',
          100: '#f3f3f3',
          200: '#e7e7e7',
          300: '#d4d4d4',
          400: '#b8b8b8',
          500: '#C4C4C4', // x4 Silver
          600: '#a8a8a8',
          700: '#8c8c8c',
          800: '#707070',
          900: '#545454',
        },
        'cyber': {
          50: '#fefcf3',
          100: '#fef8e7',
          200: '#fcf1cf',
          300: '#fae9b7',
          400: '#f7dd7d',
          500: '#F3BA2F',
          600: '#d9932a',
          700: '#b86c25',
          800: '#945520',
          900: '#7a3d1b',
        },
        'dark': {
          50: '#f5f5f5',
          100: '#ebebeb',
          200: '#d7d7d7',
          300: '#c2c2c2',
          400: '#696969',
          500: '#454545',
          600: '#2a2a2a',
          700: '#1a1a1a',
          800: '#0f0f0f',
          900: '#000000', // Pure black
        },
      },
      backgroundImage: {
        'gradient-x444': 'linear-gradient(135deg, #0a0a0a 0%, #f4b81a 50%, #ffefdb 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        'grid': 'radial-gradient(circle, #f4b81a 1px, transparent 1px)',
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'flicker': 'flicker 3s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(243, 186, 47, 0.8)' },
          '50%': { opacity: '0.7', boxShadow: '0 0 40px rgba(243, 186, 47, 0.4)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
