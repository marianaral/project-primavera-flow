
-- Add actual_hours column to tasks table
ALTER TABLE public.tasks 
ADD COLUMN actual_hours numeric DEFAULT 0;
