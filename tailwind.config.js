const colors = require('tailwindcss/colors')
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      margin: {
        '-72': '-18rem',
      }
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      primary: '#3877a9',
      secondary: '#4d4d4d',
      hover: '#feb564',
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
