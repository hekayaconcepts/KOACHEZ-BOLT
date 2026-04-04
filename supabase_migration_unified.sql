-- KOACHEZ UNIFIED DATABASE SCHEMA MIGRATION
-- Gwambo Digital | Bibu | April 2026
-- This script creates the entire database schema from scratch for the new Supabase project.

-- 1. CORE TABLES (Phase 3 Checklist)
CREATE TABLE IF NOT EXISTS coaches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    bio TEXT,
    tagline TEXT,
    niche TEXT,
    brand_color TEXT DEFAULT '#185fa5',
    brand_font TEXT DEFAULT 'DM Sans',
    logo_url TEXT,
    subdomain TEXT UNIQUE,
    custom_domain TEXT UNIQUE,
    icf_credential TEXT,
    paystack_subaccount_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no-show')),
    notes TEXT,
    daily_room_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    published BOOLEAN DEFAULT false,
    price DECIMAL(12,2) DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    position INTEGER NOT NULL,
    video_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT,
    published BOOLEAN DEFAULT false,
    meta_description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS podcasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    audio_url TEXT,
    description TEXT,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
    provider_ref TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. ADDITIONAL TABLES (Phase 3 & 8 Checklist)
CREATE TABLE IF NOT EXISTS shop_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    type TEXT CHECK (type IN ('digital', 'physical')),
    file_url TEXT,
    printful_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shop_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES shop_products(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending',
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS intake_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    questions JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    template TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contract_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    signature TEXT NOT NULL,
    signed_at TIMESTAMPTZ DEFAULT now(),
    ip_address TEXT
);

CREATE TABLE IF NOT EXISTS icf_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    duration_mins INTEGER NOT NULL,
    session_type TEXT,
    session_date DATE NOT NULL,
    is_manual BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS group_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    max_participants INTEGER,
    price DECIMAL(12,2),
    daily_room_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS podcast_episodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    audio_url TEXT,
    video_url TEXT,
    transcript TEXT,
    show_notes TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    author_id UUID NOT NULL, -- Can be coach or client
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    milestones JSONB,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS accountability_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    response TEXT,
    checked_in_at TIMESTAMPTZ DEFAULT now()
);

-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS on all tables
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE icf_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcast_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE accountability_checkins ENABLE ROW LEVEL SECURITY;

-- Basic Coach Policies (Coach can see/edit their own data)
CREATE POLICY "Coaches can view their own profile" ON coaches FOR SELECT USING (auth.uid() = auth_user_id);
CREATE POLICY "Coaches can update their own profile" ON coaches FOR UPDATE USING (auth.uid() = auth_user_id);

-- Public Coach Profile Policy (Visitors can see public coach info)
CREATE POLICY "Public can view coach profiles" ON coaches FOR SELECT USING (true);

-- Client Policies
CREATE POLICY "Coaches can view their clients" ON clients FOR SELECT USING (EXISTS (SELECT 1 FROM coaches WHERE id = coach_id AND auth_user_id = auth.uid()));
CREATE POLICY "Clients can view their own profile" ON clients FOR SELECT USING (auth.uid() = auth_user_id);

-- Booking Policies
CREATE POLICY "Coaches can view their bookings" ON bookings FOR SELECT USING (EXISTS (SELECT 1 FROM coaches WHERE id = coach_id AND auth_user_id = auth.uid()));
CREATE POLICY "Clients can view their own bookings" ON bookings FOR SELECT USING (EXISTS (SELECT 1 FROM clients WHERE id = client_id AND auth_user_id = auth.uid()));

-- Course/Lesson Policies
CREATE POLICY "Public can view published courses" ON courses FOR SELECT USING (published = true);
CREATE POLICY "Coaches can manage their courses" ON courses FOR ALL USING (EXISTS (SELECT 1 FROM coaches WHERE id = coach_id AND auth_user_id = auth.uid()));

-- Article Policies
CREATE POLICY "Public can view published articles" ON articles FOR SELECT USING (published = true);
CREATE POLICY "Coaches can manage their articles" ON articles FOR ALL USING (EXISTS (SELECT 1 FROM coaches WHERE id = coach_id AND auth_user_id = auth.uid()));

-- Payment Policies
CREATE POLICY "Coaches can view their payments" ON payments FOR SELECT USING (EXISTS (SELECT 1 FROM coaches WHERE id = coach_id AND auth_user_id = auth.uid()));
CREATE POLICY "Clients can view their own payments" ON payments FOR SELECT USING (EXISTS (SELECT 1 FROM clients WHERE id = client_id AND auth_user_id = auth.uid()));

-- Shop Policies
CREATE POLICY "Public can view shop products" ON shop_products FOR SELECT USING (true);
CREATE POLICY "Coaches can manage their products" ON shop_products FOR ALL USING (EXISTS (SELECT 1 FROM coaches WHERE id = coach_id AND auth_user_id = auth.uid()));

-- ICF Hours Policies
CREATE POLICY "Coaches can manage their ICF hours" ON icf_hours FOR ALL USING (EXISTS (SELECT 1 FROM coaches WHERE id = coach_id AND auth_user_id = auth.uid()));

-- Community Policies
CREATE POLICY "Public can view community posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Users can create community posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Goals & Accountability Policies
CREATE POLICY "Coaches can manage client goals" ON goals FOR ALL USING (EXISTS (SELECT 1 FROM coaches WHERE id = coach_id AND auth_user_id = auth.uid()));
CREATE POLICY "Clients can view their own goals" ON goals FOR SELECT USING (EXISTS (SELECT 1 FROM clients WHERE id = client_id AND auth_user_id = auth.uid()));
