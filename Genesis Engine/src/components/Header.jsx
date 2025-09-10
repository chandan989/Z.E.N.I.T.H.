import React, { useState, useEffect } from 'react';

const Header = () => {
    const [currentAccount, setCurrentAccount] = useState(null);

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                console.log("Make sure you have MetaMask!");
                return;
            }

            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log("Found an authorized account:", account);
                setCurrentAccount(account);
            } else {
                console.log("No authorized account found");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const connectWallet = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                alert("Get MetaMask! -> https://metamask.io/");
                return;
            }

            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    const truncateAddress = (address) => {
        if (!address) return "";
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    return (
        <header className="w-full flex items-center justify-between p-6 md:p-8 flex-shrink-0">
            <div className="flex items-center space-x-2">
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-widest font-data">
                    Z<span className="text-celestial-blue/70">.</span>E<span className="text-celestial-blue/70">.</span>N<span className="text-celestial-blue/70">.</span>I<span className="text-celestial-blue/70">.</span>T<span className="text-celestial-blue/70">.</span>H
                </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8 text-sm">
                <a href="#" className="text-stardust-grey hover:text-white transition-colors duration-300">Exchange</a>
                <a href="#" className="text-stardust-grey hover:text-white transition-colors duration-300">Constellations</a>
                <a href="#" className="text-stardust-grey hover:text-white transition-colors duration-300">Docs</a>
            </nav>
            <button
                onClick={connectWallet}
                className="bg-celestial-blue text-void-black font-bold py-2 px-5 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 font-data"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
                <span>
                    {currentAccount ? truncateAddress(currentAccount) : "Connect Wallet"}
                </span>
            </button>
        </header>
    );
};

export default Header;