-- Allow new users to insert their own role during signup
-- This is needed because new users don't have any role yet
DROP POLICY IF EXISTS "Only teachers can insert roles" ON public.user_roles;

CREATE POLICY "Users can insert their own role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);