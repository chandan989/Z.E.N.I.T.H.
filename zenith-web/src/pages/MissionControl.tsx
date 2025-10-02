import "@/index.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const MissionControl = () => {
  const navigate = useNavigate();

  const scrollRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    scrollRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      scrollRefs.current.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, []);

  const addToScrollRefs = (el: HTMLElement | null) => {
    if (el && !scrollRefs.current.includes(el)) {
      scrollRefs.current.push(el);
    }
  };

  const CountUp = ({ end, duration = 2000, prefix = "", suffix = "" }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            let start = 0;
            const endValue = end;
            const startTime = Date.now();

            const animateCount = () => {
              const now = Date.now();
              const progress = Math.min(1, (now - startTime) / duration);
              const current = start + (endValue - start) * progress;
              setCount(current);

              if (progress < 1) {
                requestAnimationFrame(animateCount);
              }
            };
            requestAnimationFrame(animateCount);
            observer.unobserve(ref.current!);
          }
        },
        { threshold: 0.1 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, [end, duration]);

    const formatNumber = (num: number) => {
        if (num % 1 !== 0) {
            return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        return num.toLocaleString("en-US");
    }

    return (
      <p ref={ref} className="text-2xl md:text-3xl text-white font-data font-bold mt-1">
        {prefix}{formatNumber(count)}{suffix}
      </p>
    );
  };

  return (
    <div className="relative font-sans antialiased text-sm md:text-base text-stardust-grey">
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      <div className="relative z-10 flex flex-col w-full">

        <main className="h-screen flex flex-col items-center justify-center text-center p-4 pb-32">
          <div className="flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight md:leading-tight max-w-4xl tracking-tighter fade-in-up" style={{ animationDelay: "0.2s", textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}>
                The Apex of Digital Asset Finance.
            </h1>
            <p className="text-lg md:text-xl text-stardust-grey mt-4 max-w-3xl fade-in-up" style={{ animationDelay: "0.4s" }}>
                Z.E.N.I.T.H. is a decentralized exchange for trading tokenized real-world assets, starting with the bedrock of the internet: domain names.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 fade-in-up" style={{ animationDelay: "0.6s" }}>
                <button 
                    onClick={() => navigate('/genesis')}
                    className="bg-celestial-blue text-void-black font-bold h-14 px-8 rounded-lg text-lg transform transition-all duration-300 hover:scale-105 pulse-animation w-full sm:w-auto"
                >
                    Launch Genesis Engine
                </button>
                <button 
                    onClick={() => navigate('/exchange')}
                    className="bg-transparent border border-celestial-blue text-celestial-blue font-bold h-14 px-8 rounded-lg text-lg transform transition-all duration-300 hover:bg-celestial-blue hover:text-void-black w-full sm:w-auto"
                >
                    Go to Exchange
                </button>
            </div>
          </div>
        </main>

        <section ref={addToScrollRefs} className="w-full max-w-7xl mx-auto py-16 md:py-24 px-6 md:px-8 text-center scroll-animate">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter">DomainFi: The New Frontier</h2>
            <p className="mt-4 text-lg md:text-xl text-stardust-grey max-w-3xl mx-auto">
                Z.E.N.I.T.H. pioneers the next evolution of Real-World Asset (RWA) tokenization by focusing on high-value digital assets: domain names. We transform illiquid Web2 domains into liquid, tradable financial instruments on the blockchain, unlocking new avenues for investment and speculation.
            </p>
        </section>

        <section ref={addToScrollRefs} className="w-full max-w-7xl mx-auto py-16 md:py-24 px-6 md:px-8 scroll-animate">
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter">Celestial Precision: Our Philosophy</h2>
                 <p className="mt-4 text-lg md:text-xl text-stardust-grey max-w-3xl mx-auto">
                    Inspired by celestial mechanics, our protocol is built on three core principles.
                </p>
            </div>
            <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
                <div className="bg-dark-matter/50 border border-gray-800 rounded-xl p-8">
                    <h3 className="text-xl font-bold text-white">Signal Over Noise</h3>
                    <p className="mt-3 text-stardust-grey">The interface shows only what matters. We filter out distractions to provide pure, actionable insight, allowing traders to act with clarity and confidence.</p>
                </div>
                <div className="bg-dark-matter/50 border border-gray-800 rounded-xl p-8">
                    <h3 className="text-xl font-bold text-white">Performance as a Feature</h3>
                    <p className="mt-3 text-stardust-grey">Zero-latency and instant response are fundamental. Every interaction is engineered to feel faster than thought, providing a tangible competitive edge.</p>
                </div>
                <div className="bg-dark-matter/50 border border-gray-800 rounded-xl p-8">
                    <h3 className="text-xl font-bold text-white">Structured Ascent</h3>
                    <p className="mt-3 text-stardust-grey">Users are guided through clear, progressive steps. The journey from asset onboarding to trading is designed to be as intuitive as an asset’s climb toward its zenith.</p>
                </div>
            </div>
        </section>

        <section ref={addToScrollRefs} className="w-full max-w-7xl mx-auto py-16 md:py-24 px-6 md:px-8 flex flex-col md:flex-row items-center scroll-animate">
            <div className="md:w-1/2 pr-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter">The DomaScore AI</h2>
                <p className="mt-4 text-lg text-stardust-grey">At the heart of Z.E.N.I.T.H. is the DomaScore AI, a sophisticated valuation engine that provides a clear, data-driven assessment of any domain's intrinsic value. It analyzes dozens of data streams in real-time to generate a single, comprehensive score.</p>
                <div className="mt-8 space-y-4 text-left">
                    <div className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-celestial-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p><span className="font-bold text-white">Valuation Constellation:</span> The DomaScore is visualized as a constellation, where stars are sized and brightened by factors like SEO authority, traffic metrics, brandability, TLD strength, and commercial potential.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-celestial-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p><span className="font-bold text-white">Astrolabe UI:</span> The score is presented in a circular, astrolabe-style interface, blending ancient celestial navigation with modern data science to provide a valuation you can trust.</p>
                    </div>
                </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
                <div className="w-full h-80 bg-dark-matter/50 border border-gray-800 rounded-xl flex items-center justify-center">
                    <p className="text-stardust-grey">[Visual of DomaScore Astrolabe]</p>
                </div>
            </div>
        </section>

        <section ref={addToScrollRefs} className="w-full max-w-7xl mx-auto py-16 md:py-24 px-6 md:px-8 scroll-animate">
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter">The Genesis Engine: An Asset's Ascent</h2>
                <p className="mt-4 text-lg md:text-xl text-stardust-grey max-w-3xl mx-auto">
                    Our guided, three-step process makes onboarding a digital asset a seamless and rewarding experience. Each step is designed for clarity, security, and speed.
                </p>
            </div>
            <div className="mt-16 grid md:grid-cols-3 gap-4 text-center relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-px">
                    <svg width="100%" height="2" className="text-gray-700">
                        <line x1="0" y1="1" x2="100%" y2="1" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8"/>
                    </svg>
                </div>

                <div className="relative z-10 bg-void-black p-4">
                    <div className="bg-dark-matter border border-gray-800 rounded-xl p-8 h-full flex flex-col">
                        <p className="text-sm font-bold text-celestial-blue">STEP 1/3</p>
                        <h3 className="mt-2 text-xl font-bold text-white">Ownership Verification</h3>
                        <p className="mt-3 text-stardust-grey flex-grow">Prove ownership by adding a simple TXT record to your domain's DNS settings. A golden monospace snippet with a 'Copy to Clipboard' function makes this effortless.</p>
                    </div>
                </div>
                <div className="relative z-10 bg-void-black p-4">
                    <div className="bg-dark-matter border border-gray-800 rounded-xl p-8 h-full flex flex-col">
                        <p className="text-sm font-bold text-celestial-blue">STEP 2/3</p>
                        <h3 className="mt-2 text-xl font-bold text-white">The Apogee Moment</h3>
                        <p className="mt-3 text-stardust-grey flex-grow">Witness the DomaScore AI reveal your asset's valuation through a stunning constellation animation. This is the peak moment where your domain's potential is quantified.</p>
                    </div>
                </div>
                <div className="relative z-10 bg-void-black p-4">
                    <div className="bg-dark-matter border border-gray-800 rounded-xl p-8 h-full flex flex-col">
                        <p className="text-sm font-bold text-celestial-blue">STEP 3/3</p>
                        <h3 className="mt-2 text-xl font-bold text-white">Tokenization & Launch</h3>
                        <p className="mt-3 text-stardust-grey flex-grow">With a secure wallet confirmation, your asset is minted. A 'Launch Successful' screen with star-confetti confirms the birth of your new digital asset, with clear next steps to your portfolio or the exchange.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="exchange" ref={addToScrollRefs} className="w-full max-w-7xl mx-auto py-16 md:py-24 px-6 md:px-8 flex flex-col md:flex-row items-center scroll-animate">
            <div className="md:w-1/2 mt-12 md:mt-0 md:order-2">
                <div className="w-full h-80 bg-dark-matter/50 border border-gray-800 rounded-xl flex items-center justify-center">
                    <p className="text-stardust-grey">[Visual of Z.E.N.I.T.H. Exchange]</p>
                </div>
            </div>
            <div id="constellations" className="md:w-1/2 md:pr-8 md:order-1">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter">The Observatory: A Pro-Grade Exchange</h2>
                <p className="mt-4 text-lg text-stardust-grey">The Z.E.N.I.T.H. Exchange is a zero-latency trading terminal designed for professional traders. It features a candlestick Skychart on a faint star grid, a high-speed Command Module for orders, and our unique "Constellations."</p>
                <div className="mt-8 space-y-4 text-left">
                    <div className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-celestial-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p><span className="font-bold text-white">Wow Factor: Constellations:</span> More than just watchlists, Constellations are AI-curated thematic indices (e.g., Orion-AI-10, eCom-Gems, Geo-Domains). This intelligent grouping provides unique market insights that no other platform offers.</p>
                    </div>
                </div>
            </div>
        </section>

        <section ref={addToScrollRefs} className="w-full max-w-7xl mx-auto py-16 md:py-24 px-6 md:px-8 scroll-animate">
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter">Roadmap to Decentralization</h2>
                <p className="mt-4 text-lg md:text-xl text-stardust-grey max-w-3xl mx-auto">
                    Our mission is to build the future of decentralized finance, one milestone at a time.
                </p>
            </div>
            <div className="mt-16 space-y-12">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/4 text-center md:text-right pr-8">
                        <p className="text-2xl font-bold text-celestial-blue">Q4 2025</p>
                        <p className="text-stardust-grey">Mainnet Activation</p>
                    </div>
                    <div className="md:w-3/4 border-l-2 border-celestial-blue pl-8 py-4">
                        <p className="text-white">Mainnet deployment, Genesis Engine expansion, and automated neural analytics.</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/4 text-center md:text-right pr-8">
                        <p className="text-2xl font-bold text-celestial-blue">Q1 2026</p>
                        <p className="text-stardust-grey">Advanced Derivatives</p>
                    </div>
                    <div className="md:w-3/4 border-l-2 border-celestial-blue pl-8 py-4">
                        <p className="text-white">Futures & perpetual contracts, $ZNTH governance token, and enhanced trading features.</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/4 text-center md:text-right pr-8">
                        <p className="text-2xl font-bold text-celestial-blue">Q2 2026</p>
                        <p className="text-stardust-grey">Decentralized AI Oracle</p>
                    </div>
                    <div className="md:w-3/4 border-l-2 border-celestial-blue pl-8 py-4">
                        <p className="text-white">Validator network, trustless index rebalancing, and community governance.</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/4 text-center md:text-right pr-8">
                        <p className="text-2xl font-bold text-celestial-blue">Q3 2026</p>
                        <p className="text-stardust-grey">Mobile App</p>
                    </div>
                    <div className="md:w-3/4 border-l-2 border-celestial-blue pl-8 py-4">
                        <p className="text-white">Quantum-speed mobile trading, cross-reality portfolio management, and optimized neural interface.</p>
                    </div>
                </div>
            </div>
        </section>

        <section ref={addToScrollRefs} className="w-full max-w-7xl mx-auto py-16 md:py-24 px-6 md:px-8 text-center scroll-animate">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter">System Architecture</h2>
            <p className="mt-4 text-lg md:text-xl text-stardust-grey max-w-3xl mx-auto">
                Z.E.N.I.T.H. is built on a hybrid observatory model, combining the best of Web2 and Web3 technologies for performance, security, and decentralization.
            </p>
            <div className="mt-12 font-data text-sm text-left bg-dark-matter/50 border border-gray-800 rounded-xl p-8 max-w-2xl mx-auto">
                <pre className="whitespace-pre-wrap text-stardust-grey">
{`┌───────────────────────────────────────────┐
│              HYBRID OBSERVATORY           │
├───────────────────────────────────────────┤
│ Frontend (Next.js + Tailwind)             │
│ Backend (Node.js + Express)               │
│ AI Neural Network (Python + TensorFlow)   │
│ Blockchain Layer (Doma Protocol, Solidity)│
└───────────────────────────────────────────┘`}
                </pre>
            </div>
            <div className="mt-8">
                <p className="text-stardust-grey">Powered by real-time data streams from:</p>
                <p className="font-data text-celestial-blue mt-2">SEMrush ◊ Google Trends ◊ X API ◊ Reality Sensors</p>
            </div>
        </section>

        <footer ref={addToScrollRefs} className="p-6 md:p-8 scroll-animate">
            <div className="w-full max-w-7xl mx-auto backdrop-blur-sm bg-black/20 border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-around text-center">

                <div className="p-2 w-full md:w-1/3">
                    <p className="text-xs text-stardust-grey uppercase tracking-widest">ZVI (Zenith Volatility Index)</p>
                    <CountUp end={42.15} />
                </div>

                <div className="h-8 w-px bg-gray-700 hidden md:block"></div>
                <div className="w-full h-px bg-gray-700 md:hidden my-2"></div>

                <div className="p-2 w-full md:w-1/3">
                    <p className="text-xs text-stardust-grey uppercase tracking-widest">TVO (Total Value Onboarded)</p>
                    <CountUp end={1294833.10} prefix="$" />
                </div>

                <div className="h-8 w-px bg-gray-700 hidden md:block"></div>
                <div className="w-full h-px bg-gray-700 md:hidden my-2"></div>

                <div className="p-2 w-full md:w-1/3">
                    <p className="text-xs text-stardust-grey uppercase tracking-widest">24h Volume</p>
                    <CountUp end={271402.55} prefix="$" />
                </div>

            </div>
            <div className="text-center mt-4 text-stardust-grey text-xs">
                Powered by <a href="https://doma.xyz/" target="_blank" rel="noopener noreferrer" className="text-celestial-blue hover:underline">Doma</a>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default MissionControl;
