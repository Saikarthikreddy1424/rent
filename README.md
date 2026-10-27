# 🎓 RentEase — Student Accommodation & Essential Rental Platform

> A comprehensive, modern, student-centric rental marketplace connecting university students with affordable accommodation (rooms, PGs, shared flats) and essential items (study desks, ergonomic chairs, monitors, appliances, commuter bicycles) near campus.

---

## 🌟 Key Features

### 1. User Authentication & Multi-Role Access
- **Student & Property Owner Portals**: Dedicated authentication flows with college affiliation and role-based permissions (`student`, `owner`, `admin`).
- **Instant Demo Persona Switcher**: In the navigation bar, test instantaneously as:
  - 🎓 **Alex Rivera (Student)**: Stanford University
  - 🏠 **Marcus Vance (Property Owner)**: UC Berkeley Partner
  - 🛡️ **Sarah Connor (Platform Administrator)**: RentEase HQ
- **Forgot Password Flow**: Email recovery simulation.

### 2. Rental Listings Catalog
- **6 Supported Categories**:
  1. **Rooms & Shared Accommodation**: Private & double-sharing student rooms.
  2. **PG & Hostel Accommodations**: Co-living with included 3x meal plans, Wi-Fi, and housekeeping.
  3. **Flats & Apartments**: 1-3 BHK student shared spaces with kitchens & balconies.
  4. **Study Furniture**: Ergonomic mesh chairs, standing desks, twin beds.
  5. **Electronics**: 4K USB-C monitors, microwave ovens, mini-fridges.
  6. **Campus Commuter Bicycles**: 21-speed road bikes with U-locks and helmets.
- **Listing Attributes**: Rent price, billing period (month/semester/day), security deposit, campus proximity distance, address, amenities checklist, house rules, high-res photos, and owner contact details.

### 3. Innovative Student Features
- 🎯 **Budget Match AI**: Input your monthly stipend, and the platform automatically finds all rentals and essential gear within your budget.
- 📍 **Campus Nearby Discovery**: Filter listings by walking/biking distance to major university campuses (Stanford, UC Berkeley, Harvard, MIT, Columbia, UW).
- 👥 **Roommate-Friendly Search**: Filter shared rooms by occupancy (Single, Double Sharing, Triple Sharing) and house rules.
- 📦 **Student Essentials Hub**: Rent desks, chairs, laptops, and commuter bikes for a single semester without purchasing depreciating assets.
- 🛡️ **Verified Listings Badge**: Human-verified badges for vetted properties and real landlords.

### 4. Interactive Maps
- Built-in **Leaflet / OpenStreetMap** interactive map:
  - Custom price pill markers.
  - Interactive popup cards with photo thumbnail, rent price, and direct link.
  - 3 view modes: **Grid View**, **Split Grid & Map**, and **Full Map View**.

### 5. Booking Requests & Anti-Conflict Rules
- Students specify preferred move-in dates, rental duration (1-12 months), and introductory notes.
- **Anti-Self-Approval Security**: Students cannot approve their own booking requests; only property owners can accept or decline.
- Status tracking: `Pending`, `Accepted`, `Rejected`, `Cancelled`.

### 6. Verified Student Reviews
- 5-Star interactive rating system with feedback commentary.
- **Verified Tenant Badge**: Reviews from students with confirmed stays receive an authentic `✓ Verified Tenant` badge.

### 7. Three Tailored Dashboards
- **Student Dashboard**: Booking requests tracker, saved favorites shortlist, rental history, and profile management.
- **Owner Dashboard**: Listing inventory, quick availability toggle (`Available Now` vs `Booked`), incoming student booking requests with Accept/Decline actions, and listing analytics.
- **Admin Dashboard**: Platform-wide metrics, listing moderation (grant/revoke verified badge, delete fraudulent listings), user account directory, and suspicious report resolution.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Leaflet Maps, React Router DOM |
| **Backend** | Node.js, Express.js, CORS, Helmet, Rate Limiting, Morgan |
| **Database & Auth** | Supabase (PostgreSQL with Row Level Security policies) + Local Persistent Mode |
| **Maps** | OpenStreetMap & Leaflet (Zero API key required) |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Installation
Install dependencies in both client and server:
```bash
# In client
cd client
npm install

# In server
cd ../server
npm install
```

### 2. Running Locally

#### Terminal 1: Start Express API Server
```bash
cd server
npm start
# Server listens on http://localhost:5000
# Health check: http://localhost:5000/api/health
```

#### Terminal 2: Start React Frontend
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🗄️ Supabase Database Setup (Optional Live Connection)

The system is configured with an **Intelligent Fallback Architecture**:
- Out of the box, it runs seamlessly in **Local Persistent Mode** with rich student seed data.
- To connect to a live Supabase PostgreSQL instance:
  1. Create a project at [supabase.com](https://supabase.com).
  2. Open the **SQL Editor** in the Supabase Dashboard.
  3. Execute [`supabase/schema.sql`](file:///c:/Rentease/supabase/schema.sql) to create the tables, indexes, and Row-Level Security (RLS) policies.
  4. Execute [`supabase/seed.sql`](file:///c:/Rentease/supabase/seed.sql) to populate sample listings and users.
  5. Copy your Project URL and Anon Key into `server/.env` and `client/.env`:
     ```env
     SUPABASE_URL=https://your-project.supabase.co
     SUPABASE_ANON_KEY=your-anon-key
     ```

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/listings` | Search and filter rental listings | Public |
| `GET` | `/api/listings/:id` | Get detailed rental info + reviews | Public |
| `POST` | `/api/listings` | Create a new listing | Owner / Admin |
| `PATCH` | `/api/listings/:id/availability` | Toggle listing availability | Owner / Admin |
| `DELETE` | `/api/listings/:id` | Remove a listing | Owner / Admin |
| `GET` | `/api/listings/recommendations` | Smart student budget match recommendations | Public |
| `POST` | `/api/bookings` | Submit a booking/rental request | Student |
| `GET` | `/api/bookings/my` | View student's booking requests | Student |
| `GET` | `/api/bookings/owner` | View incoming requests for owner | Owner |
| `PATCH` | `/api/bookings/:id/status` | Accept or reject request | Owner / Admin |
| `POST` | `/api/reviews` | Submit rating & review | Student |
| `GET` | `/api/favorites` | View student saved favorites | Student |
| `POST` | `/api/favorites/toggle` | Add/remove listing from favorites | Student |
| `POST` | `/api/reports` | Report suspicious listing | Student / Owner |
| `GET` | `/api/admin/stats` | Platform statistics | Admin |
| `PATCH` | `/api/admin/listings/:id/verify` | Grant/revoke verified badge | Admin |
| `GET` | `/api/health` | API system status and database mode | Public |

---

## 👥 Demo Personas for Evaluation

| Persona | Role | Email | Capabilities |
|---|---|---|---|
| **Alex Rivera** | `student` | `student@rentease.edu` | Browse, filter, shortlist favorites, request bookings, submit reviews |
| **Marcus Vance** | `owner` | `owner@rentease.com` | Create/edit listings, manage availability, accept/decline booking requests |
| **Sarah Connor** | `admin` | `admin@rentease.com` | Moderation console, grant verified badges, delete flagged listings, inspect reports |

---

© 2026 RentEase Team. Built for university students worldwide.
