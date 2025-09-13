// Z.E.I.N.T.H. Exchange/src/components/Layout.jsx
import React, { useEffect } from 'react';

const Starfield = () => (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
    </div>
);

const CustomCursor = () => {
    useEffect(() => {
        const cursor = document.querySelector('.custom-cursor');
        if (!cursor) return;

        const moveCursor = (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        };
        window.addEventListener('mousemove', moveCursor);

        const hoverables = document.querySelectorAll('a, button, input, [role="button"]');
        const onMouseEnter = () => cursor.classList.add('hover');
        const onMouseLeave = () => cursor.classList.remove('hover');

        hoverables.forEach(el => {
            el.addEventListener('mouseenter', onMouseEnter);
            el.addEventListener('mouseleave', onMouseLeave);
        });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            hoverables.forEach(el => {
                el.removeEventListener('mouseenter', onMouseEnter);
                el.removeEventListener('mouseleave', onMouseLeave);
            });
        };
    }, []);

    return <div className="custom-cursor"></div>;
};

const Header = ({ onNavigate }) => (
    <header className="flex items-center justify-between p-6 md:p-8 flex-shrink-0 h-[100px] bg-void-black/50 backdrop-blur-sm z-20">
        <div className="relative flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <h1 id="zenith-logo" className="text-xl md:text-2xl font-bold text-white tracking-widest font-data">
                Z<span className="text-celestial-blue/70">.</span>E<span className="text-celestial-blue/70">.</span>N<span className="text-celestial-blue/70">.</span>I<span className="text-celestial-blue/70">.</span>T<span className="text-celestial-blue/70">.</span>H
            </h1>
        </div>
        <nav className="hidden md:flex items-center space-x-8 text-sm">
            <a href="#" onClick={() => onNavigate('dashboard')} className="text-celestial-blue hover:text-white transition-colors duration-300">Exchange</a>
            <a href="#" className="text-stardust-grey hover:text-white transition-colors duration-300">Constellations</a>
            <a href="#" className="text-stardust-grey hover:text-white transition-colors duration-300">Docs</a>
        </nav>
        <button id="connect-wallet-button" className="bg-celestial-blue text-void-black font-bold py-2 px-5 rounded-lg text-sm transition-all duration-300 glow-blue-hover transform hover:scale-105 flex items-center space-x-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
            <span>Connect Wallet</span>
        </button>
    </header>
);

const Footer = () => (
    <footer className="w-full p-6 md:p-8 flex-shrink-0">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center space-y-4">
             <a href="https://doma.xyz/" target="_blank" rel="noopener noreferrer" className="text-xs text-stardust-grey hover:text-white transition-colors duration-300">
                Powered by <span className="font-bold text-celestial-blue">Doma</span>
            </a>
        </div>
    </footer>
);

const Layout = ({ children, onNavigate }) => (
    <div className="relative bg-void-black text-stardust-grey min-h-screen flex flex-col antialiased text-sm md:text-base">
        <Starfield />
        <CustomCursor />
        <div className="relative z-10 flex flex-col w-full h-full min-h-screen">
            <Header onNavigate={onNavigate} />
            {children}
            <Footer />
        </div>
    </div>
);

export default Layout;
