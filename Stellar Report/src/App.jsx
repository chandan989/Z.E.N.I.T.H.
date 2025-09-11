import { useState } from 'react';
import './pages/StellarReport.css';
import StellarReport from "./pages/StellarReport";
import Constellations from "./pages/Constellations";
import Dashboard from './pages/Dashboard';
import ConstellationDetail from './pages/ConstellationDetail';

function App() {
  const [page, setPage] = useState('dashboard');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedConstellation, setSelectedConstellation] = useState(null);

  const navigate = (page, data = null) => {
    setPage(page);
    if (page === 'report') {
      setSelectedAsset(data);
    } else if (page === 'constellationDetail') {
      setSelectedConstellation(data);
    }
  };

  return (
    <>
      {page === 'dashboard' && <Dashboard onNavigate={navigate} />}
      {page === 'report' && <StellarReport onNavigate={navigate} asset={selectedAsset} />}
      {page === 'constellations' && <Constellations onNavigate={navigate} />}
      {page === 'constellationDetail' && <ConstellationDetail onNavigate={navigate} constellation={selectedConstellation} />}
    </>
  );
}

export default App;
