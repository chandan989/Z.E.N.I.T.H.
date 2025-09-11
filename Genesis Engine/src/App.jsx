import React, { useState, useEffect } from 'react';
import {GenesisEngine} from "./pages/GenesisEngine";

// --- Global Styles & Fonts (Injected for single-file compatibility) ---
const GlobalStyles = () => (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Fira+Code&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        /* Basic Tailwind Reset & Base Styles */
        *, ::before, ::after { box-sizing: border-box; border-width: 0; border-style: solid; border-color: #e5e7eb; }
        html { line-height: 1.5; -webkit-text-size-adjust: 100%; -moz-tab-size: 4; tab-size: 4; font-family: 'Inter', sans-serif; }
        body { margin: 0; line-height: inherit; background-color: #0C0A09; color: #F1F5F9; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;}
        h1, h2, p, button, input, a { margin: 0; padding: 0; }
        
        /* Tailwind Utilities Used in this Component */
        .w-full { width: 100%; } .h-full { height: 100%; } .min-h-screen { min-height: 100vh; }
        .relative { position: relative; } .absolute { position: absolute; } .fixed { position: fixed; }
        .top-0 { top: 0; } .left-0 { left: 0; } .right-0 { right: 0; } .bottom-0 { bottom: 0; }
        .flex { display: flex; } .flex-col { flex-direction: column; } .flex-row { flex-direction: row; }
        .items-center { align-items: center; } .justify-center { justify-content: center; } .justify-between { justify-content: space-between; } .justify-around { justify-content: space-around; }
        .flex-shrink-0 { flex-shrink: 0; } .flex-grow { flex-grow: 1; } .flex-1 { flex: 1 1 0%; }
        .p-6 { padding: 1.5rem; } .p-8 { padding: 2rem; } .p-4 { padding: 1rem; } .p-2 { padding: 0.5rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; } .px-5 { padding-left: 1.25rem; padding-right: 1.25rem; } .px-4 { padding-left: 1rem; padding-right: 1rem; } .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
        .pl-6 { padding-left: 1.5rem; } .pr-40 { padding-right: 10rem; } .pl-7 { padding-left: 1.75rem; } .pr-4 { padding-right: 1rem; }
        .pt-4 { padding-top: 1rem; }
        .space-x-2 > :not([hidden]) ~ :not([hidden]) { margin-left: 0.5rem; }
        .space-x-8 > :not([hidden]) ~ :not([hidden]) { margin-left: 2rem; }
        .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
        .space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.5rem; }
        .gap-4 { gap: 1rem; } .gap-8 { gap: 2rem; }
        .mx-auto { margin-left: auto; margin-right: auto; } .my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .mt-1 { margin-top: 0.25rem; } .mb-2 { margin-bottom: 0.5rem; } .mb-4 { margin-bottom: 1rem; } .mb-8 { margin-bottom: 2rem; } .mt-2 { margin-top: 0.5rem; } .mt-4 { margin-top: 1rem; } .mt-6 { margin-top: 1.5rem; } .mt-8 { margin-top: 2rem; } .mt-10 { margin-top: 2.5rem; }
        .w-10 { width: 2.5rem; } .h-10 { height: 2.5rem; } .w-16 { width: 4rem; } .h-16 { height: 4rem; } .w-24 { width: 6rem; } .h-24 { height: 6rem; }
        .w-px { width: 1px; } .h-8 { height: 2rem; } .h-px { height: 1px; } .h-12 { height: 3rem; } .h-14 { height: 3.5rem; } .h-0\.5 { height: 2px; } .h-2 { height: 0.5rem; }
        .max-w-7xl { max-width: 80rem; } .max-w-4xl { max-width: 56rem; } .max-w-2xl { max-width: 42rem; } .max-w-3xl { max-width: 48rem; } .max-w-md { max-width: 28rem; } .max-w-sm { max-width: 24rem; }
        .text-white { color: #fff; } .text-void-black { color: #0C0A09; } .text-stardust-grey { color: #A1A1AA; }
        .text-celestial-blue { color: #38BDF8; } .text-celestial-blue\/70 { color: rgba(56, 189, 248, 0.7); }
        .bg-void-black { background-color: #0C0A09; } .bg-dark-matter { background-color: #18181B; }
        .bg-celestial-blue { background-color: #38BDF8; } .bg-black\/20 { background-color: rgba(0,0,0,0.2); }
        .bg-gray-800 { background-color: #1f2937; } .bg-transparent { background-color: transparent; }
        .bg-supernova-green { background-color: #22C55E; } .bg-supernova-green\/20 { background-color: rgba(34, 197, 94, 0.2); }
        .border { border-width: 1px; } .border-2 { border-width: 2px; }
        .border-gray-800 { border-color: #1f2937; } .border-gray-700 { border-color: #374151; } .border-celestial-blue { border-color: #38BDF8; }
        .rounded-lg { border-radius: 0.5rem; } .rounded-xl { border-radius: 0.75rem; } .rounded-full { border-radius: 9999px; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; } .text-lg { font-size: 1.125rem; line-height: 1.75rem; } .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .text-2xl { font-size: 1.5rem; line-height: 2rem; } .text-3xl { font-size: 1.875rem; line-height: 2.25rem; } .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
        .font-bold { font-weight: 700; } .font-semibold { font-weight: 600; }
        .tracking-widest { letter-spacing: 0.1em; } .tracking-wider { letter-spacing: 0.05em; }
        .uppercase { text-transform: uppercase; } .capitalize { text-transform: capitalize; }
        .text-center { text-align: center; } .text-left { text-align: left; }
        .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 300ms; }
        .duration-300 { transition-duration: 300ms; } .duration-500 { transition-duration: 500ms; } .duration-1000 { transition-duration: 1000ms; }
        .ease-out { transition-timing-function: cubic-bezier(0, 0, 0.2, 1); }
        .transform { transform: translate(0, 0) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1); }
        .hover\:scale-105:hover { transform: scale(1.05); } .hover\:text-white:hover { color: #fff; }
        .hover\:opacity-90:hover { opacity: 0.9; } .hover\:bg-gray-700:hover { background-color: #374151; }
        .z-10 { z-index: 10; } .z-0 { z-index: 0; }
        .backdrop-blur-sm { backdrop-filter: blur(4px); }
        .hidden { display: none; }
        .outline-none { outline: 2px solid transparent; outline-offset: 2px; }
        .focus\:ring-2:focus { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }
        .focus\:ring-celestial-blue:focus { --tw-ring-color: #38BDF8; }
        .placeholder-gray-500::placeholder { color: #6b7280; }
        .animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .opacity-25 { opacity: 0.25; } .opacity-75 { opacity: 0.75; }
        .antialiased { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        .group:hover .group-hover\:scale-105 { transform: scale(1.05); }
        .relative > .absolute { position: absolute; }
        .top-1\/2 { top: 50%; } .-translate-y-1\/2 { transform: translateY(-50%); }
        .transform.-rotate-90 { transform: rotate(-90deg); }
        @media (min-width: 768px) { .md\:text-base { font-size: 1rem; line-height: 1.5rem; } .md\:p-8 { padding: 2rem; } .md\:text-2xl { font-size: 1.5rem; line-height: 2rem; } .md\:flex { display: flex; } .md\:hidden { display: none; } .md\:block { display: block; } .md\:w-1\/3 { width: 33.333333%; } .md\:flex-row { flex-direction: row; } .md\:text-3xl { font-size: 1.875rem; line-height: 2.25rem; } }
        
        /* Custom CSS from index.css */
        @keyframes move-stars { from { transform: translateY(0px); } to { transform: translateY(-2000px); } }
        .stars, .stars2, .stars3 { position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; display: block; background: transparent; z-index: 0; }
        .stars { background-image: radial-gradient(1px 1px at 20px 30px, #FFFFFF, rgba(255,255,255,0)), radial-gradient(1px 1px at 40px 70px, #FFFFFF, rgba(255,255,255,0)), radial-gradient(1px 1px at 50px 160px, #CCCCCC, rgba(255,255,255,0)), radial-gradient(1px 1px at 90px 40px, #DDDDDD, rgba(255,255,255,0)); background-repeat: repeat; background-size: 200px 200px; animation: move-stars 200s linear infinite; }
        .stars2 { background-image: radial-gradient(1px 1px at 10px 90px, #FFFFFF, rgba(255,255,255,0)), radial-gradient(2px 2px at 30px 50px, #FFFFFF, rgba(255,255,255,0)), radial-gradient(1px 1px at 110px 100px, #CCCCCC, rgba(255,255,255,0)); background-repeat: repeat; background-size: 300px 300px; animation: move-stars 150s linear infinite; }
        .stars3 { background-image: radial-gradient(2px 2px at 60px 200px, #FFFFFF, rgba(255,255,255,0)), radial-gradient(2px 2px at 200px 250px, #FFFFFF, rgba(255,255,255,0)); background-repeat: repeat; background-size: 400px 400px; animation: move-stars 100s linear infinite; }
        .font-data { font-family: 'Fira Code', monospace; }
        .glow-blue-focus:focus-within { box-shadow: 0 0 0 2px #18181B, 0 0 0 4px #38BDF8, 0 0 20px 5px rgba(56, 189, 248, 0.3); }
      `}</style>
    </>
);

// --- Main App Component ---
// This is the root of the application.
function App() {
  return (
    <>
      <GlobalStyles />
      <GenesisEngine />
    </>
  );
}

export default App;

