/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Graphite dark-theme scale
        graphite: {
          50: '#F4F6F9',
          100: '#E6EAF0',
          200: '#CBD3DF',
          300: '#A8B3C7',
          400: '#7E8AA1',
          500: '#5B667D',
          600: '#4A5468',
          700: '#343B48',
          800: '#262B34',
          900: '#1C1F26',
          950: '#14161B',
        },
        // Brand blue (#0084D1)
        brand: {
          50: '#EFF7FE',
          100: '#DCEFFD',
          200: '#C0E4FB',
          300: '#94D3F8',
          400: '#61BFF3',
          500: '#2AA5E4',
          600: '#0084D1',
          700: '#0069A8',
          800: '#075E86',
          900: '#0C4F6E',
        },
      },
      fontFamily: {
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        sans: [
          'Inter',
          'system-ui',
          // Indic
          "'Noto Sans Devanagari'",
          "'Noto Sans Bengali'",
          // CJK
          "'Noto Sans SC'",
          "'Noto Sans JP'",
          "'Noto Sans KR'",
          // Arabic / Thai / others
          "'Noto Sans Arabic'",
          "'Noto Sans Thai'",
          'sans-serif',
        ],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};
