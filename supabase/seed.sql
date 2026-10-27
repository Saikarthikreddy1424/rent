-- ========================================================
-- RentEase: Initial Seed Data for Testing & Demonstration
-- ========================================================

-- Insert Sample Profiles (Students, Owners, Admin)
INSERT INTO public.profiles (id, email, full_name, phone, role, college, avatar_url) VALUES
('00000000-0000-0000-0000-000000000001', 'student@rentease.edu', 'Alex Rivera', '+1 (555) 234-5678', 'student', 'Stanford University', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
('00000000-0000-0000-0000-000000000002', 'owner@rentease.com', 'Marcus Vance', '+1 (555) 876-5432', 'owner', 'UC Berkeley Partner', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
('00000000-0000-0000-0000-000000000003', 'admin@rentease.com', 'Sarah Connor (Admin)', '+1 (555) 999-0000', 'admin', 'RentEase HQ', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Listings
INSERT INTO public.listings (
    id, owner_id, title, description, category, price, price_period, deposit,
    location, city, nearby_college, distance_to_college_km, latitude, longitude,
    images, amenities, rental_rules, room_type, gender_preference, is_verified, is_available,
    contact_phone, contact_email
) VALUES
(
    '11111111-1111-1111-1111-111111111101',
    '00000000-0000-0000-0000-000000000002',
    'Sunny Studio Suite near Stanford Quad',
    'Bright, newly renovated private studio apartment within a 5-minute bike ride to Stanford campus. Comes with high-speed fiber Wi-Fi, ergonomic study desk, modern kitchenette, and dedicated quiet hours for focused exam prep.',
    'room',
    850,
    'month',
    500,
    '452 College Ave, Palo Alto',
    'Palo Alto',
    'Stanford University',
    0.6,
    37.4275,
    -122.1697,
    ARRAY[
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop&q=80'
    ],
    ARRAY['High-Speed Wi-Fi', 'Furnished', 'Laundry in Building', 'Air Conditioning', 'Study Desk', 'Bicycle Rack'],
    ARRAY['Quiet hours 10 PM - 7 AM', 'No smoking inside', 'Single occupancy only'],
    'single',
    'any',
    true,
    true,
    '+1 (555) 876-5432',
    'owner@rentease.com'
),
(
    '11111111-1111-1111-1111-111111111102',
    '00000000-0000-0000-0000-000000000002',
    'Campus Crest Student PG & Co-living with Meal Plans',
    'Modern premium PG accommodations tailored for UC Berkeley students. Includes 3 nutritious meals daily, weekly housekeeping, biometric entry, power backup, and rooftop student study lounge.',
    'pg_hostel',
    620,
    'month',
    300,
    '2310 Telegraph Ave, Berkeley',
    'Berkeley',
    'UC Berkeley',
    0.4,
    37.8688,
    -122.2590,
    ARRAY[
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80'
    ],
    ARRAY['Meal Service (3x)', 'High-Speed Wi-Fi', 'Biometric Security', 'Power Backup', 'Housekeeping', 'RO Purified Water'],
    ARRAY['Student ID mandatory', 'No loud music after 11 PM', 'Visitors allowed in lounge only'],
    'shared_2',
    'any',
    true,
    true,
    '+1 (555) 876-5432',
    'owner@rentease.com'
),
(
    '11111111-1111-1111-1111-111111111103',
    '00000000-0000-0000-0000-000000000002',
    'Ergonomic Mesh Study Chair & Adjustable Desk Set',
    'Save money on furniture! Rent this top-tier Herman Miller style ergonomic study chair and pneumatic height-adjustable study desk. Delivered to your dorm or rental and picked up at semester end.',
    'furniture',
    35,
    'month',
    50,
    'Near Harvard Yard, Cambridge',
    'Cambridge',
    'Harvard University',
    0.3,
    42.3736,
    -71.1097,
    ARRAY[
        'https://images.unsplash.com/photo-1580481077195-c328ad4f305f?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80'
    ],
    ARRAY['Free Campus Delivery', 'Sanitized', 'Adjustable Height', 'Lumbar Support'],
    ARRAY['Return in clean condition', 'Deposit refunded upon inspection'],
    'item',
    'any',
    true,
    true,
    '+1 (555) 876-5432',
    'owner@rentease.com'
),
(
    '11111111-1111-1111-1111-111111111104',
    '00000000-0000-0000-0000-000000000002',
    'Trek 21-Speed City Commuter Bicycle + U-Lock & Helmet',
    'Glide across campus in minutes! Lightweight aluminum frame 21-speed commuter bicycle, includes heavy-duty Kryptonite U-lock, night lights, and safety helmet. Free seasonal tune-up included.',
    'bicycle',
    25,
    'month',
    40,
    'Kendall Square, Cambridge',
    'Cambridge',
    'MIT (Massachusetts Institute of Technology)',
    0.5,
    42.3601,
    -71.0942,
    ARRAY[
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&auto=format&fit=crop&q=80'
    ],
    ARRAY['Heavy-duty U-Lock', 'Front & Rear LED Lights', 'Helmet Included', 'Free Maintenance'],
    ARRAY['Lock securely to bike racks only', 'Report any flat tires for free tube swap'],
    'item',
    'any',
    true,
    true,
    '+1 (555) 876-5432',
    'owner@rentease.com'
),
(
    '11111111-1111-1111-1111-111111111105',
    '00000000-0000-0000-0000-000000000002',
    'Dell 27-inch 4K USB-C Hub Monitor for Students',
    'Boost your productivity with single-cable USB-C charging and display. Perfect for coding, design, or research papers. Comes with HDMI and USB-C cables.',
    'electronics',
    40,
    'month',
    60,
    'Morningside Heights, New York',
    'New York',
    'Columbia University',
    0.7,
    40.8075,
    -73.9626,
    ARRAY[
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80'
    ],
    ARRAY['USB-C 90W Charging', '4K Ultra HD', 'HDMI Included', 'Anti-Glare Screen'],
    ARRAY['Keep in indoor dry areas', 'Original box provided for easy return'],
    'item',
    'any',
    true,
    true,
    '+1 (555) 876-5432',
    'owner@rentease.com'
),
(
    '11111111-1111-1111-1111-111111111106',
    '00000000-0000-0000-0000-000000000002',
    '2BHK Student Shared Flat with Balcony & Kitchen',
    'Spacious 2-bedroom shared apartment ideal for 2-4 college roommates. Fully furnished with modular kitchen, microwave, refrigerator, laundry, and sunlit balcony overlooking the park.',
    'flat',
    1250,
    'month',
    800,
    'University Way NE, Seattle',
    'Seattle',
    'University of Washington',
    0.8,
    47.6553,
    -122.3035,
    ARRAY[
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80'
    ],
    ARRAY['Full Kitchen', 'Balcony', 'Washing Machine', 'High-Speed Wi-Fi', 'Parking Spot', 'Microwave'],
    ARRAY['Utilities split evenly', 'Quiet hours after 10:30 PM', 'Pet friendly upon request'],
    'entire_flat',
    'any',
    true,
    true,
    '+1 (555) 876-5432',
    'owner@rentease.com'
);

-- Insert Sample Reviews
INSERT INTO public.reviews (listing_id, user_id, rating, comment, is_verified_rental) VALUES
(
    '11111111-1111-1111-1111-111111111101',
    '00000000-0000-0000-0000-000000000001',
    5,
    'Absolutely loved living here during my summer quarter! The Wi-Fi is super fast for Zoom lectures, and riding to Stanford took only 5 minutes. Marcus is an awesome landlord.',
    true
),
(
    '11111111-1111-1111-1111-111111111102',
    '00000000-0000-0000-0000-000000000001',
    5,
    'The food plan is a lifesaver when you are cramming during midterms! Clean rooms and great student community.',
    true
)
ON CONFLICT (listing_id, user_id) DO NOTHING;
