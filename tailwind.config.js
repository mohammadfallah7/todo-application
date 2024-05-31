/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        light: {
          primary: "#007BFF",
        },
        dark: {
          primary: "#002247",
        },
      },
    },
  },
  plugins: [],
};
