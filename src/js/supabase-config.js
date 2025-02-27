import { config } from './config.js';

// Initialize Supabase client
const { url: supabaseUrl, anonKey: supabaseAnonKey } = config.supabase;

// Debug log the configuration
console.log('Supabase Configuration:', {
    url: supabaseUrl,
    keyLength: supabaseAnonKey?.length
});

// Create Supabase client
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

// Verify client initialization
console.log('Supabase client initialized:', Boolean(supabase?.auth));

// Auth helper object
const auth = {
    async signIn(email, password) {
        try {
            console.log('Sign in attempt:', { email });
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            console.log('Sign in response:', { success: !error, error: error?.message });
            return { data, error };
        } catch (error) {
            console.error('Sign in error:', error);
            return { data: null, error };
        }
    },
    
    async signUp(email, password, metadata = {}) {
        try {
            // Debug log the incoming data
            console.log('Signup function called with:', {
                email: email || '[missing]',
                hasPassword: Boolean(password),
                metadata: metadata || {}
            });

            // Validate email and password
            if (!email || typeof email !== 'string') {
                throw new Error('Email is required and must be a string');
            }
            if (!password || typeof password !== 'string') {
                throw new Error('Password is required and must be a string');
            }

            // Validate role
            const validRoles = ['attendee', 'vendor', 'organiser', 'planner'];
            if (!validRoles.includes(metadata.role)) {
                throw new Error('Invalid role specified');
            }

            // Structure the signup data
            const signUpData = {
                email: email,
                password: password,
                options: {
                    data: metadata
                }
            };

            // Log the exact data being sent (excluding password)
            console.log('Sending signup data:', {
                email: signUpData.email,
                hasOptions: Boolean(signUpData.options),
                metadata: signUpData.options.data
            });

            // Make the signup request
            const { data, error } = await supabase.auth.signUp(signUpData);

            if (error) {
                console.error('Signup error:', error);
                throw error;
            }

            console.log('Signup successful:', {
                userId: data?.user?.id,
                email: data?.user?.email,
                metadata: data?.user?.user_metadata
            });

            return { data, error: null };
        } catch (error) {
            console.error('Sign up error:', error);
            return { data: null, error };
        }
    },
    
    async signOut() {
        try {
            return await supabase.auth.signOut();
        } catch (error) {
            console.error('Sign out error:', error);
            return { error };
        }
    },
    
    async signInWithProvider(provider) {
        try {
            return await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });
        } catch (error) {
            console.error('Social sign in error:', error);
            return { error };
        }
    }
};

// Auth state change handler
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session);
    if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user);
        // Redirect based on user role
        const userRole = session?.user?.user_metadata?.role;
        switch(userRole) {
            case 'attendee':
                window.location.href = '/attendee-dashboard';
                break;
            case 'vendor':
                window.location.href = '/vendor-dashboard';
                break;
            case 'planner':
                window.location.href = '/planner-dashboard';
                break;
            case 'organiser':
                window.location.href = '/organiser-dashboard';
                break;
            default:
                console.error('Unknown user role:', userRole);
        }
    } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        window.location.href = '/';
    }
});

// Export Supabase client and auth helper
export { supabase, auth };