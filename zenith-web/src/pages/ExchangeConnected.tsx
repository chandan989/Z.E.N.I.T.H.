import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { useCustomCursor } from "@/hooks/useCustomCursor";
import { useContracts } from "@/hooks/useContracts";
import { toast } from "sonner";
import { CONTRACTS } from "@/config/contracts";
import "@/index.css";

const ExchangeConnected = () => {
  const cursorRef = useCustomCursor();
  const { isReady, address, getAllFractionalTokens, getOrderBook, createOrder, approveToken, getTokenBalance } = useContracts();
  
  const [tokens, setTokens] = useState<string[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [orderBook, setOrderBook] = useState<any>({ buyOrders: [], sellOrders: [] });
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  
  // Order form
  const [isBuyOrder, setIsBuyOrder] = useState(true);
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (isReady) {
      loadTokens();
    }
  }, [isReady]);

  useEffect(() => {
    if (selectedToken) {
      loadOrderBook();
    }
  }, [selectedToken]);

  const loadTokens = async () => {
    try {
      const tokenList = await getAllFractionalTokens();
      setTokens(tokenList);
      if (tokenList.length > 0) {
        setSelectedToken(tokenList[0]);
      }
    } catch (error) {
      console.error('Failed to load tokens:', error);
    }
  };

  const loadOrderBook = async () => {
    if (!selectedToken) return;
    
    setLoading(true);
    try {
      const orders = await getOrderBook(selectedToken);
      setOrderBook(orders);
    } catch (error) {
      console.error('Failed to load order book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!amount || !price) {
      toast.error("Please enter amount and price");
      return;
    }

    setCreating(true);
    try {
      // Step 1: Approve tokens if selling (only for sell orders)
      if (!isBuyOrder) {
        toast.info("Approving tokens...");
        await approveToken(selectedToken, CONTRACTS.exchange, amount);
      }
      // For buy orders, ETH is sent directly with the transaction - no approval needed!

      // Step 2: Create order
      toast.info(isBuyOrder ? "Creating buy order (sending ETH)..." : "Creating sell order...");
      await createOrder(selectedToken, isBuyOrder, amount, price);
      
      toast.success("Order created successfully!");
      
      // Reload order book
      await loadOrderBook();
      
      // Clear form
      setAmount("");
      setPrice("");
    } catch (error: any) {
      console.error('Failed to create order:', error);
      toast.error(error.message || "Failed to create order");
    } finally {
      setCreating(false);
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-stardust-grey">Connect your wallet to access the exchange</p>
        </div>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-2">No tokens available yet</p>
          <p className="text-stardust-grey">Tokenize a domain first in the Genesis Engine</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative font-sans antialiased text-sm text-stardust-grey min-h-screen">
      <div ref={cursorRef} className="custom-cursor"></div>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      <div className="relative z-10 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black text-white mb-8">Exchange</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Book */}
            <Card className="lg:col-span-2 p-6 bg-card/50 border-border/50">
              <h2 className="text-xl font-bold text-white mb-4">Order Book</h2>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {/* Buy Orders */}
                  <div>
                    <h3 className="text-sm font-semibold text-green-500 mb-2">Buy Orders</h3>
                    <div className="space-y-1">
                      {orderBook.buyOrders.length === 0 ? (
                        <p className="text-xs text-stardust-grey">No buy orders</p>
                      ) : (
                        orderBook.buyOrders.map((order: any, i: number) => (
                          <div key={i} className="flex justify-between text-xs font-mono">
                            <span className="text-green-500">{parseFloat(order.price).toFixed(2)}</span>
                            <span className="text-white">{parseFloat(order.amount).toFixed(2)}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Sell Orders */}
                  <div>
                    <h3 className="text-sm font-semibold text-red-500 mb-2">Sell Orders</h3>
                    <div className="space-y-1">
                      {orderBook.sellOrders.length === 0 ? (
                        <p className="text-xs text-stardust-grey">No sell orders</p>
                      ) : (
                        orderBook.sellOrders.map((order: any, i: number) => (
                          <div key={i} className="flex justify-between text-xs font-mono">
                            <span className="text-red-500">{parseFloat(order.price).toFixed(2)}</span>
                            <span className="text-white">{parseFloat(order.amount).toFixed(2)}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Trading Panel */}
            <Card className="p-6 bg-card/50 border-border/50">
              <h2 className="text-xl font-bold text-white mb-4">Create Order</h2>

              {/* Token Selection */}
              <div className="mb-4">
                <label className="text-sm text-stardust-grey mb-2 block">Token</label>
                <select
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value)}
                  className="w-full bg-muted/30 border border-border/50 rounded-lg px-3 py-2 text-white"
                >
                  {tokens.map((token) => (
                    <option key={token} value={token}>
                      {token.substring(0, 6)}...{token.substring(38)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buy/Sell Toggle */}
              <Tabs value={isBuyOrder ? "buy" : "sell"} onValueChange={(v) => setIsBuyOrder(v === "buy")} className="mb-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="buy">Buy</TabsTrigger>
                  <TabsTrigger value="sell">Sell</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Amount */}
              <div className="mb-4">
                <label className="text-sm text-stardust-grey mb-2 block">Amount</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-muted/30 border-border/50 text-white"
                />
              </div>

              {/* Price */}
              <div className="mb-6">
                <label className="text-sm text-stardust-grey mb-2 block">Price (per token)</label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="bg-muted/30 border-border/50 text-white"
                />
              </div>

              {/* Total */}
              {amount && price && (
                <div className="mb-4 p-3 bg-muted/20 rounded-lg">
                  <p className="text-xs text-stardust-grey">Total {isBuyOrder ? '(ETH to send)' : '(ETH to receive)'}</p>
                  <p className="text-lg font-bold text-white font-mono">
                    {(parseFloat(amount) * parseFloat(price)).toFixed(4)} ETH
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleCreateOrder}
                disabled={creating || !amount || !price}
                className={`w-full ${isBuyOrder ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  `${isBuyOrder ? 'Buy' : 'Sell'} ${amount || '0'} tokens`
                )}
              </Button>

              <p className="text-xs text-stardust-grey mt-4 text-center">
                Orders are settled on Doma Protocol
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeConnected;
