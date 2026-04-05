/* ===========================================
   HAMBURGER MENU TOGGLE - VANILLA JAVASCRIPT
   
   This script handles the responsive hamburger menu
   functionality without any external libraries.
   =========================================== */

// Get the hamburger button and navigation menu elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Function to toggle the menu
function toggleMenu() {
    // Toggle the 'active' class on the hamburger button
    hamburger.classList.toggle('active');
    
    // Toggle the 'active' class on the navigation menu
    navMenu.classList.toggle('active');
}

// Add click event listener to the hamburger button
hamburger.addEventListener('click', toggleMenu);

// Close menu when a navigation link is clicked
const navLinks = navMenu.querySelectorAll('a');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        // Remove 'active' class from hamburger
        hamburger.classList.remove('active');
        
        // Remove 'active' class from navigation menu
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside of the header
document.addEventListener('click', function(event) {
    // Check if the click is outside the header
    const header = document.querySelector('.header');
    const isClickInsideHeader = header.contains(event.target);
    
    // If click is outside the header and menu is open, close it
    if (!isClickInsideHeader && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});
