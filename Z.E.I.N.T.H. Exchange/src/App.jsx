// Z.E.I.N.T.H. Exchange/src/App.jsx
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, [role="button"], input, [data-clickable]')) {
        cursor.classList.add('hover');
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.closest('a, button, [role="button"], input, [data-clickable]')) {
        cursor.classList.remove('hover');
      }
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      <div className="custom-cursor"></div>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      <div className="relative z-10 flex flex-col w-full min-h-screen">
        {page === 'dashboard' && <Dashboard onNavigate={navigate} />}
        {page === 'exchange' && <Exchange onNavigate={navigate} asset={selectedAsset} />}
      </div>
    </>
  );
}

export default App;
