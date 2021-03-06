const tailwindColors = require("tailwindcss/colors");
const COLORS = require("./libs/theme.js");

module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx}", "./components/**/*.{js,ts,jsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        ela: "url('/abc.png')",
        math: "url('/math.png')",
        science: "url('/science.png')",
      }),
    },
    colors: {
      ...tailwindColors,
      ...COLORS,
    },
  },
  variants: {
    extend: {
      backgroundColor: ["active", "checked"],
      borderColor: ["checked"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
