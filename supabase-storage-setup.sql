-- Supabase Storage Setup for MANITO Platform
-- Run this SQL in your Supabase project

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('kyc-documents', 'kyc-documents', false),
  ('job-evidence', 'job-evidence', false),
  ('user-avatars', 'user-avatars', true);

-- Set up RLS policies for kyc-documents bucket
CREATE POLICY "Users can upload their own KYC documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'kyc-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own KYC documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'kyc-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all KYC documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'kyc-documents' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'ADMIN'
    )
  );

-- Set up RLS policies for job-evidence bucket
CREATE POLICY "Users can upload job evidence" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'job-evidence' AND
    (
      auth.uid()::text = (storage.foldername(name))[1] OR
      EXISTS (
        SELECT 1 FROM bookings 
        WHERE bookings.id = (storage.foldername(name))[1]::uuid
        AND (bookings.client_id = auth.uid() OR bookings.pro_id = auth.uid())
      )
    )
  );

CREATE POLICY "Users can view job evidence" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'job-evidence' AND
    (
      auth.uid()::text = (storage.foldername(name))[1] OR
      EXISTS (
        SELECT 1 FROM bookings 
        WHERE bookings.id = (storage.foldername(name))[1]::uuid
        AND (bookings.client_id = auth.uid() OR bookings.pro_id = auth.uid())
      )
    )
  );

-- Set up RLS policies for user-avatars bucket
CREATE POLICY "Users can upload their own avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view all avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can update their own avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user-avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user-avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_id ON storage.objects(bucket_id);
CREATE INDEX IF NOT EXISTS idx_storage_objects_name ON storage.objects(name);
CREATE INDEX IF NOT EXISTS idx_storage_objects_owner ON storage.objects(owner);
