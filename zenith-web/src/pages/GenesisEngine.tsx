import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Check, Copy, Loader2, TrendingUp, FileText, Settings2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import StepIndicator from '@/components/StepIndicator';
import Astrolabe from '@/components/Astrolabe';
import { useCustomCursor } from "@/hooks/useCustomCursor";
import '@/index.css';
import SolarSystemAnimation from '@/components/SolarSystemAnimation';

interface ValuationData {
  domaScore: number;
  dollarValue: number;
  breakdown: { [key: string]: number };
}

const GenesisEngine = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [domain, setDomain] = useState(searchParams.get('domain') || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isValuating, setIsValuating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [valuation, setValuation] = useState<ValuationData | null>(null);
  const [tokenTicker, setTokenTicker] = useState('');
  const [tokenSupply, setTokenSupply] = useState(0);
  const [verificationError, setVerificationError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showConfirmButtons, setShowConfirmButtons] = useState(false);
  const cursorRef = useCustomCursor();

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) {
      toast.error("Please enter a domain to begin.");
      return;
    }
    const randomHex = [...Array(32)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('');
    setVerificationCode(`zenith-verify=0x${randomHex}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(verificationCode);
    setCopied(true);
    toast.success('TXT record copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartVerification = async () => {
    setIsVerifying(true);
    setVerificationError('');
    setTimeout(() => {
      setIsVerifying(false);
      setIsValuating(true);
      setTimeout(() => {
        const mockScore = Math.floor(600 + Math.random() * 350);
        const mockValue = Math.round((mockScore / 1000) * (5000 + Math.random() * 20000));
        setValuation({
          domaScore: mockScore,
          dollarValue: mockValue,
          breakdown: {
            'SEO Authority': 0.4,
            'Traffic Estimate': 0.3,
            'Brandability': 0.2,
            'TLD Rarity': 0.1,
          },
        });
        setTokenTicker(domain.split('.')[0].substring(0, 5).toUpperCase());
        setTokenSupply(mockValue);
        setIsValuating(false);
        setStep(2);
      }, 3000);
    }, 2000);
  };

  const handleConfirmMint = async () => {
    setIsMinting(true);
    try {
      // Import the contract function
      const { requestOnboarding } = await import('@/lib/contracts');
      
      toast.info('Sending transaction to Doma Protocol...');
      
      // Call the smart contract
      const receipt = await requestOnboarding(
        domain,
        `${domain.split('.')[0]} Token`,
        tokenTicker,
        tokenSupply.toString(),
        valuation?.domaScore || 850
      );
      
      console.log('Transaction successful:', receipt.hash);
      toast.success('Onboarding request submitted! Processing...');
      
      // Wait a bit for auto-fulfill (in demo with auto-fulfill bot)
      setTimeout(() => {
        toast.success('Domain tokenized successfully!');
        setIsMinting(false);
        setStep(4);
      }, 3000);
      
    } catch (error: any) {
      console.error('Transaction failed:', error);
      toast.error(error.message || 'Transaction failed');
      setIsMinting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        if (isValuating) return <LoadingSpinner text="Calculating Apogee... Analyzing stellar metrics..." />;
        return (
          <div className="w-full max-w-2xl mx-auto">
            {!verificationCode ? (
              <form onSubmit={handleVerificationSubmit} className="group w-full">
                <div className="relative flex items-center bg-card/50 border-border/50 backdrop-blur-sm rounded-xl transition-all duration-300 glow-cosmic-focus">
                  <Input
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    type="text"
                    placeholder="Enter your domain to begin its ascent"
                    className="w-full h-16 bg-transparent text-white placeholder-stardust-grey pl-6 pr-40 text-lg outline-none rounded-xl border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    required
                  />
                  <Button
                    type="submit"
                    className="absolute right-3 flex items-center justify-center bg-primary text-white font-bold h-12 px-6 rounded-lg text-base transform transition-all duration-300 group-hover:scale-105"
                  >
                    Verify
                  </Button>
                </div>
              </form>
            ) : (
              <Card className="p-6 bg-card/50 border-border/50 backdrop-blur-sm text-left">
                 <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                  <FileText className="h-6 w-6 text-primary" />
                  Ownership Verification
                </h2>
                <p className="text-stardust-grey mb-4">
                  To prove you own <span className="text-white font-bold">{domain}</span>, add the following TXT record to your DNS settings.
                </p>
                <div className="bg-muted/30 p-4 rounded-lg font-mono text-primary relative pr-14 border border-border/50">
                  {verificationCode}
                  <Button
                    onClick={handleCopy}
                    size="icon"
                    variant="ghost"
                    className="absolute top-1/2 -translate-y-1/2 right-2"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-secondary" />
                    ) : (
                      <Copy className="w-5 h-5 text-primary hover:text-white transition-colors" />
                    )}
                  </Button>
                </div>
                {verificationError && <p className="text-destructive text-sm mt-4">{verificationError}</p>}
                <Button
                  onClick={handleStartVerification}
                  disabled={isVerifying}
                  className="mt-6 w-full h-12 bg-primary text-white font-bold rounded-lg flex items-center justify-center transition-opacity hover:opacity-90 disabled:opacity-75"
                >
                  {isVerifying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scanning...</> : 'Begin Scan'}
                </Button>
              </Card>
            )}
          </div>
        );
      case 2:
        return (
          <div className="w-full max-w-4xl mx-auto">
            <Card className="p-6 bg-card/50 border-border/50 backdrop-blur-sm">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-1 flex flex-col items-center text-center">
                    <p className="text-sm text-stardust-grey mb-3">DomaScore</p>
                    <Astrolabe score={valuation?.domaScore} size="small" />
                    <p className="mt-4 text-3xl text-white font-bold">${valuation?.dollarValue.toLocaleString()}</p>
                    <p className="text-stardust-grey">Estimated Market Value</p>
                </div>
                <div className="lg:col-span-2 w-full text-left">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    Valuation Constellation
                  </h2>
                  <div className="space-y-4">
                    {valuation && valuation.breakdown && Object.entries(valuation.breakdown).map(([key, value]) => (
                      <ValuationBar key={key} label={key} value={Math.round(valuation.dollarValue * value)} percentage={value * 100} />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            <Button
              onClick={() => setStep(3)}
              className="mt-8 w-full max-w-sm mx-auto h-12 bg-primary text-white font-bold rounded-lg flex items-center justify-center transition-opacity hover:opacity-90"
            >
              Initiate Tokenization
            </Button>
          </div>
        );
      case 3:
        if (isMinting) return <LoadingSpinner text="Transmitting to Doma Protocol... Finalizing Genesis..." />;
        return (
          <div className="w-full max-w-2xl mx-auto">
            <Card className="p-6 bg-card/50 border-border/50 backdrop-blur-sm text-left">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                <Settings2 className="h-6 w-6 text-primary" />
                Tokenization & Fractionalization
              </h2>
              <div className="space-y-6">
                <DataPoint label="Asset" value={domain} />
                <div>
                  <p className="text-sm text-stardust-grey mb-2">Token Ticker</p>
                  <Input
                    value={tokenTicker}
                    onChange={(e) => setTokenTicker(e.target.value.toUpperCase())}
                    type="text"
                    maxLength={5}
                    className="w-full h-12 bg-muted/30 border-border/50 rounded-lg text-white font-mono text-lg px-4 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <p className="text-sm text-stardust-grey mb-2">Total Supply</p>
                  <Input
                    value={tokenSupply}
                    onChange={(e) => setTokenSupply(Number(e.target.value))}
                    type="number"
                    className="w-full h-12 bg-muted/30 border-border/50 rounded-lg text-white font-mono text-lg px-4 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mt-4">
                  <p className="text-sm text-white font-semibold mb-2">📦 What happens next:</p>
                  <ul className="text-xs text-stardust-grey space-y-1">
                    <li>• <span className="text-white">NFT Minted:</span> Your domain becomes an ERC-721 token (ownership proof)</li>
                    <li>• <span className="text-white">Fractionalized:</span> NFT locked in vault, {tokenSupply.toLocaleString()} ${tokenTicker} shares created</li>
                    <li>• <span className="text-white">Tradeable:</span> Shares can be traded on the Exchange for liquidity</li>
                    <li>• <span className="text-white">Redeemable:</span> Collect all shares to unlock the original NFT</li>
                  </ul>
                </div>
              </div>
            </Card>
            {showConfirmButtons ? (
              <div className="mt-8 flex gap-4 w-full max-w-sm mx-auto">
                <Button
                  onClick={() => setShowConfirmButtons(false)}
                  variant="outline"
                  className="w-full h-12 font-bold rounded-lg border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmMint}
                  className="w-full h-12 bg-primary text-white font-bold rounded-lg transition-opacity hover:opacity-90"
                >
                  Confirm
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setShowConfirmButtons(true)}
                className="mt-8 w-full max-w-sm mx-auto h-12 bg-primary text-white font-bold rounded-lg flex items-center justify-center transition-opacity hover:opacity-90"
              >
                Confirm & Mint on Doma
              </Button>
            )}
          </div>
        );
      case 4:
        return (
          <Card className="p-8 bg-card/50 border-border/50 backdrop-blur-sm text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-secondary/20 flex items-center justify-center border-4 border-secondary/50">
              <CheckCircle2 className="w-10 h-10 text-secondary" />
            </div>
            <h2 className="text-3xl font-bold text-white mt-6">Launch Successful</h2>
            <p className="text-stardust-grey mt-2">{domain} is now a liquid asset on the Doma Protocol.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button variant="outline" className="h-12 px-6 font-bold rounded-lg border-primary/30 text-primary hover:bg-primary/10 hover:text-primary" onClick={() => navigate(`/constellation`)}>View Portfolio</Button>
              <Button className="h-12 px-6 bg-primary text-white font-bold rounded-lg transition-opacity hover:opacity-90" onClick={() => navigate('/exchange')}>Go to Exchange</Button>
            </div>
          </Card>
        );
      default:
        return <div>Error: Unknown step</div>;
    }
  };

  return (
    <div className="relative font-sans antialiased text-sm md:text-base text-stardust-grey min-h-[80vh]">
      <div ref={cursorRef} className="custom-cursor"></div>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      <main className="relative z-10 flex items-center justify-center min-h-[80vh] py-12">
          <div className="w-full max-w-4xl flex flex-col items-center px-8">
              <div className="text-center mb-8">
                  <h1 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                      Genesis Engine
                  </h1>
                  <p className="text-lg md:text-xl text-stardust-grey mt-4 max-w-2xl mx-auto">
                      A Structured Ascent: from asset to liquid tradable instrument.
                  </p>
              </div>
              <div className="w-full">
                  <StepIndicator currentStep={step} />
                  <div className="mt-6">{renderStepContent()}</div>
              </div>
          </div>
      </main>
    </div>
  );
};

const LoadingSpinner = ({ text }: { text: string }) => (
    <div className="py-16 text-center space-y-8 flex flex-col items-center justify-center min-h-[400px]">
        <SolarSystemAnimation />
        <p className="text-xl text-stardust-grey animate-pulse">{text}</p>
    </div>
);

const DataPoint = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm text-stardust-grey mb-2">{label}</p>
    <p className="text-lg font-semibold font-mono text-white">{value}</p>
  </div>
);

const ValuationBar = ({ label, value, percentage }: { label: string; value: number, percentage: number }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-white">{label}</span>
      <span className="text-sm font-mono font-semibold text-primary">${value.toLocaleString()}</span>
    </div>
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-cosmic transition-all"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);

export default GenesisEngine;
