/* ===========================================
   HAMBURGER MENU TOGGLE - VANILLA JAVASCRIPT
   =========================================== */

// Get the hamburger button and navigation menu elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Function to toggle the menu
function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// Add click event listener to the hamburger button
hamburger.addEventListener('click', toggleMenu);

// Close menu when a navigation link is clicked
const navLinks = navMenu.querySelectorAll('a');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside of the header
document.addEventListener('click', function(event) {
    const header = document.querySelector('.header');
    const isClickInsideHeader = header.contains(event.target);
    
    if (!isClickInsideHeader && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

/* ===========================================
   CAROUSEL SLIDER - VANILLA JAVASCRIPT
   
   Features:
   - Infinite loop carousel
   - Responsive (1 card mobile, 2 tablets, 3 desktop)
   - Previous/Next button navigation
   - Dynamic slide counter
   - Auto-play every 5 seconds
   - Pause auto-play on hover
   =========================================== */

class CarouselSlider {
    constructor() {
        // Get carousel elements
        this.carouselTrack = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        this.carouselContainer = document.querySelector('.carousel-container');
        
        // Initialize carousel state
        this.slides = Array.from(document.querySelectorAll('.carousel-slide'));
        this.totalSlides = this.slides.length;
        this.currentIndex = 0;
        this.cardsVisible = this.getCardsVisible();
        
        // Auto-play configuration
        this.autoPlayInterval = 5000; // 5 seconds
        this.autoPlayTimer = null;
        this.isAutoPlaying = true;
        
        // Update total slides display
        this.totalSlidesSpan.textContent = this.totalSlides;
        
        // Initialize event listeners
        this.initializeEventListeners();
        
        // Start auto-play
        this.startAutoPlay();
        
        // Handle window resize for responsive carousel
        window.addEventListener('resize', () => {
            this.cardsVisible = this.getCardsVisible();
            this.updateCarousel();
        });
    }
    
    /**
     * Determine how many cards are visible based on viewport width
     */
    getCardsVisible() {
        const width = window.innerWidth;
        
        if (width < 481) {
            return 1; // Mobile: 1 card
        } else if (width < 1025) {
            return 2; // Tablet: 2 cards
        } else {
            return 3; // Desktop: 3 cards
        }
    }
    
    /**
     * Initialize all event listeners
     */
    initializeEventListeners() {
        // Navigation button clicks
        this.prevBtn.addEventListener('click', () => this.goToPrevious());
        this.nextBtn.addEventListener('click', () => this.goToNext());
        
        // Pause auto-play on hover
        this.carouselContainer.addEventListener('mouseenter', () => this.pauseAutoPlay());
        
        // Resume auto-play when mouse leaves
        this.carouselContainer.addEventListener('mouseleave', () => {
            if (this.isAutoPlaying) {
                this.startAutoPlay();
            }
        });
        
        // Touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        this.carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, false);
        
        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) {
                this.goToNext(); // Swiped left
            } else if (touchEndX > touchStartX + 50) {
                this.goToPrevious(); // Swiped right
            }
        };
        
        this.handleSwipe = handleSwipe;
    }
    
    /**
     * Move to next slide
     */
    goToNext() {
        this.currentIndex++;
        
        // Infinite loop: when we reach the end, wrap to beginning
        if (this.currentIndex > this.totalSlides - this.cardsVisible) {
            this.currentIndex = 0;
        }
        
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    /**
     * Move to previous slide
     */
    goToPrevious() {
        this.currentIndex--;
        
        // Infinite loop: when we go below 0, wrap to end
        if (this.currentIndex < 0) {
            this.currentIndex = this.totalSlides - this.cardsVisible;
        }
        
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    /**
     * Update carousel display
     */
    updateCarousel() {
        // Calculate translation based on visible cards
        const slideWidth = 100 / this.cardsVisible;
        const translateValue = -(this.currentIndex * slideWidth);
        
        // Apply transform to carousel track
        this.carouselTrack.style.transform = `translateX(${translateValue}%)`;
        
        // Update slide counter
        const displaySlide = Math.min(this.currentIndex + 1, this.totalSlides);
        this.currentSlideSpan.textContent = displaySlide;
    }
    
    /**
     * Start auto-play interval
     */
    startAutoPlay() {
        // Clear any existing timer first
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
        }
        
        // Set up new auto-play interval
        this.autoPlayTimer = setInterval(() => {
            this.goToNext();
        }, this.autoPlayInterval);
    }
    
    /**
     * Pause auto-play
     */
    pauseAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }
    
    /**
     * Reset auto-play (pause and restart)
     */
    resetAutoPlay() {
        this.pauseAutoPlay();
        if (this.isAutoPlaying) {
            this.startAutoPlay();
        }
    }
}

// Initialize carousel when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new CarouselSlider();
});
