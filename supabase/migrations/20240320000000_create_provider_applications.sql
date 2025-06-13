-- Create provider_applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS provider_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name TEXT NOT NULL,
    email TEXT NOT NULL,
    contact_no TEXT NOT NULL,
    experience_name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    location TEXT NOT NULL,
    duration TEXT NOT NULL,
    participants TEXT NOT NULL,
    date DATE NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'idx_provider_applications_status'
    ) THEN
        CREATE INDEX idx_provider_applications_status ON provider_applications(status);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'idx_provider_applications_created_at'
    ) THEN
        CREATE INDEX idx_provider_applications_created_at ON provider_applications(created_at);
    END IF;
END $$;

-- Add RLS policies
ALTER TABLE provider_applications ENABLE ROW LEVEL SECURITY;

-- Allow admins to read all applications
CREATE POLICY "Admins can read all provider applications"
    ON provider_applications FOR SELECT
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');

-- Allow admins to update application status
CREATE POLICY "Admins can update provider applications"
    ON provider_applications FOR UPDATE
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');

-- Allow anyone to create applications
CREATE POLICY "Anyone can create provider applications"
    ON provider_applications FOR INSERT
    TO public
    WITH CHECK (true); 