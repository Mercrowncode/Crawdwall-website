// Navigation functionality
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navLinks = document.querySelector('.nav-links');
        this.lastScroll = 0;
        this.init();
    }

    init() {
        if (this.mobileMenuBtn && this.navLinks) {
            this.setupMobileMenu();
            this.setupClickOutside();
            this.setupNavLinks();
            this.setupScrollBehavior();
        }
    }

    setupMobileMenu() {
        this.mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });
    }

    setupClickOutside() {
        document.addEventListener('click', (e) => {
            if (!this.navLinks.contains(e.target) && !this.mobileMenuBtn.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    setupNavLinks() {
        this.navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
    }

    setupScrollBehavior() {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                this.navbar.classList.remove('scroll-up');
                return;
            }

            if (currentScroll > this.lastScroll && !this.navbar.classList.contains('scroll-down')) {
                this.navbar.classList.remove('scroll-up');
                this.navbar.classList.add('scroll-down');
                this.closeMenu();
            } else if (currentScroll < this.lastScroll && this.navbar.classList.contains('scroll-down')) {
                this.navbar.classList.remove('scroll-down');
                this.navbar.classList.add('scroll-up');
            }

            this.lastScroll = currentScroll;
        });
    }

    toggleMenu() {
        this.mobileMenuBtn.classList.toggle('active');
        this.navLinks.classList.toggle('show');
        this.navbar.classList.toggle('menu-open');
    }

    closeMenu() {
        this.mobileMenuBtn.classList.remove('active');
        this.navLinks.classList.remove('show');
        this.navbar.classList.remove('menu-open');
    }
}

// Form validation
class FormValidation {
    constructor(form) {
        this.form = form;
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.setupInputValidation();
    }

    setupInputValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
            input.addEventListener('input', () => this.validateInput(input));
        });
    }

    validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        let isValid = true;
        let errorMessage = '';

        switch (type) {
            case 'email':
                isValid = this.validateEmail(value);
                errorMessage = 'Please enter a valid email address';
                break;
            case 'tel':
                isValid = this.validatePhone(value);
                errorMessage = 'Please enter a valid phone number';
                break;
            default:
                isValid = value.length > 0;
                errorMessage = 'This field is required';
        }

        this.showInputError(input, isValid ? '' : errorMessage);
        return isValid;
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    validatePhone(phone) {
        return /^\+?[\d\s-]{10,}$/.test(phone);
    }

    showInputError(input, message) {
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = message;
            input.classList.toggle('invalid', message !== '');
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            // Handle form submission
            console.log('Form is valid, submitting...');
            // Add your form submission logic here
        }
    }
}

// Theme functionality
class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.themeIcon = this.themeToggle.querySelector('i');
        this.init();
    }

    init() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);

        // Add click event
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        this.themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// Counter Animation
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.metric-number');
        this.speed = 200;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.counters.forEach(counter => observer.observe(counter));
    }

    animate(counter) {
        const target = +counter.getAttribute('data-count');
        let count = 0;
        
        const updateCount = () => {
            const increment = target / (this.speed / 16); // 60fps
            
            if (count < target) {
                count += increment;
                counter.innerText = Math.ceil(count);
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target;
            }
        };

        updateCount();
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    new Navigation();

    // Initialize form validation
    document.querySelectorAll('form').forEach(form => {
        new FormValidation(form);
    });

    // Initialize theme manager
    new ThemeManager();

    // Initialize counter animation
    new CounterAnimation();
});
