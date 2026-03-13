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
        brand: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#FF5F00',
          hover: '#E55600',
          glow: 'rgba(255, 95, 0, 0.4)',
        },
        sofkianos: {
          orange: '#FF5F00', // Legacy alias for backward compatibility during refactor
        },
      },
      spacing: {
        'brand-base': '1.5rem',
        'brand-lg': '2rem',
        'brand-xl': '4rem',
      },
      boxShadow: {
        'brand-glow': '0 0 24px rgba(255, 95, 0, 0.4)',
        'brand-glow-lg': '0 0 32px rgba(255, 95, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
