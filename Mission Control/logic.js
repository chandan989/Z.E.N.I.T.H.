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

// --- Custom Cursor & Comet Tail ---
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');
    const tailContainer = document.createElement('div');
    document.body.appendChild(tailContainer);

    const tailCount = 15;
    const tailParticles = [];
    let mouseX = -100, mouseY = -100;
    let lastTime = 0;

    for (let i = 0; i < tailCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9998';
        particle.style.backgroundColor = `rgba(56, 189, 248, ${0.5 - i * 0.03})`; // Fading opacity
        tailContainer.appendChild(particle);
        tailParticles.push({ element: particle, x: -100, y: -100 });
    }

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTail(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        // Animate the main cursor dot
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;

        let prevX = mouseX;
        let prevY = mouseY;

        tailParticles.forEach((particle, index) => {
            const speed = 1.0 - (index / tailCount) * 0.3; // Particles further back move slower
            const newX = particle.x + (prevX - particle.x) * speed * (deltaTime / 40); // Adjusted for soothing speed
            const newY = particle.y + (prevY - particle.y) * speed * (deltaTime / 40);

            const size = Math.max(1, 8 - index * 0.5); // Tapering size for a pointed look
            particle.element.style.width = `${size}px`;
            particle.element.style.height = `${size}px`;
            particle.element.style.left = `${newX - size / 2}px`;
            particle.element.style.top = `${newY - size / 2}px`;

            particle.x = newX;
            particle.y = newY;
            prevX = newX;
            prevY = newY;
        });

        requestAnimationFrame(animateTail);
    }

    // Add hover effect listeners
    const hoverableElements = document.querySelectorAll('a, button, input, [role="button"]');
    hoverableElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });


    requestAnimationFrame(animateTail);
});
