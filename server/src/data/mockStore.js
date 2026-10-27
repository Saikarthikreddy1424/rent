// In-memory data store with comprehensive seed data for immediate testing
import crypto from 'crypto';

export const mockUsers = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'student@rentease.edu',
    full_name: 'Alex Rivera',
    phone: '+1 (555) 234-5678',
    role: 'student',
    college: 'Stanford University',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'owner@rentease.com',
    full_name: 'Marcus Vance',
    phone: '+1 (555) 876-5432',
    role: 'owner',
    college: 'UC Berkeley Partner',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'admin@rentease.com',
    full_name: 'Sarah Connor (Admin)',
    phone: '+1 (555) 999-0000',
    role: 'admin',
    college: 'RentEase HQ',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString()
  }
];

export const mockListings = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    owner_id: '00000000-0000-0000-0000-000000000002',
    owner_name: 'Marcus Vance',
    title: 'Sunny Studio Suite near Stanford Quad',
    description: 'Bright, newly renovated private studio apartment within a 5-minute bike ride to Stanford campus. Comes with high-speed fiber Wi-Fi, ergonomic study desk, modern kitchenette, and dedicated quiet hours for focused exam prep.',
    category: 'room',
    price: 850,
    price_period: 'month',
    deposit: 500,
    location: '452 College Ave, Palo Alto',
    city: 'Palo Alto',
    nearby_college: 'Stanford University',
    distance_to_college_km: 0.6,
    latitude: 37.4275,
    longitude: -122.1697,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: ['High-Speed Wi-Fi', 'Furnished', 'Laundry in Building', 'Air Conditioning', 'Study Desk', 'Bicycle Rack'],
    rental_rules: ['Quiet hours 10 PM - 7 AM', 'No smoking inside', 'Single occupancy only'],
    room_type: 'single',
    gender_preference: 'any',
    is_verified: true,
    is_available: true,
    contact_phone: '+1 (555) 876-5432',
    contact_email: 'owner@rentease.com',
    rating: 5.0,
    review_count: 12,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    owner_id: '00000000-0000-0000-0000-000000000002',
    owner_name: 'Marcus Vance',
    title: 'Campus Crest Student PG & Co-living with Meal Plans',
    description: 'Modern premium PG accommodations tailored for UC Berkeley students. Includes 3 nutritious meals daily, weekly housekeeping, biometric entry, power backup, and rooftop student study lounge.',
    category: 'pg_hostel',
    price: 620,
    price_period: 'month',
    deposit: 300,
    location: '2310 Telegraph Ave, Berkeley',
    city: 'Berkeley',
    nearby_college: 'UC Berkeley',
    distance_to_college_km: 0.4,
    latitude: 37.8688,
    longitude: -122.2590,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: ['Meal Service (3x)', 'High-Speed Wi-Fi', 'Biometric Security', 'Power Backup', 'Housekeeping', 'RO Purified Water'],
    rental_rules: ['Student ID mandatory', 'No loud music after 11 PM', 'Visitors allowed in lounge only'],
    room_type: 'shared_2',
    gender_preference: 'any',
    is_verified: true,
    is_available: true,
    contact_phone: '+1 (555) 876-5432',
    contact_email: 'owner@rentease.com',
    rating: 4.8,
    review_count: 19,
    created_at: new Date(Date.now() - 86400000 * 12).toISOString()
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    owner_id: '00000000-0000-0000-0000-000000000002',
    owner_name: 'Marcus Vance',
    title: 'Ergonomic Mesh Study Chair & Adjustable Desk Set',
    description: 'Save money on furniture! Rent this top-tier Herman Miller style ergonomic study chair and pneumatic height-adjustable study desk. Delivered to your dorm or rental and picked up at semester end.',
    category: 'furniture',
    price: 35,
    price_period: 'month',
    deposit: 50,
    location: 'Near Harvard Yard, Cambridge',
    city: 'Cambridge',
    nearby_college: 'Harvard University',
    distance_to_college_km: 0.3,
    latitude: 42.3736,
    longitude: -71.1097,
    images: [
      'https://images.unsplash.com/photo-1580481077195-c328ad4f305f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: ['Free Campus Delivery', 'Sanitized', 'Adjustable Height', 'Lumbar Support'],
    rental_rules: ['Return in clean condition', 'Deposit refunded upon inspection'],
    room_type: 'item',
    gender_preference: 'any',
    is_verified: true,
    is_available: true,
    contact_phone: '+1 (555) 876-5432',
    contact_email: 'owner@rentease.com',
    rating: 4.9,
    review_count: 8,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    owner_id: '00000000-0000-0000-0000-000000000002',
    owner_name: 'Marcus Vance',
    title: 'Trek 21-Speed City Commuter Bicycle + U-Lock & Helmet',
    description: 'Glide across campus in minutes! Lightweight aluminum frame 21-speed commuter bicycle, includes heavy-duty Kryptonite U-lock, night lights, and safety helmet. Free seasonal tune-up included.',
    category: 'bicycle',
    price: 25,
    price_period: 'month',
    deposit: 40,
    location: 'Kendall Square, Cambridge',
    city: 'Cambridge',
    nearby_college: 'MIT',
    distance_to_college_km: 0.5,
    latitude: 42.3601,
    longitude: -71.0942,
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: ['Heavy-duty U-Lock', 'Front & Rear LED Lights', 'Helmet Included', 'Free Maintenance'],
    rental_rules: ['Lock securely to bike racks only', 'Report any flat tires for free tube swap'],
    room_type: 'item',
    gender_preference: 'any',
    is_verified: true,
    is_available: true,
    contact_phone: '+1 (555) 876-5432',
    contact_email: 'owner@rentease.com',
    rating: 5.0,
    review_count: 14,
    created_at: new Date(Date.now() - 86400000 * 20).toISOString()
  },
  {
    id: '11111111-1111-1111-1111-111111111105',
    owner_id: '00000000-0000-0000-0000-000000000002',
    owner_name: 'Marcus Vance',
    title: 'Dell 27-inch 4K USB-C Hub Monitor for Students',
    description: 'Boost your productivity with single-cable USB-C charging and display. Perfect for coding, design, or research papers. Comes with HDMI and USB-C cables.',
    category: 'electronics',
    price: 40,
    price_period: 'month',
    deposit: 60,
    location: 'Morningside Heights, New York',
    city: 'New York',
    nearby_college: 'Columbia University',
    distance_to_college_km: 0.7,
    latitude: 40.8075,
    longitude: -73.9626,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: ['USB-C 90W Charging', '4K Ultra HD', 'HDMI Included', 'Anti-Glare Screen'],
    rental_rules: ['Keep in indoor dry areas', 'Original box provided for easy return'],
    room_type: 'item',
    gender_preference: 'any',
    is_verified: true,
    is_available: true,
    contact_phone: '+1 (555) 876-5432',
    contact_email: 'owner@rentease.com',
    rating: 4.7,
    review_count: 6,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: '11111111-1111-1111-1111-111111111106',
    owner_id: '00000000-0000-0000-0000-000000000002',
    owner_name: 'Marcus Vance',
    title: '2BHK Student Shared Flat with Balcony & Kitchen',
    description: 'Spacious 2-bedroom shared apartment ideal for 2-4 college roommates. Fully furnished with modular kitchen, microwave, refrigerator, laundry, and sunlit balcony overlooking the park.',
    category: 'flat',
    price: 1250,
    price_period: 'month',
    deposit: 800,
    location: 'University Way NE, Seattle',
    city: 'Seattle',
    nearby_college: 'University of Washington',
    distance_to_college_km: 0.8,
    latitude: 47.6553,
    longitude: -122.3035,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: ['Full Kitchen', 'Balcony', 'Washing Machine', 'High-Speed Wi-Fi', 'Parking Spot', 'Microwave'],
    rental_rules: ['Utilities split evenly', 'Quiet hours after 10:30 PM', 'Pet friendly upon request'],
    room_type: 'entire_flat',
    gender_preference: 'any',
    is_verified: true,
    is_available: true,
    contact_phone: '+1 (555) 876-5432',
    contact_email: 'owner@rentease.com',
    rating: 4.9,
    review_count: 11,
    created_at: new Date(Date.now() - 86400000 * 15).toISOString()
  }
];

