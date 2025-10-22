-- Row Level Security (RLS) Policies for MANITO Platform
-- Run this SQL in your Supabase project

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own data" ON users
  FOR ALL USING (auth.uid()::text = id);

CREATE POLICY "Users can view public user data" ON users
  FOR SELECT USING (true);

-- Addresses table policies
CREATE POLICY "Users can manage their own addresses" ON addresses
  FOR ALL USING (auth.uid()::text = user_id);

-- Categories table policies
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'ADMIN'
    )
  );

-- Services table policies
CREATE POLICY "Anyone can view active services" ON services
  FOR SELECT USING (active = true);

CREATE POLICY "Pros can manage their own services" ON services
  FOR ALL USING (
    auth.uid()::text = pro_id AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'PRO'
    )
  );

CREATE POLICY "Admins can manage all services" ON services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'ADMIN'
    )
  );

-- Pro profiles table policies
CREATE POLICY "Pros can manage their own profile" ON pro_profiles
  FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Anyone can view public pro profiles" ON pro_profiles
  FOR SELECT USING (true);

-- KYC submissions table policies
CREATE POLICY "Users can view their own KYC submissions" ON kyc_submissions
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own KYC submissions" ON kyc_submissions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Admins can view all KYC submissions" ON kyc_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can update KYC submissions" ON kyc_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'ADMIN'
    )
  );

-- Bookings table policies
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (
    auth.uid()::text = client_id OR 
    auth.uid()::text = pro_id
  );

CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT WITH CHECK (
    auth.uid()::text = client_id AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'CLIENT'
    )
  );

CREATE POLICY "Users can update their own bookings" ON bookings
  FOR UPDATE USING (
    auth.uid()::text = client_id OR 
    auth.uid()::text = pro_id
  );

CREATE POLICY "Admins can manage all bookings" ON bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'ADMIN'
    )
  );

-- Inventory items table policies
CREATE POLICY "Pros can manage their own inventory" ON inventory_items
  FOR ALL USING (
    auth.uid()::text = pro_id AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'PRO'
    )
  );

-- Service materials table policies
CREATE POLICY "Pros can manage their own service materials" ON service_materials
  FOR ALL USING (
    auth.uid()::text = pro_id AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'PRO'
    )
  );

-- Reviews table policies
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their bookings" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid()::text = client_id AND
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = booking_id 
      AND bookings.client_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid()::text = client_id);

CREATE POLICY "Admins can manage all reviews" ON reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'ADMIN'
    )
  );

-- Audit logs table policies
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'ADMIN'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_kyc_status ON users(kyc_status);
CREATE INDEX IF NOT EXISTS idx_services_pro_id ON services(pro_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_pro_id ON bookings(pro_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_kyc_submissions_user_id ON kyc_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_submissions_status ON kyc_submissions(status);
CREATE INDEX IF NOT EXISTS idx_reviews_pro_id ON reviews(pro_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);
