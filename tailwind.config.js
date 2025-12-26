/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F9FF',   // Lightest Blue background
          100: '#E0F2FE',  // Lighter Blue
          500: '#007397',  // CPA Light Blue (Secondary)
          600: '#006FBA',  // CPA Blue (Primary Action)
          700: '#005A9C',  // CPA Blue Darker (Hover)
          900: '#003366',  // Deep Navy (Text/Headers)
        },
        accent: {
          green: '#009A49',      // CPA Green (Icons/Success)
          lightGreen: '#43B02A', // CPA Light Green
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
