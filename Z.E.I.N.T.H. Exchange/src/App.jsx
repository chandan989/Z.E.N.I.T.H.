// Z.E.I.N.T.H. Exchange/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Exchange from './pages/Exchange';
import Constellations from './pages/Constellations';
import Portfolio from './pages/Protfolio';
import Docs from './pages/Docs';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Exchange />} />
                    <Route path="/exchange" element={<Exchange />} />
                    <Route path="/constellations" element={<Constellations />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/docs" element={<Docs />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;