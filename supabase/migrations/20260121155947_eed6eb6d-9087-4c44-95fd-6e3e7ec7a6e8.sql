-- Add grade and observations columns to submissions table
ALTER TABLE public.submissions 
ADD COLUMN grade text,
ADD COLUMN observations text;

-- Create policy to allow updates on submissions (needed for grading)
CREATE POLICY "Anyone can update submissions" 
ON public.submissions 
FOR UPDATE 
USING (true)
WITH CHECK (true);