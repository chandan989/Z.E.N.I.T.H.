/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'void-black': '#0C0A09',
                'dark-matter': '#18181B',
                'orion-gold': '#FBBF24',
                'cosmic-teal': '#06B6D4',
                'supernova-green': '#22C55E',
                'red-giant': '#DC2626',
                'bright-white': '#FFFFFF',
                'stardust-grey': '#A1A1AA',
            },
            fontFamily: {
                'inter': ['Inter', 'sans-serif'],
                'fira-code': ['Fira Code', 'monospace'],
            },
        },
    },
    plugins: [],
}