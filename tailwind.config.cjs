/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        tp: '300px'
      }
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
