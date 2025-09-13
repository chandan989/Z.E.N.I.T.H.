// Z.E.I.N.T.H. Exchange/src/components/Header.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {NavLink} from "react-router-dom";

const Header = () => {

    const navLinkClass = ({ isActive }) =>
        `transition-colors duration-300 ${isActive ? 'text-celestial-blue' : 'text-stardust-grey hover:text-white'}`;

    return (
        <motion.header
            style={{ gridArea: 'header' }}
            className="bg-dark-matter/30 backdrop-blur-xl border border-stardust-grey/10 rounded-lg flex items-center justify-between px-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center space-x-4">
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-widest font-fira-code">
                    Z<span className="text-celestial-blue/70">.</span>E<span className="text-celestial-blue/70">.</span>N<span className="text-celestial-blue/70">.</span>I<span className="text-celestial-blue/70">.</span>T<span className="text-celestial-blue/70">.</span>H
                </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8 text-sm font-bold">
                <NavLink to="/exchange" className={navLinkClass}>Exchange</NavLink>
                <NavLink to="/constellations" className={navLinkClass}>Constellations</NavLink>
                <NavLink to="/portfolio" className={navLinkClass}>Portfolio</NavLink>
                <NavLink to="/docs" className={navLinkClass}>Docs</NavLink>
            </nav>
            <button className="bg-celestial-blue text-void-black font-bold py-2 px-5 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                <span>Connect Wallet</span>
            </button>
        </motion.header>
    );
};

export default Header;