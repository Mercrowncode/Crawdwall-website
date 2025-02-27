import { authHelpers } from './auth-helpers.js';

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const signinForm = document.getElementById('signin-form');
    const forms = document.querySelectorAll('.auth-form');
    const toggleButtons = document.querySelectorAll('.toggle-form');
    let currentStep = 1;

    // Form toggle functionality
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            forms.forEach(form => form.classList.toggle('active'));
        });
    });

    // Multi-step form navigation
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const steps = document.querySelectorAll('.form-step');

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                steps[currentStep - 1].classList.remove('active');
                currentStep++;
                steps[currentStep - 1].classList.add('active');
                updateProgressBar();
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            steps[currentStep - 1].classList.remove('active');
            currentStep--;
            steps[currentStep - 1].classList.add('active');
            updateProgressBar();
        });
    });

    // Form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateStep(currentStep)) return;

        const formData = new FormData(signupForm);
        
        try {
            const profileData = {
                organisationName: formData.get('organisation_name'),
                organisationType: formData.get('organisation_type'),
                contactPerson: formData.get('contact_person'),
                phone: `${formData.get('country_code')}${formData.get('phone')}`,
                address: formData.get('address'),
                eventTypes: Array.from(document.querySelectorAll('input[name="event_types"]:checked'))
                    .map(cb => cb.value),
                teamSize: parseInt(formData.get('team_size'))
            };

            const result = await authHelpers.signUpOrganiser(
                formData.get('email'),
                formData.get('password'),
                profileData
            );

            if (result.error) throw result.error;

            showSuccessMessage(signupForm, 'Registration successful! Redirecting to dashboard...');
            // Redirect will be handled by auth state change listener
            
        } catch (error) {
            showErrorMessage(signupForm, error.message || 'An error occurred during registration');
        }
    });

    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(signinForm);

        try {
            const { error } = await authHelpers.signIn(
                formData.get('email'),
                formData.get('password')
            );

            if (error) throw error;

            showSuccessMessage(signinForm, 'Login successful! Redirecting to dashboard...');
            // Redirect will be handled by auth state change listener
            
        } catch (error) {
            showErrorMessage(signinForm, error.message || 'Invalid email or password');
        }
    });

    // Social login handlers
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const provider = button.classList.contains('google') ? 'google' :
                           button.classList.contains('facebook') ? 'facebook' :
                           button.classList.contains('apple') ? 'apple' : null;
            
            if (provider) {
                try {
                    const { error } = await authHelpers.signInWithProvider(provider);
                    if (error) throw error;
                } catch (error) {
                    showErrorMessage(
                        document.querySelector('.auth-form.active'),
                        `Error signing in with ${provider}: ${error.message}`
                    );
                }
            }
        });
    });

    // Password reset handler
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signin-email').value;
            
            if (!email) {
                showErrorMessage(signinForm, 'Please enter your email address');
                return;
            }

            try {
                const { error } = await authHelpers.resetPassword(email);
                if (error) throw error;
                
                showSuccessMessage(signinForm, 'Password reset instructions have been sent to your email');
            } catch (error) {
                showErrorMessage(signinForm, error.message);
            }
        });
    }

    // Validation functions
    function validateStep(step) {
        const currentStepElement = steps[step - 1];
        const inputs = currentStepElement.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value) {
                showError(input, 'This field is required');
                isValid = false;
            } else {
                clearError(input);
            }
        });

        // Additional validation for specific fields
        if (step === 1) {
            const email = document.getElementById('signup-email');
            const password = document.getElementById('signup-password');
            const confirmPassword = document.getElementById('confirm-password');

            if (email && !isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            }

            if (password && confirmPassword && password.value !== confirmPassword.value) {
                showError(confirmPassword, 'Passwords do not match');
                isValid = false;
            }
        }

        if (step === 2) {
            const teamSize = document.getElementById('team_size');
            if (teamSize && teamSize.value && parseInt(teamSize.value) < 1) {
                showError(teamSize, 'Team size must be at least 1');
                isValid = false;
            }
        }

        return isValid;
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function updateProgressBar() {
        const progress = (currentStep / steps.length) * 100;
        document.querySelector('.progress-bar').style.width = `${progress}%`;
    }

    function showError(field, message) {
        const errorDiv = field.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        } else {
            const div = document.createElement('div');
            div.className = 'error-message';
            div.textContent = message;
            field.parentNode.insertBefore(div, field.nextSibling);
        }
        field.classList.add('error');
    }

    function clearError(field) {
        const errorDiv = field.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.style.display = 'none';
        }
        field.classList.remove('error');
    }

    function showSuccessMessage(form, message) {
        const successDiv = form.querySelector('.success-message') || document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        if (!form.querySelector('.success-message')) {
            form.insertBefore(successDiv, form.firstChild);
        }
    }

    function showErrorMessage(form, message) {
        const errorDiv = form.querySelector('.form-error-message') || document.createElement('div');
        errorDiv.className = 'form-error-message';
        errorDiv.textContent = message;
        if (!form.querySelector('.form-error-message')) {
            form.insertBefore(errorDiv, form.firstChild);
        }
    }
});
