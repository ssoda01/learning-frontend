/** @type {import('tailwindcss').Config} */

// let ft = require('./static/fusion-pixel-12px-monospaced-zh_hans.woff2')
module.exports = {
  content: ["./src/Playground/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['pixel12', 'pixel12'],
      },
    },
  },
  plugins: [],
}