-- Create a new storage bucket for experience images if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'experience-images'
    ) THEN
        INSERT INTO storage.buckets (id, name, public) 
        VALUES ('experience-images', 'experience-images', true);
    END IF;
END $$;

-- Set up storage policies
CREATE POLICY "Anyone can upload experience images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'experience-images');

CREATE POLICY "Anyone can view experience images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'experience-images'); 