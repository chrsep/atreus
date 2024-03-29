// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require("tailwindcss/colors")

/* eslint-disable global-require,import/no-extraneous-dependencies */
module.exports = {
  mode: "jit",
  purge: ["src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    fontFamily: {
      ui: `"Inria Sans", system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", sans-serif`,
      body: `"Noto Sans", system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", sans-serif`,
    },
    colors: {
      ...colors,
      "dark-bg": {
        700: colors.gray[700],
        800: colors.gray[800],
        900: colors.gray[900],
      },
      primary: {
        100: colors.blue["50"],
        200: "#4a8bf1",
        300: "#498af5",
        400: "#2563EB",
        500: "#1d4ed8",
        600: "#1E40AF",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
  ],
}
