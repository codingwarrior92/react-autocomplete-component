/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      colors: {
        'green': '#059033',
        'gray': '#D9D9D9',
      },
      borderRadius: {
        '5': '5px',
      }
    },
  },
  plugins: [],
}

