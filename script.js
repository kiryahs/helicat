// HeliCat Main Script - Where the magic happens

document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu for mobile
    setupHamburgerMenu();

    // Particle system for background
    createParticles();

    // Smooth scroll for navigation
    setupSmoothScroll();

    // Interactive elements
    setupInteractiveElements();

    // Copy contract address functionality
    setupContractCopy();

    // Parallax effect for clouds
    setupParallax();
});

// Hamburger menu functionality
function setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// Create floating particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random emoji cats and helicopters
        const emojis = ['🐱', '🚁', '✨', '⭐', '💫', '🌟'];
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';

        // Random animation duration
        const duration = 15 + Math.random() * 25;
        particle.style.animationDuration = duration + 's';

        // Random delay
        const delay = Math.random() * 10;
        particle.style.animationDelay = delay + 's';

        // Random size
        const size = 20 + Math.random() * 20;
        particle.style.fontSize = size + 'px';

        particlesContainer.appendChild(particle);
    }
}

// Smooth scroll for navigation links
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Interactive elements
function setupInteractiveElements() {
    const heroCat = document.getElementById('hero-cat');
    const buttons = document.querySelectorAll('.btn');

    // Cat interaction removed - now triggers helicopter blade spinning
    // See helicopter.js for the hover detection on the cat
    if (heroCat) {
        console.log('✅ Hero cat found - helicopter.js will handle interactions');
    }

    // Button interactions
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px) scale(1.05)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Social button effects
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.querySelector('.social-icon').style.transform = 'rotate(360deg) scale(1.3)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.querySelector('.social-icon').style.transform = 'rotate(0deg) scale(1)';
        });
    });
}

// Copy contract address
function setupContractCopy() {
    const contractElement = document.getElementById('contract');
    if (contractElement) {
        contractElement.addEventListener('click', () => {
            const text = contractElement.textContent;
            if (text !== 'TBA - Launching Soon!') {
                navigator.clipboard.writeText(text).then(() => {
                    const originalText = contractElement.textContent;
                    contractElement.textContent = 'Copied! 🎉';
                    setTimeout(() => {
                        contractElement.textContent = originalText;
                    }, 2000);
                });
            }
        });
        contractElement.style.cursor = 'pointer';
    }
}

// Parallax effect for clouds and elements
function setupParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        // Move clouds at different speeds
        const clouds = document.querySelectorAll('.cloud');
        clouds.forEach((cloud, index) => {
            const speed = (index + 1) * 0.3;
            cloud.style.transform = `translateX(${scrolled * speed}px)`;
        });

        // Parallax for sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const offset = rect.top - window.innerHeight;
            if (offset < 0) {
                const opacity = 1 - (Math.abs(offset) / window.innerHeight) * 0.3;
                section.style.opacity = Math.max(opacity, 0.7);
            }
        });
    });
}

// Easter egg function
function showEasterEgg() {
    const easterEgg = document.createElement('div');
    easterEgg.className = 'easter-egg';
    easterEgg.innerHTML = `
        <div class="easter-egg-content">
            <h2>🎉 You found the secret! 🎉</h2>
            <p>HeliCat approves of your clicking skills!</p>
            <p class="big-emoji">🚁🐱🚁</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(easterEgg);

    setTimeout(() => {
        easterEgg.classList.add('show');
    }, 10);
}

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Random flying cats occasionally
setInterval(() => {
    if (Math.random() > 0.7) {
        createFlyingCat();
    }
}, 8000);

function createFlyingCat() {
    const flyingCat = document.createElement('div');
    flyingCat.className = 'flying-cat';
    flyingCat.textContent = '🚁🐱';
    flyingCat.style.top = Math.random() * 50 + 25 + '%';
    document.body.appendChild(flyingCat);

    setTimeout(() => {
        flyingCat.remove();
    }, 10000);
}

// Add some fun console messages
console.log('%c🚁 HeliCat is flying! 🐱', 'font-size: 20px; color: #ff6b35; font-weight: bold;');
console.log('%cLooking for easter eggs? Try clicking the cat 10 times...', 'font-size: 12px; color: #4ecdc4;');
console.log('%cTo the moon! 🚀', 'font-size: 16px; color: #ffe66d;');
