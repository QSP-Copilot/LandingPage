/**
 * QSP-Copilot Presentation Integration Script
 * 
 * This script handles:
 * 1. Navigation between slides
 * 2. Loading the roadmap content
 * 3. Interactive elements and animations
 */

// Add console logging to help with debugging
console.log('Integration.js loaded and executing');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing features');
    
    // Set up navigation
    setupNavigation();
    
    // Load the roadmap content
    loadRoadmapContent();
    
    // Add interactive elements
    addInteractiveElements();
    
    // Initialize animations
    initAnimations();
});

/**
 * Sets up smooth navigation between slides
 */
function setupNavigation() {
    console.log('Setting up navigation');
    // Create navigation dots
    const slides = document.querySelectorAll('.slide');
    const navContainer = document.createElement('div');
    navContainer.className = 'navigation';
    
    slides.forEach((slide, index) => {
        const dot = document.createElement('div');
        dot.className = 'nav-dot';
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            // Smooth scroll to the slide
            slides[index].scrollIntoView({ behavior: 'smooth' });
            
            // Update active state
            document.querySelectorAll('.nav-dot').forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
        });
        
        navContainer.appendChild(dot);
    });
    
    document.body.appendChild(navContainer);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const currentIndex = getCurrentSlideIndex();
        
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            if (currentIndex < slides.length - 1) {
                slides[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
                updateActiveDot(currentIndex + 1);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            if (currentIndex > 0) {
                slides[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
                updateActiveDot(currentIndex - 1);
            }
        }
    });
    
    // Update dots on scroll
    window.addEventListener('scroll', () => {
        const index = getCurrentSlideIndex();
        updateActiveDot(index);
    });
}

/**
 * Gets the current visible slide index
 */
function getCurrentSlideIndex() {
    const slides = document.querySelectorAll('.slide');
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;
    
    for (let i = 0; i < slides.length; i++) {
        const slideTop = slides[i].offsetTop;
        const slideBottom = slideTop + slides[i].offsetHeight;
        
        if (scrollPosition >= slideTop - windowHeight / 2 && 
            scrollPosition < slideBottom - windowHeight / 2) {
            return i;
        }
    }
    
    return 0;
}

/**
 * Updates the active navigation dot
 */
function updateActiveDot(index) {
    const dots = document.querySelectorAll('.nav-dot');
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) dots[index].classList.add('active');
}

/**
 * Loads the roadmap content from the separate HTML file
 */
/**
 * Loads the roadmap content from the separate HTML file
 */
