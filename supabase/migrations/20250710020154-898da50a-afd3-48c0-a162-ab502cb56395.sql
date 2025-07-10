
-- Create enum types for better data integrity
CREATE TYPE public.sign_type AS ENUM ('pylon', 'channel_letters', 'monument', 'wall', 'flat_cutout');
CREATE TYPE public.quality_level AS ENUM ('basic', 'standard', 'premium');
CREATE TYPE public.complexity_level AS ENUM ('low', 'medium', 'high');

-- Create the sign_projects table
CREATE TABLE public.sign_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    sign_type public.sign_type NOT NULL,
    height DECIMAL(8,2) NOT NULL CHECK (height > 0),
    width DECIMAL(8,2) NOT NULL CHECK (width > 0),
    material_type TEXT NOT NULL,
    paint_colors INTEGER NOT NULL DEFAULT 1 CHECK (paint_colors > 0),
    has_lighting BOOLEAN NOT NULL DEFAULT false,
    quality public.quality_level NOT NULL,
    complexity public.complexity_level NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL CHECK (total_cost >= 0),
    material_cost DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (material_cost >= 0),
    labor_cost DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (labor_cost >= 0),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create an index on sign_type for faster queries
CREATE INDEX idx_sign_projects_sign_type ON public.sign_projects(sign_type);

-- Create an index on quality for analytics queries
CREATE INDEX idx_sign_projects_quality ON public.sign_projects(quality);

-- Create an index on created_at for time-based queries
CREATE INDEX idx_sign_projects_created_at ON public.sign_projects(created_at);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sign_projects_updated_at
    BEFORE UPDATE ON public.sign_projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security (RLS) - for now, allow all authenticated users to access all projects
-- You can modify these policies later based on your access control needs
ALTER TABLE public.sign_projects ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to view all projects
CREATE POLICY "Allow authenticated users to view all sign projects"
    ON public.sign_projects
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy to allow authenticated users to insert projects
CREATE POLICY "Allow authenticated users to insert sign projects"
    ON public.sign_projects
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy to allow authenticated users to update projects
CREATE POLICY "Allow authenticated users to update sign projects"
    ON public.sign_projects
    FOR UPDATE
    TO authenticated
    USING (true);

-- Policy to allow authenticated users to delete projects
CREATE POLICY "Allow authenticated users to delete sign projects"
    ON public.sign_projects
    FOR DELETE
    TO authenticated
    USING (true);
