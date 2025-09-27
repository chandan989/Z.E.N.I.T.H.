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
    if (zviElement.dataset.iscounting !== 'true') {
        zviElement.textContent = Math.max(10, Math.min(90, currentZVI)).toFixed(2);
    }

    currentTVO += Math.random() * 50;
    if (tvoElement.dataset.iscounting !== 'true') {
        tvoElement.textContent = formatCurrency(currentTVO);
    }

    currentVolume += (Math.random() - 0.4) * 100;
    if(volumeElement.dataset.iscounting !== 'true') {
        volumeElement.textContent = formatCurrency(currentVolume);
    }
}
setInterval(updateMarketData, 2500);

// --- Form Submission ---
const domainForm = document.getElementById('domain-form');
const domainInput = document.getElementById('domain-input');
const analyzeButton = document.getElementById('analyze-button');
const buttonText = document.getElementById('button-text');
const buttonSpinner = document.getElementById('button-spinner');

domainForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const domain = domainInput.value;

    if (!domain) {
        alert('Please enter a domain to analyze.');
        return;
    }

    // Show loading state
    buttonText.classList.add('hidden');
    buttonSpinner.classList.remove('hidden');
    analyzeButton.disabled = true;

    // Simulate analysis and redirect
    setTimeout(() => {
        // This is a simulation. In a real scenario, an actual analysis of the
        // domain's compatibility for web3 conversion would happen here.
        // For this version, we'll assume the analysis is always successful.

        console.log(`Analysis complete for ${domain}. Redirecting to Genesis Engine...`);

        // Redirect to the Genesis Engine, passing the domain as a query parameter.
        window.location.href = `https://zenith-genesis-engine.vercel.app/?domain=${encodeURIComponent(domain)}`;

        // No need to reset button state as the page will navigate away.
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

    // --- Scroll Animations ---
    const scrollElements = document.querySelectorAll('.scroll-animate');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;

        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        })
    }

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });

    // --- Count-Up Animation ---
    const countUpElements = document.querySelectorAll('[data-countup]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const endVal = parseFloat(el.getAttribute('data-countup'));
                const duration = 2000; // 2 seconds
                let startTime = null;

                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const progress = Math.min((currentTime - startTime) / duration, 1);
                    const currentVal = progress * endVal;

                    if (el.id === 'tvo-value' || el.id === 'volume-value') {
                        el.textContent = formatCurrency(currentVal);
                    } else {
                        el.textContent = currentVal.toFixed(2);
                    }
                    el.dataset.iscounting = 'true';

                    if (progress < 1) {
                        requestAnimationFrame(animation);
                    } else {
                        el.dataset.iscounting = 'false';
                    }
                }

                requestAnimationFrame(animation);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    countUpElements.forEach(el => {
        observer.observe(el);
    });
});