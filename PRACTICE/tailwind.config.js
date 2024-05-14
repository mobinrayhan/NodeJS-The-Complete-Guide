/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/*.{html,js,css}", "./views/**/*.ejs"],
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
    },
  },
  plugins: [],
};
