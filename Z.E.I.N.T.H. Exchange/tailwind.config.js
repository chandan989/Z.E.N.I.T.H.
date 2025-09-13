// Z.E.I.N.T.H. Exchange/tailwind.config.js
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                'void-black': '#0C0A09',
                'dark-matter': '#18181B',
                'orion-gold': '#FBBF24',
                'celestial-blue': '#38BDF8', // Landing page primary accent
                'cosmic-teal': '#06B6D4',
                'supernova-green': '#22C55E',
                'red-giant': '#DC2626',
                'bright-white': '#FFFFFF',
                'stardust-grey': '#A1A1AA',
            },
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
                'fira-code': ['Fira Code', 'monospace'],
            },
        },
    },
    plugins: [
        plugin(function({ addUtilities, theme }) {
          addUtilities({
            '.glow-blue-focus:focus-within': {
              boxShadow: `0 0 0 2px ${theme('colors.dark-matter')}, 0 0 0 4px ${theme('colors.celestial-blue')}, 0 0 20px 5px rgba(56, 189, 248, 0.3)`,
            },
            '.glow-blue-hover:hover': {
              boxShadow: '0 0 15px 2px rgba(56, 189, 248, 0.3)',
            },
          })
        })
    ],
};
