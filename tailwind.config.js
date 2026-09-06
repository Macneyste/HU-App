/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        hu: {
          primary: "#148154",
          "primary-light": "#66C59B",
          "primary-dark": "#0F6843",
          secondary: "#2C85B7",
          "secondary-light": "#72BCE3",
          "secondary-dark": "#236E98",
          accent: "#2C85B7",
          "accent-light": "#97D1EC",
          bg: "#F8FAF9",
          surface: "#FFFFFF",
          border: "#D9E0DC",
          muted: "#606862",
          dark: "#202522",
        },
      },
      fontFamily: {
        sans: ["System"],
        mono: ["Courier", "monospace"],
      },
    },
  },
  plugins: [],
};
