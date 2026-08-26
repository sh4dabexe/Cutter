-- Cutter URL Shortener Database Schema for Supabase

-- Create URLs table
CREATE TABLE IF NOT EXISTS public.urls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  short_code VARCHAR(12) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  title VARCHAR(255),
  clicks INT DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Analytics table
CREATE TABLE IF NOT EXISTS public.url_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url_id UUID REFERENCES public.urls(id) ON DELETE CASCADE NOT NULL,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  referrer TEXT DEFAULT 'Direct',
  user_agent TEXT,
  country VARCHAR(50) DEFAULT 'Global'
);

-- Enable RLS
ALTER TABLE public.urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.url_analytics ENABLE ROW LEVEL SECURITY;

-- Policies for public reading and creation
CREATE POLICY "Public URLs are readable by everyone" ON public.urls FOR SELECT USING (true);
CREATE POLICY "Anyone can insert short links" ON public.urls FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own links" ON public.urls FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own links" ON public.urls FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert analytics" ON public.url_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Public analytics are viewable" ON public.url_analytics FOR SELECT USING (true);
