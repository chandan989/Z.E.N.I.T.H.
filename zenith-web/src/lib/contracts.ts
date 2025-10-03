import { ethers } from 'ethers';
import { CONTRACTS } from '@/config/contracts';

// Contract ABIs (simplified - only functions we need)
const GENESIS_ENGINE_ABI = [
  "function requestOnboarding(string domainName, string tokenName, string tokenSymbol, uint256 tokenSupply, uint256 domaScore) external returns (uint256)",
  "function onboardingRequests(uint256) external view returns (address assetOwner, string domainName, string tokenName, string tokenSymbol, uint256 tokenSupply, uint256 domaScore, bool exists)",
  "event OnboardingRequested(uint256 indexed requestId, address indexed assetOwner, string domainName)",
  "event AssetOnboarded(address indexed owner, uint256 indexed tokenId, address fractionContract, string domainName)"
];

const DOMAIN_NFT_ABI = [
  "function name() external view returns (string)",
  "function symbol() external view returns (string)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
  "function getDomainName(uint256 tokenId) external view returns (string)",
  "function domaScores(uint256 tokenId) external view returns (uint256)"
];

const FRACTIONALIZER_ABI = [
  "function fractionContracts(uint256 tokenId) external view returns (address)",
  "function getAllFractionalTokens() external view returns (address[])",
  "function nftTokenIds(address fractionContract) external view returns (uint256)"
];

const ERC20_ABI = [
  "function name() external view returns (string)",
  "function symbol() external view returns (string)",
  "function decimals() external view returns (uint8)",
  "function totalSupply() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)"
];

const EXCHANGE_ABI = [
  "function createBuyOrder(address token, uint amount, uint price) external payable",
  "function createSellOrder(address token, uint amount, uint price) external",
  "function fillBuyOrder(address token, uint orderId, uint amountToFill) external",
  "function fillSellOrder(address token, uint orderId, uint amountToFill) external payable",
  "function cancelOrder(address token, uint orderId, bool isBuyOrder) external",
  "function getBuyOrderIds(address token) external view returns (uint[])",
  "function getSellOrderIds(address token) external view returns (uint[])",
  "function buyOrders(address token, uint orderId) external view returns (uint id, address token, address owner, bool isBuyOrder, uint amount, uint price)",
  "function sellOrders(address token, uint orderId) external view returns (uint id, address token, address owner, bool isBuyOrder, uint amount, uint price)",
  "event OrderCreated(uint orderId, address indexed token, address indexed owner, bool isBuyOrder, uint amount, uint price)",
  "event OrderFilled(uint orderId, address indexed token, address indexed filler, address indexed orderOwner, bool isBuyOrderFilled, uint amountFilled, uint price)"
];

// Get provider and signer
export function getProvider() {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }
  return new ethers.BrowserProvider(window.ethereum);
}

export async function getSigner() {
  const provider = getProvider();
  return await provider.getSigner();
}

// Contract instances
export async function getGenesisEngineContract() {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACTS.genesisEngine, GENESIS_ENGINE_ABI, signer);
}

export async function getDomainNFTContract() {
  const provider = getProvider();
  return new ethers.Contract(CONTRACTS.domainNFT, DOMAIN_NFT_ABI, provider);
}

export async function getFractionalizerContract() {
  const provider = getProvider();
  return new ethers.Contract(CONTRACTS.fractionalizer, FRACTIONALIZER_ABI, provider);
}

export async function getExchangeContract() {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACTS.exchange, EXCHANGE_ABI, signer);
}

export function getERC20Contract(address: string, withSigner = false) {
  if (withSigner) {
    return getSigner().then(signer => new ethers.Contract(address, ERC20_ABI, signer));
  }
  const provider = getProvider();
  return new ethers.Contract(address, ERC20_ABI, provider);
}

// Helper functions
export async function requestOnboarding(
  domainName: string,
  tokenName: string,
  tokenSymbol: string,
  tokenSupply: string,
  domaScore: number
) {
  const contract = await getGenesisEngineContract();
  const supply = ethers.parseEther(tokenSupply);
  
  const tx = await contract.requestOnboarding(
    domainName,
    tokenName,
    tokenSymbol,
    supply,
    domaScore
  );
  
  return await tx.wait();
}

