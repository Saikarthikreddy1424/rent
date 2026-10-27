-- ========================================================
-- RentEase: Student Accommodation & Item Rental Platform
-- Complete PostgreSQL Schema with Row-Level Security (RLS)
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'owner', 'admin')) DEFAULT 'student',
    college TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. LISTINGS TABLE
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'room', 
        'pg_hostel', 
        'flat', 
        'furniture', 
        'electronics', 
        'bicycle', 
        'essentials'
    )),
    price NUMERIC NOT NULL CHECK (price >= 0),
    price_period TEXT NOT NULL DEFAULT 'month' CHECK (price_period IN ('month', 'day', 'semester')),
    deposit NUMERIC DEFAULT 0,
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    nearby_college TEXT NOT NULL,
    distance_to_college_km NUMERIC DEFAULT 1.0,
    latitude NUMERIC DEFAULT 37.7749,
    longitude NUMERIC DEFAULT -122.4194,
    images TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    rental_rules TEXT[] DEFAULT '{}',
    room_type TEXT DEFAULT 'single' CHECK (room_type IN ('single', 'shared_2', 'shared_3', 'entire_flat', 'item')),
    gender_preference TEXT DEFAULT 'any' CHECK (gender_preference IN ('any', 'male_only', 'female_only')),
    is_verified BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    contact_phone TEXT,
    contact_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. LISTING IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.listing_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, listing_id)
);

-- 5. BOOKING REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.booking_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    move_in_date DATE NOT NULL,
    rental_duration_months INTEGER DEFAULT 1,
    message TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')) DEFAULT 'pending',
    owner_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_verified_rental BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(listing_id, user_id)
);

-- 7. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    reported_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'reviewed', 'dismissed', 'action_taken')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_city ON public.listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_nearby_college ON public.listings(nearby_college);
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_owner_id ON public.listings(owner_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_student ON public.booking_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_listing ON public.booking_requests(listing_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_listing ON public.reviews(listing_id);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, self update
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Listings: Everyone can view available, owners can manage
CREATE POLICY "Listings are viewable by everyone" 
ON public.listings FOR SELECT USING (true);

CREATE POLICY "Owners can insert their own listings" 
ON public.listings FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own listings" 
ON public.listings FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own listings" 
ON public.listings FOR DELETE USING (auth.uid() = owner_id);

-- Booking Requests: Students can create and view their own; owners can view and update requests for their listings
CREATE POLICY "Students can view their own booking requests" 
ON public.booking_requests FOR SELECT USING (
    auth.uid() = student_id OR 
    EXISTS (SELECT 1 FROM public.listings WHERE listings.id = booking_requests.listing_id AND listings.owner_id = auth.uid())
);

CREATE POLICY "Students can insert booking requests" 
ON public.booking_requests FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students or owners can update booking requests" 
ON public.booking_requests FOR UPDATE USING (
    auth.uid() = student_id OR 
    EXISTS (SELECT 1 FROM public.listings WHERE listings.id = booking_requests.listing_id AND listings.owner_id = auth.uid())
);

-- Reviews: Viewable by all, insert/update/delete by author
CREATE POLICY "Reviews are viewable by everyone" 
ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" 
ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" 
ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" 
ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Favorites: Viewable and manageable by user
CREATE POLICY "Users can manage their own favorites" 
ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- Reports: Only admins or reporter can see, authenticated can insert
CREATE POLICY "Users can insert reports" 
ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Reporters or admins can view reports" 
ON public.reports FOR SELECT USING (
    auth.uid() = reporter_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
