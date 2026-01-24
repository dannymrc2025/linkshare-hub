-- Drop existing restrictive update policy
DROP POLICY IF EXISTS "Only teachers can update submissions" ON public.submissions;

-- Create new policy that allows anyone to update submissions
CREATE POLICY "Anyone can update submissions"
ON public.submissions
FOR UPDATE
USING (true)
WITH CHECK (true);