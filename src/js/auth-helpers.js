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

    // Planner signup and profile creation
    async signUpPlanner(email, password, profileData) {
        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        role: 'planner'
                    }
                }
            });
            
            if (authError) throw authError;

            const { error: profileError } = await supabase
                .from('planner_profiles')
                .upsert({
                    user_id: authData.user.id,
                    full_name: profileData.fullName,
                    company_name: profileData.companyName,
                    experience_years: profileData.experienceYears,
                    specializations: profileData.specializations,
                    phone: profileData.phone,
                    portfolio_url: profileData.portfolioUrl,
                    certifications: profileData.certifications
                });

            if (profileError) throw profileError;
            return { data: authData, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Get user profile based on role
    async getUserProfile() {
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;

            const role = user.user_metadata.role;
            let profile;

            switch (role) {
                case 'attendee':
                    profile = await supabase
                        .from('attendee_profiles')
                        .select('*')
                        .eq('user_id', user.id)
                        .single();
                    break;
                case 'vendor':
                    profile = await supabase
                        .from('vendor_profiles')
                        .select('*')
                        .eq('user_id', user.id)
                        .single();
                    break;
                case 'organiser':
                    profile = await supabase
                        .from('organiser_profiles')
                        .select('*')
                        .eq('user_id', user.id)
                        .single();
                    break;
                case 'planner':
                    profile = await supabase
                        .from('planner_profiles')
                        .select('*')
                        .eq('user_id', user.id)
                        .single();
                    break;
                default:
                    throw new Error('Invalid user role');
            }

            if (profile.error) throw profile.error;
            return { profile: profile.data, error: null };
        } catch (error) {
            return { profile: null, error };
        }
    },

    // Update user profile based on role
    async updateProfile(profileData) {
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;

            const role = user.user_metadata.role;
            let updateResult;

            switch (role) {
                case 'attendee':
                    updateResult = await supabase
                        .from('attendee_profiles')
                        .update(profileData)
                        .eq('user_id', user.id);
                    break;
                case 'vendor':
                    updateResult = await supabase
                        .from('vendor_profiles')
                        .update(profileData)
                        .eq('user_id', user.id);
                    break;
                case 'organiser':
                    updateResult = await supabase
                        .from('organiser_profiles')
                        .update(profileData)
                        .eq('user_id', user.id);
                    break;
                case 'planner':
                    updateResult = await supabase
                        .from('planner_profiles')
                        .update(profileData)
                        .eq('user_id', user.id);
                    break;
                default:
                    throw new Error('Invalid user role');
            }

            if (updateResult.error) throw updateResult.error;
            return { data: updateResult.data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }
};
