/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        sofkianos: {
          orange: '#FF5F00',
        },
      },
      boxShadow: {
        'glow-orange': '0 0 24px rgba(255, 95, 0, 0.4)',
        'glow-orange-lg': '0 0 32px rgba(255, 95, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
