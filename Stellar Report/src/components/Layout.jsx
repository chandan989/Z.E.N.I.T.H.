import React from 'react';

const Starfield = () => (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
    </div>
);

const Header = ({ onNavigate }) => (
    <header className="w-full flex items-center justify-between p-6 md:p-8 flex-shrink-0">
        <div className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Z.E.N.I.T.H. Logo" className="h-8" />
        </div>
        <button className="bg-celestial-blue text-void-black font-bold py-2 px-5 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 font-data">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
            <span>Connect Wallet</span>
        </button>
    </header>
);

const Footer = () => (
    <footer className="w-full p-6 md:p-8 flex-shrink-0">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center space-y-4">
             <a href="https://doma.xyz/" target="_blank" rel="noopener noreferrer" className="text-xs text-stardust-grey hover:text-white transition-colors duration-300">
                Powered by <span className="font-bold">Doma Protocol</span>
            </a>
        </div>
    </footer>
);

const Layout = ({ children, onNavigate }) => (
    <div className="relative bg-void-black text-stardust-grey min-h-screen flex flex-col antialiased text-sm md:text-base">
        <Starfield />
        <div className="relative z-10 flex flex-col w-full h-full min-h-screen">
            <Header onNavigate={onNavigate} />
            {children}
            <Footer />
        </div>
    </div>
);

export default Layout;
