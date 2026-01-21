-- Allow anyone to read tasks (no authentication required)
DROP POLICY IF EXISTS "Authenticated users can read tasks" ON public.tasks;
CREATE POLICY "Anyone can read tasks"
ON public.tasks
FOR SELECT
USING (true);

-- Allow anyone to create submissions (no authentication required)
DROP POLICY IF EXISTS "Authenticated users can create submissions" ON public.submissions;
CREATE POLICY "Anyone can create submissions"
ON public.submissions
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read submissions (for reports without login)
DROP POLICY IF EXISTS "Authenticated users can read submissions" ON public.submissions;
CREATE POLICY "Anyone can read submissions"
ON public.submissions
FOR SELECT
USING (true);