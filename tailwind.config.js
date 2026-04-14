/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        instagram: {
          DEFAULT: '#C13584',
          light: '#E1306C',
        },
        facebook: {
          DEFAULT: '#4267B2',
          light: '#1877F2',
        },
        tiktok: {
          DEFAULT: '#010101',
          accent: '#69C9D0',
        },
        meta: {
          DEFAULT: '#0081FB',
          light: '#F06B3F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
