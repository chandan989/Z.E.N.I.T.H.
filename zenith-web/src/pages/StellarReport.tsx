import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Users, Lock, ExternalLink, Sparkles } from "lucide-react";
import { useCustomCursor } from "@/hooks/useCustomCursor";
import "@/index.css";

const StellarReport = () => {
  const { domain } = useParams();
  const cursorRef = useCustomCursor();

  // Mock data
  const asset = {
    domain: "crypto.com",
    ticker: "CRYPTO",
    domaScore: 940,
    price: "$245.50",
    marketCap: "$122.8M",
    volume24h: "$1.2M",
    liquidity: "High",
    totalSupply: "500,000",
    holders: "1,247",
    seoAuthority: 92,
    trafficEstimate: 88,
    brandability: 96,
    tldRarity: 85,
    contractAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    mintDate: "2025-09-15",
    txHash: "0x8a9b...",
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
          <div className="mb-8">
            <div className="text-center mb-10">
              <h1 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                {asset.domain}
              </h1>
              <div className="flex items-center justify-center gap-3 mt-4">
                <span className="font-mono text-lg text-stardust-grey">{asset.ticker}</span>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  Active
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-9">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <MetricBadge label="Current Price" value={asset.price} />
                        <MetricBadge label="Market Cap" value={asset.marketCap} />
                        <MetricBadge label="24h Volume" value={asset.volume24h} />
                        <MetricBadge label="Liquidity" value={asset.liquidity} />
                    </div>
                </div>
                <div className="lg:col-span-3 flex justify-center lg:justify-end">
                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50 w-full">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-stardust-grey">DomaScore</span>
                            <span className="text-xl font-bold font-mono text-white">{asset.domaScore}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-gradient-cosmic transition-all"
                                style={{ width: `${asset.domaScore / 10}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Market Data */}
              <Card className="p-6 bg-card/50 border-border/50 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                  <DollarSign className="h-6 w-6 text-primary" />
                  Market Data
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <DataPoint label="Floor Price" value={asset.price} />
                  <DataPoint label="24h Volume" value={asset.volume24h} />
                  <DataPoint label="Market Cap" value={asset.marketCap} />
                  <DataPoint label="Liquidity Status" value={asset.liquidity} />
                </div>
              </Card>

              {/* Tokenomics */}
              <Card className="p-6 bg-card/50 border-border/50 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                  <Users className="h-6 w-6 text-primary" />
                  Tokenomics
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <DataPoint label="Total Supply" value={`${asset.totalSupply} shares`} />
                  <DataPoint label="Holders" value={asset.holders} />
                  <DataPoint label="Ownership Model" value="Fractionalized" />
                  <DataPoint label="Trading Status" value="Active" />
                </div>
              </Card>

              {/* Valuation Breakdown */}
              <Card className="p-6 bg-card/50 border-border/50 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Valuation Breakdown
                </h2>
                <div className="space-y-4">
                  <ValuationBar label="SEO Authority" value={asset.seoAuthority} />
                  <ValuationBar label="Traffic Estimate" value={asset.trafficEstimate} />
                  <ValuationBar label="Brandability" value={asset.brandability} />
                  <ValuationBar label="TLD Rarity" value={asset.tldRarity} />
                </div>
              </Card>

              {/* On-Chain Data */}
              <Card className="p-6 bg-card/50 border-border/50 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                  <Lock className="h-6 w-6 text-primary" />
                  On-Chain Data
                </h2>
                <div className="space-y-4">
                  <OnChainData label="Contract Address" value={asset.contractAddress} />
                  <OnChainData label="Mint Date" value={asset.mintDate} />
                  <OnChainData label="Transaction Hash" value={asset.txHash} hasLink />
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Insights */}
              <Card className="p-6 bg-card/50 border-border/50 backdrop-blur-sm">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                  <Sparkles className="h-5 w-5 text-secondary" />
                  AI Insights
                </h2>
                <div className="space-y-4">
                  <InsightCard
                    title="Trend Forecast"
                    content="Strong upward momentum expected based on increasing search volume and social mentions."
                    sentiment="positive"
                  />
                  <InsightCard
                    title="Valuation Comparison"
                    content="Trading 15% above similar premium .com domains in the finance sector."
                    sentiment="neutral"
                  />
                  <InsightCard
                    title="Risk Assessment"
                    content="Low volatility with stable holder base. Liquidity depth supports large trades."
                    sentiment="positive"
                  />
                </div>
              </Card>

              {/* Sentiment Nebula */}
              <Card className="p-6 bg-card/50 border-border/50 backdrop-blur-sm">
                <h2 className="text-xl font-bold mb-4 text-white">Sentiment Nebula</h2>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 flex items-center justify-center animate-pulse-glow">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">Bullish</div>
                    <div className="text-sm text-stardust-grey">Market Sentiment</div>
                  </div>
                </div>
                <p className="text-sm text-stardust-grey mt-4 text-center">
                  Real-time sentiment analysis from social media and trading activity
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
    <p className="text-sm text-stardust-grey mb-1">{label}</p>
    <p className="text-xl font-bold font-mono text-white">{value}</p>
  </div>
);

const DataPoint = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm text-stardust-grey mb-2">{label}</p>
    <p className="text-lg font-semibold font-mono text-white">{value}</p>
  </div>
);

const ValuationBar = ({ label, value }: { label: string; value: number }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-white">{label}</span>
      <span className="text-sm font-mono font-semibold text-primary">{value}</span>
    </div>
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-cosmic transition-all"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

const OnChainData = ({ label, value, hasLink }: { label: string; value: string; hasLink?: boolean }) => (
  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
    <div>
      <p className="text-sm text-stardust-grey mb-1">{label}</p>
      <p className="font-mono text-sm text-white">{value}</p>
    </div>
    {hasLink && (
      <ExternalLink className="h-4 w-4 text-stardust-grey hover:text-primary cursor-pointer transition-colors" />
    )}
  </div>
);

const InsightCard = ({ title, content, sentiment }: { title: string; content: string; sentiment: "positive" | "neutral" | "negative" }) => (
  <div className={`p-4 rounded-lg border ${
    sentiment === "positive" ? "bg-primary/5 border-primary/30" :
    sentiment === "negative" ? "bg-destructive/5 border-destructive/30" :
    "bg-muted/30 border-border/50"
  }`}>
    <h4 className="font-semibold text-sm mb-2 text-white">{title}</h4>
    <p className="text-sm text-stardust-grey leading-relaxed">{content}</p>
  </div>
);

export default StellarReport;
