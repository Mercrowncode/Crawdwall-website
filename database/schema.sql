-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('attendee', 'vendor', 'organiser', 'planner');

-- Create attendees table
CREATE TABLE IF NOT EXISTS attendees (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    city TEXT,
    interests TEXT[],
    marketing_preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (id)
);

-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    business_name TEXT,
    business_type TEXT,
    contact_person TEXT,
    phone TEXT,
    address TEXT,
    services TEXT[],
    service_areas TEXT[],
    business_license TEXT,
    tax_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (id)
);

-- Create organisers table
CREATE TABLE IF NOT EXISTS organisers (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    organisation_name TEXT,
    organisation_type TEXT,
    contact_person TEXT,
    phone TEXT,
    address TEXT,
    event_types TEXT[],
    team_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (id)
);

-- Create planners table
CREATE TABLE IF NOT EXISTS planners (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    full_name TEXT,
    company_name TEXT,
    experience_years INTEGER,
    specializations TEXT[],
    phone TEXT,
    portfolio_url TEXT,
    certifications TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (id)
);

-- Create user_roles table to track user types
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('attendee', 'vendor', 'organiser', 'planner')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (user_id)
);

-- Enable Row Level Security
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE organisers ENABLE ROW LEVEL SECURITY;
ALTER TABLE planners ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies

-- Attendees policies
CREATE POLICY "Users can view own attendee profile"
    ON attendees FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own attendee profile"
    ON attendees FOR UPDATE
    USING (auth.uid() = id);

-- Vendors policies
CREATE POLICY "Users can view own vendor profile"
    ON vendors FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own vendor profile"
    ON vendors FOR UPDATE
    USING (auth.uid() = id);

-- Organisers policies
CREATE POLICY "Users can view own organiser profile"
    ON organisers FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own organiser profile"
    ON organisers FOR UPDATE
    USING (auth.uid() = id);

-- Planners policies
CREATE POLICY "Users can view own planner profile"
    ON planners FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own planner profile"
    ON planners FOR UPDATE
    USING (auth.uid() = id);

-- User roles policies
CREATE POLICY "Users can view own role"
    ON user_roles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own role"
    ON user_roles FOR UPDATE
    USING (auth.uid() = user_id);

-- Insert policies for all tables
CREATE POLICY "Enable insert for authenticated users only"
    ON attendees FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only"
    ON vendors FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only"
    ON organisers FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only"
    ON planners FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only"
    ON user_roles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Function to automatically set updated_at on all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_attendees_updated_at
    BEFORE UPDATE ON attendees
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at
    BEFORE UPDATE ON vendors
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_organisers_updated_at
    BEFORE UPDATE ON organisers
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_planners_updated_at
    BEFORE UPDATE ON planners
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
