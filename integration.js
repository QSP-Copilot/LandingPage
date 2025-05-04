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
 * and adapts it to match the main site's styling
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
                
                // Extract content instead of importing styles
                // Current Capabilities
                const currentCapabilities = document.createElement('div');
                currentCapabilities.className = 'card';
                
                const originalCapabilities = doc.querySelector('.card');
                if (originalCapabilities) {
                    // Extract heading
                    const capabilityTitle = document.createElement('h3');
                    capabilityTitle.textContent = 'Current Capabilities';
                    currentCapabilities.appendChild(capabilityTitle);
                    
                    // Extract description
                    const capabilityDesc = doc.querySelector('.card > p');
                    if (capabilityDesc) {
                        const capabilityDescClone = document.createElement('p');
                        capabilityDescClone.textContent = capabilityDesc.textContent;
                        currentCapabilities.appendChild(capabilityDescClone);
                    }
                    
                    // Extract feature list with proper styling
                    const featureList = document.createElement('ul');
                    featureList.className = 'feature-list';
                    
                    const originalFeatures = originalCapabilities.querySelectorAll('.feature-item');
                    originalFeatures.forEach(feature => {
                        const listItem = document.createElement('li');
                        // Convert roadmap classes to index classes
                        if (feature.classList.contains('complete')) {
                            listItem.className = 'feature-item complete';
                        } else if (feature.classList.contains('in-progress')) {
                            listItem.className = 'feature-item in-progress';
                        } else if (feature.classList.contains('planned')) {
                            listItem.className = 'feature-item planned';
                        }
                        
                        listItem.innerHTML = feature.innerHTML;
                        featureList.appendChild(listItem);
                    });
                    
                    currentCapabilities.appendChild(featureList);
                    container.appendChild(currentCapabilities);
                }
                
                // Import the Key
                const keyDiv = document.createElement('div');
                keyDiv.className = 'key';
                
                const originalKey = doc.querySelector('.key');
                if (originalKey) {
                    const keyItems = originalKey.querySelectorAll('.key-item');
                    keyItems.forEach(item => {
                        const keyItemClone = document.createElement('div');
                        keyItemClone.className = 'key-item';
                        
                        const keyDot = document.createElement('div');
                        keyDot.className = 'key-dot';
                        
                        // Find original dot class
                        const originalDot = item.querySelector('.key-dot');
                        if (originalDot) {
                            if (originalDot.classList.contains('dot-complete')) {
                                keyDot.className += ' dot-complete';
                            } else if (originalDot.classList.contains('dot-progress')) {
                                keyDot.className += ' dot-progress';
                            } else if (originalDot.classList.contains('dot-planned')) {
                                keyDot.className += ' dot-planned';
                            }
                        }
                        
                        keyItemClone.appendChild(keyDot);
                        
                        const keyText = document.createElement('span');
                        keyText.textContent = item.querySelector('span').textContent;
                        keyItemClone.appendChild(keyText);
                        
                        keyDiv.appendChild(keyItemClone);
                    });
                    
                    container.appendChild(keyDiv);
                }
                
                // Extract Roadmap Timeline
                const timelineHeader = document.createElement('h3');
                timelineHeader.textContent = 'Development Roadmap';
                timelineHeader.style.marginTop = '3rem';
                container.appendChild(timelineHeader);
                
                // Create a styled version of the timeline that matches the main site
                const timelineContainer = document.createElement('div');
                timelineContainer.className = 'roadmap-container';
                
                const originalTimeline = doc.querySelector('.roadmap-container');
                if (originalTimeline) {
                    // Create simplified timeline that matches main site styling
                    const timelineItems = originalTimeline.querySelectorAll('.timeline-item');
                    
                    timelineItems.forEach((item, index) => {
                        const timelineCard = document.createElement('div');
                        timelineCard.className = 'card';
                        
                        // Extract quarter marker
                        const quarterMarker = item.querySelector('.year-marker');
                        if (quarterMarker) {
                            const cardHeader = document.createElement('div');
                            cardHeader.className = 'business-header';
                            
                            const cardTitle = document.createElement('h3');
                            cardTitle.textContent = item.querySelector('.timeline-content h3').textContent;
                            
                            const quarterBadge = document.createElement('span');
                            quarterBadge.className = 'badge';
                            quarterBadge.textContent = quarterMarker.textContent;
                            quarterBadge.style.float = 'right';
                            
                            cardHeader.appendChild(quarterBadge);
                            cardHeader.appendChild(cardTitle);
                            timelineCard.appendChild(cardHeader);
                        }
                        
                        // Extract features
                        const featureList = document.createElement('ul');
                        const features = item.querySelectorAll('.feature-item');
                        
                        features.forEach(feature => {
                            const listItem = document.createElement('li');
                            
                            // Map status classes
                            if (feature.classList.contains('complete')) {
                                listItem.className = 'complete';
                            } else if (feature.classList.contains('in-progress')) {
                                listItem.className = 'in-progress';
                            } else if (feature.classList.contains('planned')) {
                                listItem.className = 'planned';
                            }
                            
                            listItem.textContent = feature.textContent.trim();
                            featureList.appendChild(listItem);
                        });
                        
                        timelineCard.appendChild(featureList);
                        timelineContainer.appendChild(timelineCard);
                    });
                    
                    container.appendChild(timelineContainer);
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
                
                // Add roadmap-specific CSS to match the main site's style
                const roadmapStyles = document.createElement('style');
                roadmapStyles.textContent = `
                    /* Roadmap styling adapted for the main site */
                    .feature-item {
                        padding: 0.5rem 0 0.5rem 2rem;
                        position: relative;
                        margin-bottom: 0.8rem;
                    }
                    
                    .feature-item::before {
                        content: '';
                        position: absolute;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        left: 0;
                        top: 0.85rem;
                    }
                    
                    .complete::before {
                        background-color: var(--success);
                        box-shadow: 0 0 8px var(--success);
                    }
                    
                    .in-progress::before {
                        background-color: var(--warning);
                        box-shadow: 0 0 8px var(--warning);
                    }
                    
                    .planned::before {
                        background-color: var(--future);
                        box-shadow: 0 0 8px var(--future);
                    }
                    
                    .key {
                        display: flex;
                        justify-content: center;
                        margin: 2rem 0;
                        gap: 2rem;
                        flex-wrap: wrap;
                    }
                    
                    .key-item {
                        display: flex;
                        align-items: center;
                        margin-right: 1.5rem;
                    }
                    
                    .key-dot {
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        margin-right: 8px;
                    }
                    
                    .dot-complete {
                        background-color: var(--success);
                        box-shadow: 0 0 8px var(--success);
                    }
                    
                    .dot-progress {
                        background-color: var(--warning);
                        box-shadow: 0 0 8px var(--warning);
                    }
                    
                    .dot-planned {
                        background-color: var(--future);
                        box-shadow: 0 0 8px var(--future);
                    }
                    
                    .business-header {
                        border-bottom: 1px solid var(--secondary);
                        padding-bottom: 1rem;
                        margin-bottom: 1.5rem;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        flex-wrap: wrap;
                    }
                    
                    .business-header h3 {
                        margin: 0;
                    }
                `;
                
                document.head.appendChild(roadmapStyles);
                
                // Reinitialize particles in the new container
                addParticlesToContainer(particleContainer);
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