export async function getUserDomains(userAddress: string) {
  const nftContract = await getDomainNFTContract();
  const fractionalizerContract = await getFractionalizerContract();
  
  const balance = await nftContract.balanceOf(userAddress);
  const domains = [];
  
  for (let i = 0; i < balance; i++) {
    const tokenId = await nftContract.tokenOfOwnerByIndex(userAddress, i);
    const domainName = await nftContract.getDomainName(tokenId);
    const domaScore = await nftContract.domaScores(tokenId);
    const fractionAddress = await fractionalizerContract.fractionContracts(tokenId);
    
    domains.push({
      tokenId: tokenId.toString(),
      domainName,
      domaScore: domaScore.toString(),
      fractionAddress
    });
  }
  
  return domains;
}

export async function getAllFractionalTokens() {
  const contract = await getFractionalizerContract();
  return await contract.getAllFractionalTokens();
}

export async function getTokenBalance(tokenAddress: string, userAddress: string) {
  const contract = getERC20Contract(tokenAddress);
  const balance = await contract.balanceOf(userAddress);
  return ethers.formatEther(balance);
}

export async function approveToken(tokenAddress: string, spenderAddress: string, amount: string) {
  const contract = await getERC20Contract(tokenAddress, true);
  const amountWei = ethers.parseEther(amount);
  const tx = await contract.approve(spenderAddress, amountWei);
  return await tx.wait();
}

export async function createOrder(
  tokenAddress: string,
  isBuyOrder: boolean,
  amount: string,
  price: string
) {
  const contract = await getExchangeContract();
  const amountWei = ethers.parseEther(amount);
  const priceWei = ethers.parseEther(price);
  
  if (isBuyOrder) {
    // For buy orders, send ETH with the transaction
    const totalCost = (BigInt(amountWei) * BigInt(priceWei)) / BigInt(ethers.parseEther("1"));
    const tx = await contract.createBuyOrder(tokenAddress, amountWei, priceWei, { value: totalCost });
    return await tx.wait();
  } else {
    // For sell orders, just lock the tokens
    const tx = await contract.createSellOrder(tokenAddress, amountWei, priceWei);
    return await tx.wait();
  }
}

export async function getOrderBook(tokenAddress: string) {
  const contract = await getExchangeContract();
  
  const buyOrderIds = await contract.getBuyOrderIds(tokenAddress);
  const sellOrderIds = await contract.getSellOrderIds(tokenAddress);
  
  const buyOrders = await Promise.all(
    buyOrderIds.map(async (id: bigint) => {
      const order = await contract.buyOrders(tokenAddress, id);
      return {
        id: order.id.toString(),
        owner: order.owner,
        amount: ethers.formatEther(order.amount),
        price: ethers.formatEther(order.price),
        isBuyOrder: true
      };
    })
  );
  
  const sellOrders = await Promise.all(
    sellOrderIds.map(async (id: bigint) => {
      const order = await contract.sellOrders(tokenAddress, id);
      return {
        id: order.id.toString(),
        owner: order.owner,
        amount: ethers.formatEther(order.amount),
        price: ethers.formatEther(order.price),
        isBuyOrder: false
      };
    })
  );
  
  return { buyOrders, sellOrders };
}

export async function fillOrder(
  tokenAddress: string,
  orderId: string,
  isBuyOrder: boolean,
  amount: string
) {
  const contract = await getExchangeContract();
  const amountWei = ethers.parseEther(amount);
  
  const tx = await contract.fillOrder(tokenAddress, orderId, isBuyOrder, amountWei);
  return await tx.wait();
}

export async function cancelOrder(
  tokenAddress: string,
  orderId: string,
  isBuyOrder: boolean
) {
  const contract = await getExchangeContract();
  const tx = await contract.cancelOrder(tokenAddress, orderId, isBuyOrder);
  return await tx.wait();
}
