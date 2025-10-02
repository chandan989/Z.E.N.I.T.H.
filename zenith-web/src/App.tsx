import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MissionControl from "./pages/MissionControl";
import GenesisEngine from "./pages/GenesisEngine";
import Exchange from "./pages/Exchange.tsx";
import Constellation from "./pages/Constellation";
import StellarReport from "./pages/StellarReport";
import NotFound from "./pages/NotFound";
import { useCustomCursor } from "./hooks/useCustomCursor";
import { WalletProvider } from "./contexts/WalletContext";

const queryClient = new QueryClient();

const App = () => {
  const cursorRef = useCustomCursor();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <WalletProvider>
          <BrowserRouter>
            <div className="min-h-screen">
              <div ref={cursorRef} className="custom-cursor"></div>
              <Header />
              <Routes>
                <Route path="/" element={<MissionControl />} />
                <Route path="/genesis" element={<GenesisEngine />} />
                <Route path="/exchange" element={<Exchange />} />
                <Route path="/constellation" element={<Constellation />} />
                <Route path="/stellar/:domain" element={<StellarReport />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </WalletProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
