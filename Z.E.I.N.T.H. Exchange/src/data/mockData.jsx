export const assets = [
    { id: 1, domain: 'alphatech.io', ticker: 'ATIO', price: 250.75, change: 2.5, score: 910, value: 1500000 },
    { id: 2, domain: 'nexus.com', ticker: 'NEX', price: 180.20, change: -1.2, score: 850, value: 1250000 },
    { id: 3, domain: 'quantdata.ai', ticker: 'QDAI', price: 310.50, change: 5.8, score: 950, value: 2000000 },
    { id: 4, domain: 'bioverse.org', ticker: 'BVO', price: 95.00, change: 0.5, score: 780, value: 800000 },
];

export const constellations = [
    {
        id: 1,
        name: 'Orion-AI-10',
        icon: '🌌',
        description: 'A curated index of the top 10 domains leading the charge in artificial intelligence.',
        performance: 7.2,
        assets: [assets[0], assets[2]]
    },
    {
        id: 2,
        name: 'Cygnus-eCom-5',
        icon: '🛍️',
        description: 'The 5 most promising e-commerce digital assets with high growth potential.',
        performance: 4.1,
        assets: [assets[1]]
    }
];

export const portfolio = {
    totalValue: 5430.75,
    holdings: [
        { asset: assets[0], amount: 10, value: 2507.50 },
        { asset: assets[1], amount: 15, value: 2703.00 },
        { asset: assets[3], amount: 2.3, value: 218.50 },
    ]
}