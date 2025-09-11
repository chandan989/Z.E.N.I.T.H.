import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Starfield from './Starfield';

const Layout = ({ children }) => (
    <div className="bg-void-black text-white min-h-screen flex flex-col antialiased text-sm md:text-base">
        <Starfield />
        <div className="z-10 flex flex-col w-full h-full min-h-screen">
            <Header />
            {children}
            <Footer />
        </div>
    </div>
);
export default Layout;
