import { useCustomCursor } from "@/hooks/useCustomCursor";
import { useContracts } from "@/hooks/useContracts";
import "@/index.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, TrendingUp, Wallet, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

const mockPortfolio = [
  { domain: "crypto.com", ticker: "CRYPTO", shares: 125, value: "$30,687.50", pl24h: "+$1,245.30", plPercent: "+4.2%", domaScore: 94, isUp: true },
  { domain: "defi.org", ticker: "DEFI", shares: 280, value: "$25,004.00", pl24h: "+$892.15", plPercent: "+3.7%", domaScore: 87, isUp: true },
  { domain: "blockchain.io", ticker: "CHAIN", shares: 95, value: "$14,886.50", pl24h: "-$315.40", plPercent: "-2.1%", domaScore: 91, isUp: false },
];

const Constellation = () => {
  const cursorRef = useCustomCursor();
  const navigate = useNavigate();
  const { isReady, address, getAllFractionalTokens, getTokenBalance } = useContracts();
  const [portfolio, setPortfolio] = useState(mockPortfolio);
  const [loading, setLoading] = useState(false);
  const totalValue = "$70,578.00";
  const total24hPL = "+2.7%";

  useEffect(() => {
    if (isReady && address) {
      loadPortfolio();
    }
  }, [isReady, address]);

  const loadPortfolio = async () => {
    setLoading(true);
    try {
      const tokens = await getAllFractionalTokens();
      const portfolioData = await Promise.all(
        tokens.map(async (tokenAddress: string) => {
          const balance = await getTokenBalance(tokenAddress, address!);
          // For now, use mock data but with real balance
          return {
            domain: "domain.com",
            ticker: "DOM",
            shares: parseFloat(balance),
            value: "$0.00",
            pl24h: "$0.00",
            plPercent: "0%",
            domaScore: 85,
            isUp: true,
            tokenAddress
          };
        })
      );
      if (portfolioData.length > 0) {
        setPortfolio(portfolioData);
      }
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (domain: string) => {
    navigate(`/stellar/crypto.com`);
  };

  return (
    <div className="relative font-sans antialiased text-sm md:text-base text-stardust-grey">
      <div ref={cursorRef} className="custom-cursor"></div>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      <div className="relative z-10 min-h-screen bg-transparent py-12">
        <div className="container px-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="text-center mb-8">
                <h1 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                    My Constellation
                </h1>
                <p className="text-lg md:text-xl text-stardust-grey mt-4 max-w-2xl mx-auto">
                    Track and manage your tokenized domain assets.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricBadge icon={<Wallet className="h-5 w-5 text-primary"/>} label="Total Value" value={totalValue} />
              <MetricBadge icon={<TrendingUp className="h-5 w-5 text-primary"/>} label="24h Change" value={total24hPL} />
              <MetricBadge icon={<Wallet className="h-5 w-5 text-primary"/>} label="Assets Owned" value={mockPortfolio.length.toString()} />
            </div>
          </div>

          <div className="space-y-6">
            {mockPortfolio.map((asset) => (
              <Card key={asset.ticker} className="p-6 bg-card/50 border-border/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div>
                    <p className="font-bold text-2xl text-white">{asset.domain}</p>
                    <p className="text-sm text-stardust-grey font-mono">{asset.ticker}</p>
                  </div>
                  <Button 
                    onClick={() => handleViewReport(asset.domain)}
                    variant="outline"
                    className="mt-4 sm:mt-0 bg-transparent border-primary/30 text-primary h-10 px-6 rounded-lg text-base hover:bg-primary/10 hover:text-primary">
                    View Stellar Report
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                
                <div className="border-t border-border/50 my-4"></div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
                  <DataPoint label="Value" value={asset.value} />
                  <DataPoint label="Shares" value={asset.shares.toString()} />
                  <DataPoint label="Doma Score" value={asset.domaScore.toString()} />
                  <div>
                    <p className="text-sm text-stardust-grey mb-2">24h P/L</p>
                    <p className={`text-lg font-semibold font-mono ${asset.isUp ? "text-supernova-green" : "text-red-giant"}`}>{asset.plPercent}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricBadge = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <p className="text-sm text-stardust-grey">{label}</p>
      </div>
      <p className="text-2xl font-bold font-mono text-white">{value}</p>
    </div>
  );
  
  const DataPoint = ({ label, value }: { label: string; value: string }) => (
    <div>
      <p className="text-sm text-stardust-grey mb-2">{label}</p>
      <p className="text-lg font-semibold font-mono text-white">{value}</p>
    </div>
  );

export default Constellation;
