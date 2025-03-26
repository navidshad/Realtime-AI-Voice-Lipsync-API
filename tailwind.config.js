/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  corePlugins: {
    preflight: true,
  },
  // Important to handle Shadow DOM specificity issues
  important: '#root',
  // Prevent purging in development
  safelist: [{ pattern: /.*/ }],
  theme: {
    extend: {},
  },
  plugins: [],
}; 