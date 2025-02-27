import { auth } from './supabase-config.js';

export class AuthUI {
    constructor(role) {
        this.role = role;
        this.toggleBtns = document.querySelectorAll('.toggle-btn');
        this.signinForm = document.getElementById('signin-form');
        this.signupForm = document.getElementById('signup-form');
        this.currentStep = 1;
        
        this.init();
    }

    init() {
        console.log(`Initializing ${this.role} auth UI`);
        
        // Debug element existence
        console.log('Elements found:', {
            toggleBtns: this.toggleBtns?.length || 0,
            signinForm: Boolean(this.signinForm),
            signupForm: Boolean(this.signupForm)
        });

        if (!this.toggleBtns?.length || !this.signinForm || !this.signupForm) {
            console.error('Required elements not found!');
            return;
        }

        this.setupEventListeners();
        this.initializeFormState();
    }

    setupEventListeners() {
        // Form switching
        this.toggleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchForm(btn.dataset.form);
            });
        });

        // Form submissions
        this.signinForm.addEventListener('submit', (e) => this.handleSignIn(e));
        this.signupForm.addEventListener('submit', (e) => this.handleSignUp(e));

        // Multi-step navigation
        const nextBtns = this.signupForm.querySelectorAll('.next-btn');
        const backBtns = this.signupForm.querySelectorAll('.back-btn');

        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => this.nextStep());
        });

        backBtns.forEach(btn => {
            btn.addEventListener('click', () => this.prevStep());
        });

        // Password visibility toggle
        const toggleBtns = document.querySelectorAll('.toggle-password');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const input = btn.previousElementSibling;
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                btn.classList.toggle('fa-eye');
                btn.classList.toggle('fa-eye-slash');
            });
        });
    }

    initializeFormState() {
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode') || 'signin';
        this.switchForm(mode);
    }

    switchForm(formType) {
        // Update toggle buttons
        this.toggleBtns.forEach(btn => {
            const isActive = btn.dataset.form === formType;
            btn.classList.toggle('active', isActive);
        });

        // Update form visibility
        this.signinForm.classList.toggle('active', formType === 'signin');
        this.signupForm.classList.toggle('active', formType === 'signup');
        
        // Reset signup form to first step when switching
        if (formType === 'signup') {
            this.showStep(1);
        }
        
        // Update URL
        history.pushState({}, '', `?mode=${formType}`);
    }

    nextStep() {
        if (this.currentStep >= 3) return;
        
        // Validate current step
        if (!this.validateStep(this.currentStep)) {
            return;
        }

        // Move to next step
        this.showStep(this.currentStep + 1);
    }

    prevStep() {
        if (this.currentStep <= 1) return;
        this.showStep(this.currentStep - 1);
    }

    showStep(step) {
        // Update progress bar
        const progressSteps = this.signupForm.querySelectorAll('.progress-bar .step');
        progressSteps.forEach((stepEl, index) => {
            stepEl.classList.toggle('active', index + 1 <= step);
        });

        // Hide all steps and show the current one
        const formSteps = this.signupForm.querySelectorAll('.form-step');
        formSteps.forEach(formStep => {
            formStep.classList.toggle('active', parseInt(formStep.dataset.step) === step);
        });

        this.currentStep = step;
        
        // Clear any existing error messages
        this.clearMessages(this.signupForm);
    }

    validateStep(step) {
        const stepDiv = this.signupForm.querySelector(`.form-step[data-step="${step}"]`);
        if (!stepDiv) return false;

        // Clear any existing error messages
        this.clearMessages(this.signupForm);

        // Step-specific validation
        switch(step) {
            case 1:
                return this.validateBasicInfo();
            case 2:
                return this.validateInterests();
            case 3:
                return this.validateFinalSetup();
            default:
                return false;
        }
    }

    validateBasicInfo() {
        const email = document.getElementById('signup-email')?.value?.trim();
        const password = document.getElementById('signup-password')?.value;
        const fullname = document.getElementById('fullname')?.value?.trim();

        if (!email || !password || !fullname) {
            this.showErrorMessage(this.signupForm, 'Please fill in all required fields');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showErrorMessage(this.signupForm, 'Please enter a valid email address');
            return false;
        }

        if (password.length < 6) {
            this.showErrorMessage(this.signupForm, 'Password must be at least 6 characters long');
            return false;
        }

        if (fullname.length < 2) {
            this.showErrorMessage(this.signupForm, 'Please enter your full name');
            return false;
        }

        return true;
    }

    validateInterests() {
        const city = document.getElementById('city')?.value?.trim();
        const categories = document.querySelectorAll('input[name="categories"]:checked');

        if (!city) {
            this.showErrorMessage(this.signupForm, 'Please enter your city of interest');
            return false;
        }

        if (categories.length === 0) {
            this.showErrorMessage(this.signupForm, 'Please select at least one event category');
            return false;
        }

        return true;
    }

    validateFinalSetup() {
        const terms = document.getElementById('terms');
        
        if (!terms?.checked) {
            this.showErrorMessage(this.signupForm, 'Please accept the terms and conditions');
            return false;
        }

        return true;
    }

    async handleSignIn(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('signin-email');
        const passwordInput = document.getElementById('signin-password');
        
        if (!emailInput || !passwordInput) {
            console.error('Sign in form inputs not found');
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            this.showErrorMessage(this.signinForm, 'Please fill in all fields');
            return;
        }

        try {
            const { data, error } = await auth.signIn(email, password);
            if (error) throw error;
            
            console.log('Sign in successful:', data);

            // Clear form
            emailInput.value = '';
            passwordInput.value = '';

            // Redirect to success page
            window.location.href = `/auth/signup-success.html?role=${encodeURIComponent(this.role)}`;
        } catch (error) {
            console.error('Sign in error:', error);
            this.showErrorMessage(this.signinForm, error.message);
        }
    }

    async handleSignUp(e) {
        e.preventDefault();

        // Validate final step
        if (!this.validateStep(3)) {
            return;
        }

        try {
            // Show loading state
            const submitBtn = this.signupForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Creating Account...';
            }

            // Clear any existing messages
            this.clearMessages(this.signupForm);

            // Gather form data
            const formData = {
                email: document.getElementById('signup-email')?.value?.trim(),
                password: document.getElementById('signup-password')?.value,
                fullName: document.getElementById('fullname')?.value?.trim(),
                phone: document.getElementById('phone')?.value?.trim(),
                city: document.getElementById('city')?.value?.trim(),
                interests: Array.from(document.querySelectorAll('input[name="categories"]:checked')).map(cb => cb.value),
                marketing: document.getElementById('marketing')?.checked
            };

            // Debug log the form data
            console.log('Form data collected:', {
                email: formData.email || '[missing]',
                hasPassword: Boolean(formData.password),
                fullName: formData.fullName,
                hasPhone: Boolean(formData.phone),
                city: formData.city,
                interests: formData.interests,
                marketing: formData.marketing
            });

            // Validate required fields
            if (!formData.email || !formData.password) {
                throw new Error('Email and password are required');
            }
            
            // Make the signup request
            const { data, error } = await auth.signUp(
                formData.email,
                formData.password,
                {
                    role: this.role,
                    fullName: formData.fullName,
                    phone: formData.phone,
                    city: formData.city,
                    interests: formData.interests,
                    marketing: formData.marketing
                }
            );
            
            if (error) throw error;
            
            console.log('Signup successful:', data);

            // Redirect to success page
            window.location.href = `/auth/signup-success.html?role=${encodeURIComponent(this.role)}`;
        } catch (error) {
            console.error('Sign up error:', error);
            this.showErrorMessage(this.signupForm, error.message || 'An error occurred during sign up');
        } finally {
            // Reset button state
            const submitBtn = this.signupForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Account';
            }
        }
    }

    clearMessages(form) {
        const errorDiv = form.querySelector('.error-message');
        const successDiv = form.querySelector('.success-message');
        if (errorDiv) errorDiv.remove();
        if (successDiv) successDiv.remove();
    }

    showErrorMessage(form, message) {
        this.clearMessages(form);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        form.insertBefore(errorDiv, form.firstChild);
    }

    showSuccessMessage(form, message) {
        this.clearMessages(form);
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        form.insertBefore(successDiv, form.firstChild);
    }
}
