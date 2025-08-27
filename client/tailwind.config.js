/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        'nunito-sans': ['Nunito Sans', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'oi': ['Oi', 'serif'],
        'marhey': ['Marhey', 'sans-serif'],
        'cairo': ['Cairo', 'sans-serif'],
        'sans': ['Cairo', 'system-ui', 'sans-serif'],
      },
      colors: {
        'input-bg': '#ffffff',
        'input-text': '#000000',
        'input-border': '#d1d5db',
      },
      fontWeight: {
        'marhey-light': '300',
        'marhey-regular': '400',
        'marhey-medium': '500',
        'marhey-semibold': '600',
        'marhey-bold': '700',
        'cairo-light': '300',
        'cairo-regular': '400',
        'cairo-medium': '500',
        'cairo-semibold': '600',
        'cairo-bold': '700',
        'cairo-extrabold': '800',
        'cairo-black': '900',
      }
    },
  },
  darkMode: 'class',
  plugins: [require('daisyui')],
}