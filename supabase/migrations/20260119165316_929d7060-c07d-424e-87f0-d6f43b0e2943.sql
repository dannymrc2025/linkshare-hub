-- Create tasks table for storing tasks created by teachers
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  max_members INTEGER NOT NULL DEFAULT 1 CHECK (max_members >= 1 AND max_members <= 4),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create submissions table for storing student submissions
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  members TEXT[] NOT NULL,
  group_name TEXT NOT NULL,
  link TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required for this educational tool)
-- Tasks: Anyone can read and create tasks
CREATE POLICY "Anyone can read tasks" 
ON public.tasks 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create tasks" 
ON public.tasks 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can delete tasks" 
ON public.tasks 
FOR DELETE 
USING (true);

-- Submissions: Anyone can read, create, and delete submissions
CREATE POLICY "Anyone can read submissions" 
ON public.submissions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create submissions" 
ON public.submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can delete submissions" 
ON public.submissions 
FOR DELETE 
USING (true);