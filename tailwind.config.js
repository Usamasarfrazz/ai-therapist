/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2fcf9',
          100: '#dcf6f0',
          200: '#bcece1',
          300: '#8edecf',
          400: '#5bc6b5',
          500: '#38a899',
          600: '#288a7e',
          700: '#246f66',
          800: '#215953',
          900: '#1f4a46',
          950: '#0f2b29',
        },
        secondary: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#a18072',
          600: '#8a6a5c',
          700: '#725548',
          800: '#5d453b',
          900: '#4a3932',
        },
      },
    },
  },
  plugins: [],
}


