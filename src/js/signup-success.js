import { auth } from './supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    const dashboardBtn = document.querySelector('.dashboard-btn');
    
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            try {
                // Get current session
                const { data: { session }, error } = await auth.getSession();
                if (error) throw error;

                // Get user role from session or URL parameters
                let role = session?.user?.user_metadata?.role;
                if (!role) {
                    const urlParams = new URLSearchParams(window.location.search);
                    role = urlParams.get('role') || 'attendee';
                }
                
                // Redirect to appropriate dashboard
                switch(role) {
                    case 'organiser':
                        window.location.href = '/organiser-dashboard';
                        break;
                    case 'vendor':
                        window.location.href = '/vendor-dashboard';
                        break;
                    case 'planner':
                        window.location.href = '/planner-dashboard';
                        break;
                    default:
                        window.location.href = '/attendee-dashboard';
                }
            } catch (error) {
                console.error('Failed to redirect to dashboard:', error);
                // Fallback to attendee dashboard if something goes wrong
                window.location.href = '/attendee-dashboard';
            }
        });
    }

    // Auto-redirect after 3 seconds
    setTimeout(() => {
        if (dashboardBtn) {
            dashboardBtn.click();
        }
    }, 3000);
});
