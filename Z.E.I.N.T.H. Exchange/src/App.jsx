// Z.E.I.N.T.H. Exchange/src/App.jsx
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Exchange from './pages/Exchange';

function App() {
  const [page, setPage] = useState('dashboard');
  const [selectedAsset, setSelectedAsset] = useState(null);

  const navigate = (page, data = null) => {
    setPage(page);
    if (page === 'exchange') {
      setSelectedAsset(data);
    }
  };

  return (
    <>
      {page === 'dashboard' && <Dashboard onNavigate={navigate} />}
      {page === 'exchange' && <Exchange onNavigate={navigate} asset={selectedAsset} />}
    </>
  );
}

export default App;
