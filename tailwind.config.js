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
    extend: {
        colors: {
            blue: {
              100: 'rgb(29 172 254 / 100% )',
              80: 'rgb(29 172 254 / 80%)',
              60: 'rgb(29 172 254 / 60%)',
              40: 'rgb(29 172 254 / 40%)',
              20: 'rgb(29 172 254 / 20%)',
              16: 'rgb(29 172 254 / 16%)',
              14: 'rgb(29 172 254 / 14%)',
              8: 'rgb(29 172 254 / 8%)',
              4: 'rgb(29 172 254 / 4%)',
              ocean: 'rgb(24 119 242)',
              'ocean-dark': 'rgb(10 102 194)',
            },
            white: {
              DEFAULT: '#fff',
              16: 'rgb(255 255 255 / 16%)',
              32: 'rgb(255 255 255 / 32%)',
              40: 'rgb(255 255 255 / 40%)',
              48: 'rgb(255 255 255 / 48%)',
              64: 'rgb(255 255 255 / 64%)',
              70: 'rgb(255 255 255 / 70%)',
              80: 'rgb(255 255 255 / 80%)',
            },
            amber: {
              8: 'rgb(255 149 0 / 8%)',
            },
            gray: {
              6: '#F3F4F6',
              4: '#D1D5DB',
              7: '#F7FBFF',
              80: '#D9D9D9',
            },
            sky: {
              10: 'rgb(29 149 216 / 10%)',
              20: 'rgb(29 149 216 / 20%)',
            },
            // TODO: Ask andrew if we could user colors which are already in tailwind palette
            'gray-light': {
              100: '#E5E5EA',
            },
            'gray-dark': {
              100: '#F2F2F7',
            },
            // TODO: Merge with primary
            black: {
              DEFAULT: '#000',
              4: 'rgb(0 0 0 / 4%)',
              8: 'rgb(0 0 0 / 8%)',
              16: 'rgb(0 0 0 / 16%)',
              48: 'rgb(0 0 0 / 48%)',
              64: 'rgb(0 0 0 / 64%);',
              67: 'rgb(0 0 0 / 67%)',
              72: 'rgb(0 0 0 / 72%)',
              90: 'rgb(17, 17, 17)',
            },
            yellow: {
              100: '#F4C849',
            },
            //TODO: Remove primary because its just black we do not need to specify color
            primary: {
              light: '#111827',
              100: '#000000',
              4: 'rgb(0 0 0 / 4%)',
              16: 'rgb(0 0 0 / 16%)',
            },
            secondary: {
              light: '#86868B',
              80: 'rgb(60 60 67 / 80%)',
            },
            tertiary: {
              light: '#9CA3AF',
              40: 'rgb(60 60 67 / 40%)',
              50: 'rgb(60 60 67 / 50%)',
            },
            quaternary: {
              18: 'rgb(60 60 67 / 18%)',
            },
            green: {
              8: 'rgb(85 191 91 / 8%)',
              100: '#55BF5B',
            },
            orange: {
              100: '#F59E0B',
            },
            red: {
              8: 'rgb(224 78 89 / 8%)',
              100: '#E04E59',
            },
            slate: {
              100: '#F7FBFF',
            },
          }
    },
  },
  plugins: [],
}; 
