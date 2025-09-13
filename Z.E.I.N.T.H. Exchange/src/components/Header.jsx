// Z.E.I.N.T.H. Exchange/src/components/Header.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {NavLink} from "react-router-dom";

const Header = () => {

    const navLinkClass = ({ isActive }) =>
        `transition-colors duration-300 ${isActive ? 'text-celestial-blue' : 'text-stardust-grey hover:text-white'}`;

    return (

        <header className="flex items-center justify-between p-6 md:p-8 flex-shrink-0">
            <div className="relative flex items-center space-x-2 cursor-pointer">
                {/* Z.E.N.I.T.H. Logo with refined periods */}
                <h1 id="zenith-logo" className="text-xl md:text-2xl font-bold text-white tracking-widest font-data">
                    Z<span className="text-celestial-blue/70">.</span>E<span className="text-celestial-blue/70">.</span>N
                    <span className="text-celestial-blue/70">.</span>I<span className="text-celestial-blue/70">.</span>T
                    <span className="text-celestial-blue/70">.</span>H
                </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8 text-sm">
                <a href="#" className="text-stardust-grey hover:text-white transition-colors duration-300">Exchange</a>
                <a href="#" className="text-stardust-grey hover:text-white transition-colors duration-300">Constellations</a>
                <a href="#" className="text-stardust-grey hover:text-white transition-colors duration-300">Docs</a>
            </nav>
            <button
                id="connect-wallet-button"
                className="bg-celestial-blue text-void-black font-bold py-2 px-5 rounded-lg text-sm transition-all duration-300 glow-blue-hover transform hover:scale-105 flex items-center space-x-2"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                </svg>
                <span>Connect Wallet</span>
            </button>
        </header>

    );
};

export default Header;