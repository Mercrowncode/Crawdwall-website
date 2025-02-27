import { supabase, auth } from './supabase-config.js';

// Test connection
async function testConnection() {
    try {
        const { data, error } = await supabase.from('test').select('*').limit(1);
        if (error) {
            console.error('Connection error:', error.message);
        } else {
            console.log('Successfully connected to Supabase!');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Test auth state
async function checkAuthState() {
    try {
        const { session, error } = await auth.getSession();
        if (error) {
            console.error('Auth state error:', error.message);
        } else {
            console.log('Current session:', session);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run tests
testConnection();
checkAuthState();
