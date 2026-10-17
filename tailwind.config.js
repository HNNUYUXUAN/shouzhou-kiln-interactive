/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'celadon': {
          50: '#f0f9f4',
          100: '#daf0e3',
          200: '#b8e1c9',
          300: '#8bcba7',
          400: '#5aad81',
          500: '#3a9165',
          600: '#2a7451',
          700: '#225d42',
          800: '#1d4a36',
          900: '#193d2d',
        },
        'bronze': {
          50: '#faf8f3',
          100: '#f2ede1',
          200: '#e3d8c1',
          300: '#d1bd9a',
          400: '#bfa071',
          500: '#a88556',
          600: '#8a6a45',
          700: '#6d5239',
          800: '#5a4532',
          900: '#4c3a2b',
        }
      },
      fontFamily: {
        'serif-cn': ['Noto Serif SC', 'Source Han Serif SC', 'serif'],
      }
    },
  },
  plugins: [],
}
