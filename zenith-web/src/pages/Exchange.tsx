
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, TrendingUp, TrendingDown, Star, ChevronDown, BarChart3, Maximize2, Building2, BookOpen, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useCustomCursor } from "@/hooks/useCustomCursor";
import AdvancedCandlestickChart from "@/components/AdvancedCandlestickChart";
import "@/index.css";

const mockAssets = [
  { domain: "crypto.com", ticker: "CRYPTO", price: "$245.50", change: "+5.2%", volume: "$1.2M", isUp: true, domaScore: 94 },
  { domain: "defi.org", ticker: "DEFI", price: "$89.30", change: "+3.8%", volume: "$450K", isUp: true, domaScore: 87 },
  { domain: "blockchain.io", ticker: "CHAIN", price: "$156.70", change: "-2.1%", volume: "$780K", isUp: false, domaScore: 91 },
  { domain: "nft.art", ticker: "NFTART", price: "$42.15", change: "+12.4%", volume: "$920K", isUp: true, domaScore: 78 },
  { domain: "web3.tech", ticker: "WEB3", price: "$112.80", change: "+7.6%", volume: "$650K", isUp: true, domaScore: 82 },
];

const mockOrderBook = {
  bids: [
    { price: "245.50", amount: "125.3", total: "30,748" },
    { price: "245.48", amount: "89.7", total: "22,019" },
    { price: "245.45", amount: "203.1", total: "49,850" },
    { price: "245.42", amount: "156.8", total: "38,490" },
    { price: "245.40", amount: "94.2", total: "23,117" },
  ],
  asks: [
    { price: "245.52", amount: "98.4", total: "24,159" },
    { price: "245.55", amount: "142.7", total: "35,024" },
    { price: "245.58", amount: "76.3", total: "18,738" },
    { price: "245.60", amount: "189.5", total: "46,535" },
    { price: "245.63", amount: "123.8", total: "30,409" },
  ],
};

const MetricBadge = ({ label, value }: { label: string; value: string }) => (
    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
      <p className="text-sm text-stardust-grey mb-1">{label}</p>
      <p className="text-xl font-bold font-mono text-white">{value}</p>
    </div>
);

