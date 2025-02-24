// Attendees Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize category filters
    initializeCategoryFilters();
    
    // Initialize smooth scrolling for workflow steps
    initializeWorkflowAnimation();
    
    // Initialize community features
    initializeCommunityFeatures();
});

// Category filtering functionality
function initializeCategoryFilters() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add filtering logic here
            this.classList.toggle('active');
        });
    });
}

// Workflow steps animation
function initializeWorkflowAnimation() {
    const steps = document.querySelectorAll('.step');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.5 });

    steps.forEach(step => {
        observer.observe(step);
    });
}

// Community features interaction
function initializeCommunityFeatures() {
    const communityCards = document.querySelectorAll('.community .feature-card');
    
    communityCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add community interaction logic here
            this.classList.toggle('expanded');
        });
    });
}

// Transportation booking preview
document.querySelectorAll('.transportation .feature-card').forEach(card => {
    card.addEventListener('click', function() {
        // Add transportation booking preview logic here
        previewTransportationBooking(this);
    });
});

function previewTransportationBooking(card) {
    // Example function to show transportation booking preview
    card.classList.add('preview-active');
    setTimeout(() => {
        card.classList.remove('preview-active');
    }, 2000);
}