function loadRoadmapContent() {
    console.log('Loading roadmap content');
    // Create roadmap section if it doesn't exist
    const roadmapSection = document.querySelector('#roadmap-section');
    
    if (roadmapSection) {
        console.log('Roadmap section found, fetching content from roadmap.html');
        
        // Add a loading animation
        roadmapSection.querySelector('.container').innerHTML = `
            <div class="section-title">
                <h2>Loading Roadmap...</h2>
            </div>
            <div style="display: flex; justify-content: center; margin: 2rem 0;">
                <div class="loading-spinner"></div>
            </div>
            <p style="text-align: center;">Please wait while we load the roadmap content...</p>
        `;
        
        // Fetch the roadmap content
        fetch('roadmap.html')
            .then(response => {
                console.log('Fetch response received:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                console.log('HTML content received, parsing');
                // Extract the container content
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Get the full content div
                const originalContainer = doc.querySelector('.container');
                
                if (originalContainer) {
                    // Create a wrapper with our slide structure
                    const container = document.createElement('div');
                    container.className = 'container';
                    
                    // Create a section title that matches our main site theme
                    const sectionTitle = document.createElement('div');
                    sectionTitle.className = 'section-title';
                    const heading = document.createElement('h2');
                    heading.textContent = 'Current & Future Capabilities';
                    sectionTitle.appendChild(heading);
                    container.appendChild(sectionTitle);
                    
                    // Copy ALL the original styles from the roadmap.html head
                    const originalStyles = doc.querySelectorAll('style');
                    originalStyles.forEach(style => {
                        const clonedStyle = document.createElement('style');
                        clonedStyle.textContent = style.textContent;
                        document.head.appendChild(clonedStyle);
                    });
                    
                    // Extract the important content sections from the roadmap
                    // Current Capabilities card
                    const currentCapabilitiesCard = Array.from(originalContainer.querySelectorAll('.card'))
                        .find(card => card.querySelector('h2')?.textContent === 'Current Capabilities' ||
                                     card.previousElementSibling?.textContent === 'Current Capabilities');
                    
                    if (currentCapabilitiesCard) {
                        container.appendChild(currentCapabilitiesCard.cloneNode(true));
                    }
                    
                    // Key
                    const key = originalContainer.querySelector('.key');
                    if (key) {
                        container.appendChild(key.cloneNode(true));
                    }
                    
                    // Development Roadmap section
                    const roadmapHeader = Array.from(originalContainer.querySelectorAll('h2'))
                        .find(h2 => h2.textContent === 'Development Roadmap');
                    if (roadmapHeader) {
                        container.appendChild(roadmapHeader.cloneNode(true));
                        
                        // Get the roadmap container that follows
                        const roadmapContainer = originalContainer.querySelector('.roadmap-container');
                        if (roadmapContainer) {
                            container.appendChild(roadmapContainer.cloneNode(true));
                        }
                    }
                    
                    // Add Button to view complete roadmap
                    const btnContainer = document.createElement('div');
                    btnContainer.style.textAlign = 'center';
                    btnContainer.style.marginTop = '3rem';
                    
                    const viewMoreBtn = document.createElement('a');
                    viewMoreBtn.href = 'roadmap.html';
                    viewMoreBtn.className = 'btn';
                    viewMoreBtn.textContent = 'View Full Roadmap';
                    viewMoreBtn.target = '_blank';
                    btnContainer.appendChild(viewMoreBtn);
                    
                    container.appendChild(btnContainer);
                    
                    // Update the slide with our new content
                    roadmapSection.innerHTML = '';
                    
                    // Add standard slide elements back
                    const scanLine = document.createElement('div');
                    scanLine.className = 'scan-line';
                    roadmapSection.appendChild(scanLine);
                    
                    const particleContainer = document.createElement('div');
                    particleContainer.className = 'particle-container';
                    roadmapSection.appendChild(particleContainer);
                    
                    // Add our container with the roadmap content
                    roadmapSection.appendChild(container);
                    console.log('Roadmap content successfully loaded and inserted');
                    
                    // Reinitialize particles in the new container
                    addParticlesToContainer(particleContainer);
                } else {
                    throw new Error('Container not found in roadmap.html');
                }
            })
            .catch(error => {
                console.error('Error loading roadmap content:', error);
                roadmapSection.querySelector('.container').innerHTML = `
                    <div class="section-title">
                        <h2>Error Loading Roadmap</h2>
                    </div>
                    <p style="text-align: center;">There was an error loading the roadmap content: ${error.message}</p>
                    <p style="text-align: center;">Please <a href="roadmap.html" target="_blank">click here</a> to view the roadmap directly.</p>
                `;
            });
    } else {
        console.warn('Roadmap section not found in the document');
    }
}

// Helper function to add particles to a container
function addParticlesToContainer(container) {
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positions
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        const size = Math.random() * 3 + 1;
        
        particle.style.left = `${left}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDelay = `${delay}s`;
        
        container.appendChild(particle);
    }
}
/**
 * Adds interactive elements to the presentation
 */
function addInteractiveElements() {
    console.log('Adding interactive elements');
    // Add interactive particles
    const particleContainers = document.querySelectorAll('.particle-container');
    
    particleContainers.forEach(container => {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random positions
            const left = Math.random() * 100;
            const delay = Math.random() * 15;
            const size = Math.random() * 3 + 1;
            
            particle.style.left = `${left}%`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.animationDelay = `${delay}s`;
            
            container.appendChild(particle);
        }
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card, .business-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15), 0 0 10px rgba(58, 1, 223, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

/**
 * Initializes animations for the presentation
 */
function initAnimations() {
    console.log('Initializing animations');
    // Animate elements when they enter the viewport
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animatableElements = document.querySelectorAll('.card, .feature-image, h2, .badge, .business-card');
    
    animatableElements.forEach(element => {
        // Add animation class
        element.classList.add('animatable');
        observer.observe(element);
    });
}

// Add CSS for the new navigation, animations, and loading spinner
const style = document.createElement('style');
style.textContent = `
    /* Navigation styles */
    .navigation {
        position: fixed;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 15px;
        z-index: 1000;
    }
    
    .nav-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .nav-dot.active {
        background-color: var(--secondary);
        box-shadow: 0 0 10px var(--secondary);
        transform: scale(1.2);
    }
    
    /* Animation styles */
    .animatable {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Staggered animations */
    .card.animate:nth-child(1) { transition-delay: 0.1s; }
    .card.animate:nth-child(2) { transition-delay: 0.2s; }
    .card.animate:nth-child(3) { transition-delay: 0.3s; }
    .card.animate:nth-child(4) { transition-delay: 0.4s; }
    
    /* Loading spinner */
    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 3px solid rgba(0, 229, 255, 0.3);
        border-radius: 50%;
        border-top-color: var(--secondary);
        animation: spin 1s infinite linear;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

document.head.appendChild(style);

console.log('Integration script fully loaded');