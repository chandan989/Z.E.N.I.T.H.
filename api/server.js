const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock DNS verification
app.post('/api/verify-domain', async (req, res) => {
  const { domain, verificationCode } = req.body;
  
  // Simulate DNS check delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock successful verification (always pass for demo)
  res.json({
    success: true,
    domain,
    verified: true,
    message: `DNS verification successful for ${domain}`
  });
});

// Mock DomaScore calculation
app.post('/api/calculate-score', async (req, res) => {
  const { domain } = req.body;
  
  // Simulate AI calculation delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Generate realistic mock scores based on domain characteristics
  const mockScore = generateMockDomaScore(domain);
  const dollarValue = Math.round((mockScore / 1000) * (5000 + Math.random() * 20000));
  
  res.json({
    success: true,
    domain,
    domaScore: mockScore,
    dollarValue,
    breakdown: {
      'SEO Authority': 0.35 + Math.random() * 0.15,
      'Traffic Estimate': 0.25 + Math.random() * 0.15,
      'Brandability': 0.2 + Math.random() * 0.1,
      'TLD Strength': 0.1 + Math.random() * 0.1,
      'Commercial Potential': 0.1 + Math.random() * 0.1
    },
    metrics: {
      monthlyVisitors: Math.floor(Math.random() * 100000),
      backlinks: Math.floor(Math.random() * 5000),
      domainAge: Math.floor(Math.random() * 20) + 1,
      socialMentions: Math.floor(Math.random() * 10000)
    }
  });
});

// Get domain information
app.get('/api/domain/:domain', (req, res) => {
  const { domain } = req.params;
  const mockScore = generateMockDomaScore(domain);
  
  res.json({
    domain,
    domaScore: mockScore,
    dollarValue: Math.round((mockScore / 1000) * (5000 + Math.random() * 20000)),
    isTokenized: Math.random() > 0.7, // 30% chance already tokenized
    ticker: domain.split('.')[0].substring(0, 5).toUpperCase(),
    constellation: getRandomConstellation()
  });
});

// Mock market data
app.get('/api/market/overview', (req, res) => {
  res.json({
    zvi: 42.15 + (Math.random() - 0.5) * 5, // Zenith Volatility Index
    tvo: 1294833.10 + Math.random() * 100000, // Total Value Onboarded
    volume24h: 271402.55 + Math.random() * 50000,
    totalAssets: 1247,
    activeTraders: 892
  });
});

// Mock trading data
app.get('/api/trading/:ticker', (req, res) => {
  const { ticker } = req.params;
  
  res.json({
    ticker,
    price: 350.75 + (Math.random() - 0.5) * 20,
    change24h: (Math.random() - 0.5) * 0.2, // -10% to +10%
    volume24h: Math.random() * 1000000,
    marketCap: Math.random() * 50000000,
    orderBook: generateMockOrderBook(),
    recentTrades: generateMockTrades()
  });
});

// Helper functions
function generateMockDomaScore(domain) {
  const name = domain.split('.')[0].toLowerCase();
  const tld = domain.split('.')[1]?.toLowerCase() || 'com';
  
  let baseScore = 500; // Base score
  
  // Length bonus (shorter is better)
  if (name.length <= 4) baseScore += 200;
  else if (name.length <= 6) baseScore += 100;
  else if (name.length <= 8) baseScore += 50;
  
  // TLD bonus
  const tldScores = { 'com': 150, 'org': 100, 'net': 100, 'io': 80, 'xyz': 50 };
  baseScore += tldScores[tld] || 30;
  
  // Word recognition bonus
  const commonWords = ['crypto', 'bitcoin', 'tech', 'ai', 'data', 'cloud', 'app'];
  if (commonWords.some(word => name.includes(word))) baseScore += 100;
  
  // Add randomness
  baseScore += Math.random() * 150;
  
  return Math.min(Math.max(Math.floor(baseScore), 200), 1000);
}

function getRandomConstellation() {
  const constellations = [
    'Orion-AI-10', 'E-commerce Stars', 'Geo-Domains', 'Web3 Pioneers',
    'Crypto Nebula', 'Tech Giants', 'Startup Universe'
  ];
  return constellations[Math.floor(Math.random() * constellations.length)];
}

function generateMockOrderBook() {
  const basePrice = 350.75;
  const bids = [];
  const asks = [];
  
  for (let i = 0; i < 5; i++) {
    bids.push({
      price: (basePrice - (i + 1) * 0.03).toFixed(2),
      amount: (Math.random() * 100 + 10).toFixed(1),
      total: (Math.random() * 50000 + 5000).toFixed(0)
    });
    
    asks.push({
      price: (basePrice + (i + 1) * 0.03).toFixed(2),
      amount: (Math.random() * 100 + 10).toFixed(1),
      total: (Math.random() * 50000 + 5000).toFixed(0)
    });
  }
  
  return { bids, asks };
}

function generateMockTrades() {
  const trades = [];
  const basePrice = 350.75;
  
  for (let i = 0; i < 6; i++) {
    const time = new Date(Date.now() - i * 30000);
    trades.push({
      price: (basePrice + (Math.random() - 0.5) * 0.5).toFixed(2),
      amount: (Math.random() * 30 + 5).toFixed(1),
      time: time.toLocaleTimeString(),
      isBuy: Math.random() > 0.5
    });
  }
  
  return trades;
}

app.listen(PORT, () => {
  console.log(`🌌 Z.E.N.I.T.H. API Server running on port ${PORT}`);
  console.log(`🚀 Ready to power the Genesis Engine!`);
});