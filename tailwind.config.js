/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        'left-main' : '#2B2B2B',
        'right-main' : '#FFFFFF',
        'chat-date' : '#ECE9E9',
        'chat-ui' : '#F9F8F8'

      },

    },
    fontFamily: {
      gmarket:["gmarket"],
    },
  },
  plugins: [],
}

