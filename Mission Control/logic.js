// --- Mock Live Data Script ---
const zviElement = document.getElementById('zvi-value');
const tvoElement = document.getElementById('tvo-value');
const volumeElement = document.getElementById('volume-value');

let currentZVI = 42.15;
let currentTVO = 1294833.10;
let currentVolume = 271402.55;

const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

function updateMarketData() {
    currentZVI += (Math.random() - 0.5) * 0.1;
    zviElement.textContent = Math.max(10, Math.min(90, currentZVI)).toFixed(2);

    currentTVO += Math.random() * 50;
    tvoElement.textContent = formatCurrency(currentTVO);

    currentVolume += (Math.random() - 0.4) * 100;
    volumeElement.textContent = formatCurrency(currentVolume);
}
setInterval(updateMarketData, 2500);

// --- Form Submission Simulation ---
const domainForm = document.getElementById('domain-form');
const analyzeButton = document.getElementById('analyze-button');
const buttonText = document.getElementById('button-text');
const buttonSpinner = document.getElementById('button-spinner');

domainForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Show loading state
    buttonText.classList.add('hidden');
    buttonSpinner.classList.remove('hidden');
    analyzeButton.disabled = true;

    // Simulate analysis and redirect
    setTimeout(() => {
        // In a real app, this would redirect to the Genesis Engine page
        // with the domain as a query parameter.
        alert('Analysis complete! Redirecting to the Genesis Engine...');

        // Reset button state
        buttonText.classList.remove('hidden');
        buttonSpinner.classList.add('hidden');
        analyzeButton.disabled = false;
    }, 2000); // Simulate a 2-second analysis
});

// --- Wallet Connection ---
const connectWalletButton = document.getElementById('connect-wallet-button');
const connectWalletButtonText = connectWalletButton.querySelector('span');

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            console.log('Connected account:', account);
            connectWalletButtonText.textContent = `Connected: ${account.substring(0, 4)}...${account.substring(account.length - 4)}`;
            connectWalletButton.disabled = true;
        } catch (error) {
            console.error('User rejected connection:', error);
            alert('You rejected the connection request.');
        }
    } else {
        alert('MetaMask is not installed. Please install it to connect your wallet.');
    }
}

connectWalletButton.addEventListener('click', connectWallet);

