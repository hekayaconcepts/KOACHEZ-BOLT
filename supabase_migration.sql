-- 1. Update existing 'coaches' table with missing columns
ALTER TABLE IF EXISTS coaches 
ADD COLUMN IF NOT EXISTS brand_color TEXT,
ADD COLUMN IF NOT EXISTS brand_font TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS subdomain TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS custom_domain TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS icf_credential TEXT,
ADD COLUMN IF NOT EXISTS paystack_subaccount_id TEXT;

-- 2. Create 'shop_products' table
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

-- 3. Create 'shop_orders' table
CREATE TABLE IF NOT EXISTS shop_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES shop_products(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending',
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create 'intake_forms' table
CREATE TABLE IF NOT EXISTS intake_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    questions JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create 'contracts' table
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    template TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Create 'contract_signatures' table
CREATE TABLE IF NOT EXISTS contract_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    signature TEXT NOT NULL,
    signed_at TIMESTAMPTZ DEFAULT now(),
    ip_address TEXT
);

-- 7. Create 'icf_hours' table
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

-- 8. Create 'group_sessions' table
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

-- 9. Create 'podcast_episodes' table
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

-- 10. Create 'community_posts' table
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    author_id UUID NOT NULL, -- Can be coach or client
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Create 'goals' table
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    milestones JSONB,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Create 'accountability_checkins' table
CREATE TABLE IF NOT EXISTS accountability_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    response TEXT,
    checked_in_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all new tables
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