const Exchange = () => {
  const [selectedAsset, setSelectedAsset] = useState(mockAssets[0]);
  const [orderType, setOrderType] = useState<"market" | "limit" | "stop">("market");
  const [orderSize, setOrderSize] = useState([50]);
  const cursorRef = useCustomCursor();

  return (
    <div className="relative font-sans antialiased text-sm md:text-base text-stardust-grey">
      <div ref={cursorRef} className="custom-cursor"></div>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      <div className="relative z-10 min-h-screen bg-transparent py-12">
        <div className="container px-8 max-w-[2000px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column - Asset Navigator */}
            <div className="lg:col-span-3">
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm sticky top-12">
                <div className="p-6 border-b border-border/50">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                    <BarChart3 className="h-6 w-6 text-primary" />
                    Asset Navigator
                  </h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search assets..." className="pl-10 bg-muted/30 border-border/50" />
                  </div>
                </div>
                <Tabs defaultValue="all" className="px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-2 bg-muted/30">
                    <TabsTrigger value="all">All Assets</TabsTrigger>
                    <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="p-6 space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                  {mockAssets.map((asset) => (
                    <button key={asset.ticker} onClick={() => setSelectedAsset(asset)} className={`w-full p-3 rounded-lg text-left transition-all group ${
                        selectedAsset.ticker === asset.ticker
                          ? "bg-primary/10 border-2 border-primary/50 shadow-lg"
                          : "bg-muted/20 hover:bg-muted/40 border-2 border-transparent hover:border-border/50"
                      }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{asset.ticker}</span>
                            <Badge variant="outline" className="text-xs px-1.5 py-0 border-primary/30 text-primary">{asset.domaScore}</Badge>
                          </div>
                          <p className="text-xs text-stardust-grey mt-0.5">{asset.domain}</p>
                        </div>
                        {asset.isUp ? <TrendingUp className="h-4 w-4 text-primary" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold font-mono text-white">{asset.price}</span>
                        <span className={`text-sm font-mono font-semibold ${asset.isUp ? "text-primary" : "text-destructive"}`}>{asset.change}</span>
                      </div>
                      <p className="text-xs text-stardust-grey mt-1 font-mono">Vol: {asset.volume}</p>
                    </button>
                  ))}
                </div>
                {/*<div className="p-6 border-t border-border/50">*/}
                {/*  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">*/}
                {/*    <Star className="h-5 w-5 text-secondary" />*/}
                {/*    Constellations*/}
                {/*  </h3>*/}
                {/*  <div className="space-y-2">*/}
                {/*    <ConstellationTag name="DeFi Pulse" count={12} />*/}
                {/*    <ConstellationTag name="Orion-AI-10" count={10} />*/}
                {/*    <ConstellationTag name="Web3 Leaders" count={15} />*/}
                {/*  </div>*/}
                {/*</div>*/}
              </Card>
            </div>

            {/* Right Column - Main Content */}
            <div className="lg:col-span-9 space-y-8">
              {/* Asset Header */}
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <h1 className="text-5xl font-bold text-white tracking-tighter">{selectedAsset.domain}</h1>
                        <Badge className="bg-primary/10 text-primary border-primary/30 font-mono text-xl px-4 py-2">{selectedAsset.ticker}</Badge>
                      </div>
                      <p className="text-base text-stardust-grey font-mono">DomaScore: {selectedAsset.domaScore}/100</p>
                    </div>
                    <Button variant="outline" size="icon" className="border-border/50 bg-muted/30 hover:bg-muted/50 w-12 h-12">
                      <Star className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                    <MetricBadge label="Price" value={selectedAsset.price} />
                    <MetricBadge label="24h Change" value={selectedAsset.change} />
                    <MetricBadge label="24h Volume" value={selectedAsset.volume} />
                    <MetricBadge label="Market Cap" value="$122.8M" />
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                  {/* Chart */}
                  <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                    <div className="p-4 border-b border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {["1H", "4H", "1D", "1W", "1M", "3M"].map((tf) => (
                            <Button key={tf} variant="ghost" size="sm" className="font-mono text-xs h-8 px-3 hover:bg-primary/10 hover:text-primary text-stardust-grey">{tf}</Button>
                          ))}
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="font-mono text-xs h-8 px-3 hover:bg-primary/10 hover:text-primary text-stardust-grey">Indicators</Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-stardust-grey hover:text-primary"><Maximize2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </div>
                    <div className="aspect-[16/9] bg-gradient-to-br from-muted/20 via-transparent to-muted/20 star-grid relative overflow-hidden">
                      <AdvancedCandlestickChart />
                    </div>
                  </Card>

                  <div className="grid grid-cols-2 gap-8">
                    {/* Order Book */}
                    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                      <div className="p-6 border-b border-border/50">
                        <h3 className="text-2xl font-bold flex items-center gap-2 text-white"><BookOpen className="h-6 w-6 text-primary"/>Order Book</h3>
                      </div>
                      <div className="p-2">
                        <div className="mb-4">
                          {mockOrderBook.asks.reverse().map((ask, i) => <OrderBookRow key={i} price={ask.price} amount={ask.amount} total={ask.total} type="ask" />)}
                        </div>
                        <div className="py-2 px-3 bg-muted/30 rounded-lg mb-4 text-center border border-border/50">
                          <p className="text-xs text-stardust-grey mb-1">Spread</p>
                          <p className="text-sm font-mono font-bold text-secondary">$0.02 (0.01%)</p>
                        </div>
                        <div>
                          {mockOrderBook.bids.map((bid, i) => <OrderBookRow key={i} price={bid.price} amount={bid.amount} total={bid.total} type="bid" />)}
                        </div>
                      </div>
                    </Card>

                    {/* Recent Trades */}
                    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                      <div className="p-6 border-b border-border/50">
                        <h3 className="text-2xl font-bold flex items-center gap-2 text-white"><History className="h-6 w-6 text-primary"/>Recent Trades</h3>
                      </div>
                      <div className="p-2">
                        <div className="grid grid-cols-3 gap-2 px-2 py-1 text-xs text-stardust-grey font-medium border-b border-border/30">
                          <span>Price</span>
                          <span className="text-right">Amount</span>
                          <span className="text-right">Time</span>
                        </div>
                        <div className="space-y-0.5 mt-1">
                          <TradeRow price="$245.52" amount="12.5" time="14:32:11" isBuy />
                          <TradeRow price="$245.48" amount="8.3" time="14:32:08" isBuy={false} />
                          <TradeRow price="$245.50" amount="15.7" time="14:32:05" isBuy />
                          <TradeRow price="$245.45" amount="6.2" time="14:32:02" isBuy={false} />
                          <TradeRow price="$245.47" amount="22.4" time="14:31:58" isBuy />
                          <TradeRow price="$245.43" amount="11.9" time="14:31:55" isBuy={false} />
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
                
                {/* Trading Terminal */}
                <div className="xl:col-span-1">
                  <Card className="bg-card/50 border-border/50 backdrop-blur-sm sticky top-12">
                    <div className="p-6 border-b border-border/50">
                      <h3 className="text-2xl font-bold flex items-center gap-2 text-white"><Building2 className="h-6 w-6 text-primary"/>Command Module</h3>
                    </div>
                    <div className="p-6 space-y-6">
                      <Tabs value={orderType} onValueChange={(v) => setOrderType(v as any)}>
                        <TabsList className="grid w-full grid-cols-3 bg-muted/30">
                          <TabsTrigger value="market" className="text-xs">Market</TabsTrigger>
                          <TabsTrigger value="limit" className="text-xs">Limit</TabsTrigger>
                          <TabsTrigger value="stop" className="text-xs">Stop</TabsTrigger>
                        </TabsList>
                      </Tabs>
                      <div className="space-y-4">
                        {orderType !== "market" && (
                          <div>
                            <label className="text-xs font-medium text-stardust-grey mb-2 block">Limit Price</label>
                            <div className="relative">
                              <Input type="number" placeholder="0.00" className="font-mono bg-muted/30 border-border/50 pr-12 text-white" />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-stardust-grey font-mono">USD</span>
                            </div>
                          </div>
                        )}
                        <div>
                          <label className="text-xs font-medium text-stardust-grey mb-2 block">Amount</label>
                          <div className="relative">
                            <Input type="number" placeholder="0.00" className="font-mono bg-muted/30 border-border/50 pr-12 text-white" />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-stardust-grey font-mono">{selectedAsset.ticker}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-stardust-grey">Order Size</label>
                            <span className="text-xs font-mono font-semibold text-primary">{orderSize[0]}%</span>
                          </div>
                          <Slider value={orderSize} onValueChange={setOrderSize} max={100} step={25} className="mb-2" />
                          <div className="flex gap-2">
                            {[25, 50, 75, 100].map((pct) => (
                              <Button key={pct} variant="outline" size="sm" onClick={() => setOrderSize([pct])} className="flex-1 text-xs h-8 border-border/50 bg-muted/30 hover:bg-primary/10 hover:border-primary/30 text-stardust-grey">{pct}%</Button>
                            ))}
                          </div>
                        </div>
                        <div className="pt-2 space-y-2 border-t border-border/50">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-stardust-grey">Available Balance</span>
                            <span className="font-mono font-semibold text-white">$50,000.00</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-stardust-grey">Total</span>
                            <span className="font-mono font-semibold text-white">~$12,275.00</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <Button className="bg-primary hover:bg-primary/90 font-semibold h-12 text-background text-base">Buy {selectedAsset.ticker}</Button>
                        <Button variant="destructive" className="font-semibold h-12 text-base">Sell {selectedAsset.ticker}</Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConstellationTag = ({ name, count }: { name: string; count: number }) => (
  <button className="w-full p-2.5 rounded-lg bg-secondary/5 border border-secondary/20 hover:bg-secondary/10 hover:border-secondary/30 transition-all text-left group">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-white group-hover:text-secondary transition-colors">{name}</span>
      <span className="text-xs font-mono text-stardust-grey bg-muted/30 px-2 py-0.5 rounded">{count}</span>
    </div>
  </button>
);

const OrderBookRow = ({ price, amount, total, type }: { price: string; amount: string; total: string; type: "bid" | "ask" }) => (
    <div className={`grid grid-cols-3 gap-2 px-2 py-1 text-xs font-mono relative group cursor-pointer ${
      type === "bid" ? "hover:bg-primary/5" : "hover:bg-destructive/5"
    }`}>
      <div className={`absolute inset-y-0 left-0 ${type === "bid" ? "bg-primary/10" : "bg-destructive/10"}`} style={{ width: "40%" }}></div>
      <span className={`relative z-10 ${type === "bid" ? "text-primary" : "text-destructive"} font-semibold`}>{price}</span>
      <span className="relative z-10 text-right text-white/90">{amount}</span>
      <span className="relative z-10 text-right text-stardust-grey">{total}</span>
    </div>
);
  
const TradeRow = ({ price, amount, time, isBuy }: { price: string; amount: string; time: string; isBuy: boolean }) => (
  <div className="grid grid-cols-3 gap-2 px-2 py-1.5 text-xs font-mono hover:bg-muted/20 rounded transition-colors">
    <span className={`font-semibold ${isBuy ? "text-primary" : "text-destructive"}`}>{price}</span>
    <span className="text-right text-white/80">{amount}</span>
    <span className="text-right text-stardust-grey">{time}</span>
  </div>
);

export default Exchange;
