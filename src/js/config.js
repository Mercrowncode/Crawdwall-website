// Development configuration
// TODO: Replace these values with environment variables in production
export const config = {
    supabase: {
        url: 'https://dfphvdlwunevssihrzlb.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmcGh2ZGx3dW5ldnNzaWhyemxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1OTAxNTQsImV4cCI6MjA1NjE2NjE1NH0.JHACMVWsnXeBgOaKqjUIgoeJ2ycun02myxqqVew1mfs'
    },
    email: {
        // Replace with your Zoho Mail credentials
        user: 'noreply@crawdwall.com',
        password: 'YOUR_APP_SPECIFIC_PASSWORD', // Use an app-specific password for security
        fromName: 'Crawdwall'
    }
}
