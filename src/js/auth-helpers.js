import { supabase } from './supabase-config.js';

export const authHelpers = {
    // Attendee signup and profile creation
    async signUpAttendee(email, password, profileData) {
        try {
            // Sign up the user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        role: 'attendee'
                    }
                }
            });
            
            if (authError) throw authError;

            // Create attendee profile
            const { error: profileError } = await supabase
                .from('attendee_profiles')
                .upsert({
                    user_id: authData.user.id,
                    full_name: profileData.fullName,
                    phone: profileData.phone,
                    city: profileData.city,
                    interests: profileData.interests,
                    marketing_consent: profileData.marketingConsent
                });

            if (profileError) throw profileError;
            return { data: authData, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Vendor signup and profile creation
    async signUpVendor(email, password, profileData) {
        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        role: 'vendor'
                    }
                }
            });
            
            if (authError) throw authError;

            const { error: profileError } = await supabase
                .from('vendor_profiles')
                .upsert({
                    user_id: authData.user.id,
                    business_name: profileData.businessName,
                    business_type: profileData.businessType,
                    contact_person: profileData.contactPerson,
                    phone: profileData.phone,
                    address: profileData.address,
                    services: profileData.services,
                    service_areas: profileData.serviceAreas,
                    business_license: profileData.businessLicense,
                    tax_id: profileData.taxId
                });

            if (profileError) throw profileError;
            return { data: authData, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Organiser signup and profile creation
    async signUpOrganiser(email, password, profileData) {
        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        role: 'organiser'
                    }
                }
            });
            
            if (authError) throw authError;

            const { error: profileError } = await supabase
                .from('organiser_profiles')
                .upsert({
                    user_id: authData.user.id,
                    organisation_name: profileData.organisationName,
                    organisation_type: profileData.organisationType,
                    contact_person: profileData.contactPerson,
                    phone: profileData.phone,
                    address: profileData.address,
                    event_types: profileData.eventTypes,
                    team_size: profileData.teamSize
                });

            if (profileError) throw profileError;
            return { data: authData, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Get organizer profile
    async getOrganizerProfile() {
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;

            const { data, error } = await supabase
                .from('organiser_profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) throw error;
            return { profile: data, error: null };
        } catch (error) {
            return { profile: null, error };
        }
    },

    // Update organizer profile
    async updateOrganizerProfile(profileData) {
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;

            const { data, error } = await supabase
                .from('organiser_profiles')
                .update(profileData)
                .eq('user_id', user.id);

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Sign in
    async signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Sign out
    async signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { error: null };
        } catch (error) {
            return { error };
        }
    },

    // Password reset
    async resetPassword(email) {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) throw error;
            return { error: null };
        } catch (error) {
            return { error };
        }
    }
};
