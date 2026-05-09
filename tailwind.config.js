/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
        'transform-shadow': 'transform, box-shadow',
      }
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
