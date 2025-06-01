/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
    theme: {
      extend: {
        colors: {
          customDark: "#0A0A0A", // Dark Background
          customPurple: "#25203B", // Card Background
        },
        borderRadius: {
          md: '8px',
        },
        fontFamily: {
          turret: ["'Turret Road'", "cursive"],
          sans: ["'Poppins'", "sans-serif"],
        },
      },
    },
    plugins: [],
    darkMode: 'class',
};
  