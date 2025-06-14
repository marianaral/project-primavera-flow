
-- Add status column to expenses table
ALTER TABLE public.expenses 
ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';

-- Add a check constraint to ensure only valid status values
ALTER TABLE public.expenses 
ADD CONSTRAINT expenses_status_check 
CHECK (status IN ('pending', 'approved', 'rejected'));
