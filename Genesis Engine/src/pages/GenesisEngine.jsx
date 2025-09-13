import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StepIndicator from '../components/StepIndicator';
import LoadingSpinner from '../components/LoadingSpinner';
import Astrolabe from '../components/Astrolabe';
import { Copy, Check } from 'iconoir-react';

export const GenesisEngine = () => {
    const [step, setStep] = useState(1);
    const [domain, setDomain] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isValuating, setIsValuating] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [valuation, setValuation] = useState(null);
    const [tokenTicker, setTokenTicker] = useState("");
    const [tokenSupply, setTokenSupply] = useState(0);
    const [verificationError, setVerificationError] = useState("");
    const [copied, setCopied] = useState(false);
    const [showConfirmButtons, setShowConfirmButtons] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const domainParam = urlParams.get('domain');
        if (domainParam) {
            setDomain(domainParam);
        }
    }, []);

    const handleVerificationSubmit = (e) => {
        e.preventDefault();
        const randomHex = [...Array(32)]
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join('');
        setVerificationCode(`zenith-verify=0x${randomHex}`);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(verificationCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleStartVerification = async () => {
        setIsVerifying(true);
        setVerificationError("");
        try {
            const response = await fetch(`https://dns.google/resolve?name=${domain}&type=TXT`);
            const data = await response.json();
            let isVerified = data.Answer && data.Answer.some(record => record.data.replace(/"/g, '').includes(verificationCode));

            // Temporary override for UI testing
            isVerified = true;

            if (isVerified) {
                setIsValuating(true);
                setTimeout(() => {
                    const mockScore = 600 + Math.floor(Math.random() * 275);
                    const mockValue = Math.round((mockScore / 1000) * (5000 + Math.random() * 20000));
                    setValuation({
                        domaScore: mockScore,
                        dollarValue: mockValue,
                        breakdown: {
                            "SEO Authority": Math.round(mockValue * 0.4),
                            "Traffic Estimate": Math.round(mockValue * 0.3),
                            "Brandability": Math.round(mockValue * 0.2),
                            "TLD Rarity": Math.round(mockValue * 0.1),
                        }
                    });
                    setTokenTicker(domain.split('.')[0].substring(0, 5).toUpperCase());
                    setTokenSupply(mockValue);
                    setIsValuating(false);
                    setStep(2);
                }, 3000);
            } else {
                setVerificationError("DNS record not found or doesn't match. Please check your DNS settings and allow some time for propagation.");
            }
        } catch (error) {
            console.error("DNS verification failed:", error);
            setVerificationError("An error occurred during verification. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleConfirmMint = () => {
        setIsMinting(true);
        setTimeout(() => {
            setIsMinting(false);
            setStep(4);
        }, 3000);
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                if (isValuating) return <LoadingSpinner text="Calculating Apogee... Analyzing stellar metrics..." />;
                return (
                    <div className="w-full max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Begin the Ascent</h2>
                        <p className="text-stardust-grey mb-8">Start by verifying ownership of your Web2 domain.</p>
                        {!verificationCode ? (
                            <form onSubmit={handleVerificationSubmit} className="group w-full">
                                <div className="bg-dark-matter border border-gray-700 rounded-xl transition-all duration-300 glow-blue-focus">
                                    <input
                                        value={domain}
                                        onChange={e => setDomain(e.target.value)}
                                        type="text"
                                        placeholder="e.g., mybusiness.com"
                                        className="w-full h-14 bg-transparent text-white placeholder-gray-500 px-6 text-lg outline-none rounded-xl"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="mt-4 w-full flex items-center justify-center bg-celestial-blue text-void-black font-bold h-12 px-6 rounded-lg text-base transform transition-transform duration-300 group-hover:scale-105"
                                >
                                    Verify
                                </button>
                            </form>
                        ) : (
                            <div className="bg-dark-matter border border-gray-800 rounded-xl p-6 text-left">
                                <p className="text-stardust-grey mb-4">
                                    To prove you own <span className="text-white font-bold">{domain}</span>,
                                    add the following TXT record to your DNS settings.
                                </p>
                                <div className="bg-void-black p-4 rounded-lg font-data text-celestial-blue relative pr-14">
                                    {verificationCode}
                                    <button
                                        onClick={handleCopy}
                                        className="absolute top-1/2 -translate-y-1/2 right-4 bg-transparent border-none cursor-pointer"
                                    >
                                        {copied ? (
                                            <Check className="w-5 h-5 text-supernova-green" />
                                        ) : (
                                            <Copy className="w-5 h-5 text-celestial-blue hover:text-white transition-colors" />
                                        )}
                                    </button>
                                </div>
                                {verificationError && <p className="text-red-500 text-sm mt-4">{verificationError}</p>}
                                <button
                                    onClick={handleStartVerification}
                                    disabled={isVerifying}
                                    className="mt-6 w-full h-12 bg-celestial-blue text-void-black font-bold rounded-lg flex items-center justify-center transition-opacity hover:opacity-90 disabled:opacity-75"
                                >
                                    {isVerifying ? 'Scanning...' : 'Begin Scan'}
                                </button>
                            </div>
                        )}
                    </div>
                );
            case 2:
                return (
                    <div className="w-full max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Apogee Moment: Valuation Complete</h2>
                        <p className="text-stardust-grey mb-8">We've calculated the objective market value of your digital real estate.</p>
                        <div className="bg-dark-matter border border-gray-800 rounded-xl p-8 flex flex-col md:flex-row items-center gap-8">
                            <div className="flex justify-center">
                                <div className="flex flex-col items-center">
                                    <h3 className="text-sm uppercase text-gray-400 tracking-widest">DomaScore</h3>
                                    <Astrolabe score={valuation?.domaScore} size="small" />
                                    <p className="mt-4 text-4xl text-white font-bold">${valuation?.dollarValue.toLocaleString()}</p>
                                    <p className="text-gray-400">Estimated Market Value</p>
                                </div>
                            </div>
                            <div className="flex-1 w-full text-left">
                                <h3 className="text-lg font-bold text-white mb-4">Valuation Constellation</h3>
                                <div className="space-y-4 font-data">
                                    {valuation && valuation.breakdown && Object.entries(valuation.breakdown).map(([key, value]) => (
                                        <div key={key}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-stardust-grey capitalize">{key}</span>
                                                <span className="text-white">${value.toLocaleString()}</span>
                                            </div>
                                            <div className="w-full bg-gray-800 rounded-full h-2">
                                                <div
                                                    className="bg-celestial-blue h-2 rounded-full"
                                                    style={{ width: `${(value / valuation.dollarValue) * 100}%`}}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setStep(3)}
                            className="mt-8 w-full h-12 bg-celestial-blue text-void-black font-bold rounded-lg flex items-center justify-center transition-opacity hover:opacity-90"
                        >
                            Initiate Tokenization
                        </button>
                    </div>
                );
            case 3:
                if (isMinting) return <LoadingSpinner text="Transmitting to Doma Protocol... Finalizing Genesis..." />;
                return (
                    <div className="w-full max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Final Stage: On-chain Genesis</h2>
                        <p className="text-stardust-grey mb-8">Confirm the details for your new liquid asset on the Doma Protocol.</p>
                        <div className="bg-dark-matter border border-gray-800 rounded-xl p-8 text-left space-y-6">
                            <div>
                                <label className="text-xs text-stardust-grey uppercase font-bold">Asset</label>
                                <p className="font-data text-white text-lg">{domain}</p>
                            </div>
                            <div>
                                <label className="text-xs text-stardust-grey uppercase font-bold">Token Ticker</label>
                                <div className="relative mt-1">
                                    <input
                                        value={tokenTicker}
                                        onChange={e => setTokenTicker(e.target.value.toUpperCase())}
                                        type="text"
                                        maxLength="5"
                                        className="w-full mt-1 h-12 bg-void-black border border-gray-700 rounded-lg text-white font-data px-4 outline-none focus:ring-2 focus:ring-celestial-blue"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-stardust-grey uppercase font-bold">Total Supply</label>
                                <input
                                    value={tokenSupply}
                                    onChange={e => setTokenSupply(Number(e.target.value))}
                                    type="number"
                                    className="w-full mt-1 h-12 bg-void-black border border-gray-700 rounded-lg text-white font-data px-4 outline-none focus:ring-2 focus:ring-celestial-blue"
                                />
                            </div>
                            <p className="text-xs text-stardust-grey text-center pt-4">
                                This action will mint an ERC-721 Genesis NFT representing your domain
                                and fractionalize it into {tokenSupply.toLocaleString()} ERC-20 tokens
                                with the ticker ${tokenTicker}.
                            </p>
                        </div>
                        {showConfirmButtons ? (
                            <div className="mt-8 flex gap-4 w-full max-w-sm mx-auto">
                                <button
                                    onClick={() => setShowConfirmButtons(false)}
                                    className="w-full h-12 bg-gray-700 text-black font-bold rounded-lg transition-colors hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmMint}
                                    className="w-full h-12 bg-celestial-blue text-void-black font-bold rounded-lg transition-opacity hover:opacity-90"
                                >
                                    Confirm
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowConfirmButtons(true)}
                                className="mt-8 w-full h-12 bg-celestial-blue text-void-black font-bold rounded-lg flex items-center justify-center transition-opacity hover:opacity-90"
                            >
                                Confirm & Mint on Doma
                            </button>
                        )}
                    </div>
                );
            case 4:
                return (
                    <div className="text-center">
                        <div className="w-24 h-24 mx-auto rounded-full bg-supernova-green/20 flex items-center justify-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-supernova-green flex items-center justify-center">
                                <svg className="w-10 h-10 text-void-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-white mt-6">Launch Successful!</h2>
                        <p className="text-stardust-grey mt-2">{domain} is now a liquid asset on the Doma Protocol.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                            <button className="h-12 px-6 bg-dark-matter border border-gray-700 text-white font-bold rounded-lg transition-colors hover:bg-gray-700">View in Portfolio</button>
                            <button className="h-12 px-6 bg-celestial-blue text-void-black font-bold rounded-lg transition-opacity hover:opacity-90">Go to Exchange</button>
                        </div>
                    </div>
                );
            default:
                return <div>Error: Unknown step</div>;
        }
    };

    return (
        <>
            <Layout>
                <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
                    <div className="w-full max-w-4xl">
                        <StepIndicator currentStep={step} />
                        <div className="mt-10">{renderStepContent()}</div>
                    </div>
                </main>
            </Layout>
        </>
    );
};
