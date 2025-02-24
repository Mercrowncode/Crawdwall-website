// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');

    if (mobileMenuBtn && navLinks) {
        // Toggle menu on button click
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('show');
            navbar.classList.toggle('menu-open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('show');
                navbar.classList.remove('menu-open');
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('show');
                navbar.classList.remove('menu-open');
            });
        });

        // Handle scroll behavior
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                navbar.classList.remove('scroll-up');
                return;
            }
            
            if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
                // Scrolling down
                navbar.classList.remove('scroll-up');
                navbar.classList.add('scroll-down');
                // Close mobile menu when scrolling down
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('show');
                navbar.classList.remove('menu-open');
            } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
                // Scrolling up
                navbar.classList.remove('scroll-down');
                navbar.classList.add('scroll-up');
            }
            lastScroll = currentScroll;
        });
    }
});

// Sample event data - In a real application, this would come from an API
const events = [
    {
        title: 'Tech Conference 2025',
        date: 'March 15-17, 2025',
        image: 'assets/event1.jpg'
    },
    {
        title: 'Music Festival',
        date: 'April 5-7, 2025',
        image: 'assets/event2.jpg'
    },
    {
        title: 'Food & Wine Expo',
        date: 'May 20-22, 2025',
        image: 'assets/event3.jpg'
    }
];

// Populate events
function populateEvents() {
    const eventCarousel = document.querySelector('.event-carousel');
    if (!eventCarousel) return;

    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <img src="${event.image}" alt="${event.title}">
            <div class="event-details">
                <h3>${event.title}</h3>
                <p class="date">${event.date}</p>
                <button class="btn btn-primary">Register Now</button>
            </div>
        `;
        eventCarousel.appendChild(eventCard);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    populateEvents();

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .event-card, .testimonial-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease-out';
        observer.observe(element);
    });
});

// Smooth scroll functionality
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
