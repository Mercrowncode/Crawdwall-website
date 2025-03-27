import { auth } from './supabase-config.js';
import { AuthUI } from './auth-module.js';

// Debug log to verify script loading
console.log('Vendor Auth script loaded');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Vendor Auth...');
    
    try {
        // Create auth UI instance for vendor role
        const authUI = new AuthUI('vendor');
        
        // Log successful initialization
        console.log('Vendor Auth initialized with:', {
            role: 'vendor',
            authUI: authUI
        });

        // Get form elements
        const signupForm = document.getElementById('signup-form');
        const formSteps = signupForm.querySelectorAll('.form-step');
        const progressSteps = signupForm.querySelectorAll('.progress-bar .step');
        const nextButtons = signupForm.querySelectorAll('.next-btn');
        const backButtons = signupForm.querySelectorAll('.back-btn');
        let currentStep = 1;

        // Function to show a specific step
        function showStep(stepNumber) {
            console.log('Showing step:', stepNumber);
            
            // Update form steps
            formSteps.forEach(step => {
                step.classList.remove('active');
                if (step.getAttribute('data-step') === stepNumber.toString()) {
                    step.classList.add('active');
                }
            });

            // Update progress bar
            progressSteps.forEach((step, index) => {
                step.classList.toggle('active', index + 1 <= stepNumber);
            });

            currentStep = stepNumber;
        }

        // Function to validate current step
        function validateStep(stepNumber) {
            console.log('Validating step:', stepNumber);
            
            const currentStepElement = signupForm.querySelector(`.form-step[data-step="${stepNumber}"]`);
            const requiredFields = currentStepElement.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            // Additional validation for specific steps
            if (stepNumber === 2) {
                // Validate services selection
                const services = currentStepElement.querySelectorAll('input[name="services"]:checked');
                if (services.length === 0) {
                    isValid = false;
                    const servicesGroup = currentStepElement.querySelector('.checkbox-group');
                    servicesGroup.classList.add('error');
                }
            }

            if (stepNumber === 3) {
                // Validate service areas selection
                const serviceAreas = document.getElementById('service-areas');
                if (serviceAreas.selectedOptions.length === 0) {
                    isValid = false;
                    serviceAreas.classList.add('error');
                }
            }

            return isValid;
        }

        // Add click handlers for next buttons
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                const currentStepNumber = parseInt(button.closest('.form-step').getAttribute('data-step'));
                console.log('Next button clicked on step:', currentStepNumber);

                if (validateStep(currentStepNumber)) {
                    showStep(currentStepNumber + 1);
                } else {
                    console.log('Validation failed for step:', currentStepNumber);
                }
            });
        });

        // Add click handlers for back buttons
        backButtons.forEach(button => {
            button.addEventListener('click', () => {
                const currentStepNumber = parseInt(button.closest('.form-step').getAttribute('data-step'));
                console.log('Back button clicked on step:', currentStepNumber);
                showStep(currentStepNumber - 1);
            });
        });

        // Initialize form
        showStep(1);

    } catch (error) {
        console.error('Failed to initialize Vendor Auth:', error);
    }
});