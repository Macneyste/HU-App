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
          primary: "#062B50",
          "primary-light": "#174B78",
          "primary-dark": "#041E38",
          secondary: "#087F5B",
          "secondary-light": "#12A477",
          "secondary-dark": "#056047",
          accent: "#F4B740",
          "accent-light": "#F9CD71",
          bg: "#F4F7FB",
          surface: "#FFFFFF",
          border: "#E3EAF2",
          muted: "#64748B",
          dark: "#102033",
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
