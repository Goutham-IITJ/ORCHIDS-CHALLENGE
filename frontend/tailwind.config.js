/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enables dark mode via class strategy
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',    // App Router pages/components
    './src/pages/**/*.{js,ts,jsx,tsx}',  // Optional, if you use pages dir
    './src/components/**/*.{js,ts,jsx,tsx}', // Your components folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
