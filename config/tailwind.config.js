/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan templates + JS strings for class names
  content: ["./index.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        cream: "#F8F1E6",
        ivory: "#FFFDF8",
        leaf: "#214D38",
        riceGreen: "#7C9A62",
        gold: "#C9A45C",
        riceBrown: "#8B6A45",
        charcoal: "#2B2B2B",
        beige: "#E7D8C2",
      },
      fontFamily: {
        serifThai: ['"Noto Serif Thai"', "serif"],
        sansThai: ['"Noto Sans Thai"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