export const mockBookings = [
  {
    id: '22222222-2222-2222-2222-222222222201',
    listing_id: '11111111-1111-1111-1111-111111111101',
    listing_title: 'Sunny Studio Suite near Stanford Quad',
    student_id: '00000000-0000-0000-0000-000000000001',
    student_name: 'Alex Rivera',
    student_email: 'student@rentease.edu',
    move_in_date: '2026-11-01',
    rental_duration_months: 6,
    message: 'Hi Marcus! I am an incoming graduate student at Stanford looking for a quiet, reliable studio. Looking forward to moving in!',
    status: 'accepted',
    owner_notes: 'Welcome Alex! Lease agreement details sent to your email.',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

export const mockFavorites = [
  {
    id: '33333333-3333-3333-3333-333333333301',
    user_id: '00000000-0000-0000-0000-000000000001',
    listing_id: '11111111-1111-1111-1111-111111111101',
    created_at: new Date().toISOString()
  },
  {
    id: '33333333-3333-3333-3333-333333333302',
    user_id: '00000000-0000-0000-0000-000000000001',
    listing_id: '11111111-1111-1111-1111-111111111103',
    created_at: new Date().toISOString()
  }
];

export const mockReviews = [
  {
    id: '44444444-4444-4444-4444-444444444401',
    listing_id: '11111111-1111-1111-1111-111111111101',
    user_id: '00000000-0000-0000-0000-000000000001',
    user_name: 'Alex Rivera',
    rating: 5,
    comment: 'Absolutely loved living here! The Wi-Fi is blazing fast for online classes, and the landlord Marcus is super responsive whenever anything is needed.',
    is_verified_rental: true,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString()
  }
];

export const mockReports = [
  {
    id: '55555555-5555-5555-5555-555555555501',
    reporter_id: '00000000-0000-0000-0000-000000000001',
    reporter_name: 'Alex Rivera',
    listing_id: '11111111-1111-1111-1111-111111111106',
    listing_title: '2BHK Student Shared Flat with Balcony & Kitchen',
    reason: 'Price clarification requested',
    details: 'Asked about parking fees inclusion in utility breakdown.',
    status: 'reviewed',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];
