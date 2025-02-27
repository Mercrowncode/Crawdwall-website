// Import auth helpers
import { auth } from './supabase-config.js';
import { AuthUI } from './auth-module.js';

// Debug log to verify script loading
console.log('Attendee Auth script loaded');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Attendee Auth...');
    
    try {
        // Create auth UI instance for attendee role
        const authUI = new AuthUI('attendee');
        
        // Log successful initialization
        console.log('Attendee Auth initialized with:', {
            role: 'attendee',
            authUI: authUI
        });

        // Add social login handlers
        const socialButtons = document.querySelectorAll('.social-btn');
        socialButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const provider = button.classList.contains('google') ? 'google' :
                               button.classList.contains('facebook') ? 'facebook' :
                               button.classList.contains('apple') ? 'apple' : null;
                
                if (!provider) {
                    console.error('Unknown social provider');
                    return;
                }

                try {
                    // Disable all social buttons during auth
                    socialButtons.forEach(btn => btn.disabled = true);
                    
                    // Call the appropriate auth method
                    const { error } = await authUI.showSignInWithProvider(provider);
                    if (error) throw error;
                } catch (error) {
                    console.error('Social login error:', error);
                    // Show error in the signup form since that's where social buttons are
                    const signupForm = document.getElementById('signup-form');
                    if (signupForm) {
                        authUI.showErrorMessage(signupForm, 'Failed to login with ' + provider);
                    }
                } finally {
                    // Re-enable social buttons
                    socialButtons.forEach(btn => btn.disabled = false);
                }
            });
        });

    } catch (error) {
        console.error('Failed to initialize Attendee Auth:', error);
    }
});