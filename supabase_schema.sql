-- ============================================================================
-- Supabase Schema & Initial Data Migration for Vijay Portfolio
-- ============================================================================

-- 1. Admin Table
CREATE TABLE IF NOT EXISTS admin (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Profile Table
CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  name TEXT NOT NULL DEFAULT 'Vijay Bhesaniya',
  tagline TEXT DEFAULT 'Shopify Liquid & Python Developer',
  tagline_roles JSONB DEFAULT '["Shopify Liquid Developer", "Python Developer", "WordPress Developer", "eCommerce Performance Specialist"]'::jsonb,
  summary TEXT,
  profile_photo TEXT,
  resume_pdf TEXT,
  email TEXT DEFAULT 'vijaypatel35136@gmail.com',
  phone TEXT DEFAULT '+91 8460235136',
  linkedin TEXT DEFAULT 'https://linkedin.com/in/bhesaniya-vijay-355b7020b',
  github TEXT DEFAULT 'https://vijaybhesaniya.github.io/portfolio/',
  location TEXT DEFAULT 'Ahmedabad, Gujarat, India',
  experience_years INTEGER DEFAULT 2,
  experience_months INTEGER DEFAULT 0,
  projects_count INTEGER DEFAULT 15,
  education TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  skill TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Experience Table
CREATE TABLE IF NOT EXISTS experience (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  description JSONB DEFAULT '[]'::jsonb,
  is_current BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  tech_stack JSONB DEFAULT '[]'::jsonb,
  category TEXT DEFAULT 'Shopify',
  image_url TEXT,
  github_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Education Table
CREATE TABLE IF NOT EXISTS education (
  id SERIAL PRIMARY KEY,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  location TEXT,
  start_date TEXT,
  end_date TEXT,
  gpa TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Messages Table (Contact form submissions)
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Row Level Security (RLS) & Security Policies
-- ============================================================================

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public Read Profile" ON profile;
DROP POLICY IF EXISTS "Public Read Skills" ON skills;
DROP POLICY IF EXISTS "Public Read Experience" ON experience;
DROP POLICY IF EXISTS "Public Read Projects" ON projects;
DROP POLICY IF EXISTS "Public Read Education" ON education;
DROP POLICY IF EXISTS "Public Read Site Settings" ON site_settings;
DROP POLICY IF EXISTS "Public Insert Messages" ON messages;
DROP POLICY IF EXISTS "Public Select Messages" ON messages;
DROP POLICY IF EXISTS "Public Write Profile" ON profile;
DROP POLICY IF EXISTS "Public Write Skills" ON skills;
DROP POLICY IF EXISTS "Public Write Experience" ON experience;
DROP POLICY IF EXISTS "Public Write Projects" ON projects;
DROP POLICY IF EXISTS "Public Write Education" ON education;

-- Public Read Policies
CREATE POLICY "Public Read Profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Public Read Skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public Read Experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public Read Education" ON education FOR SELECT USING (true);
CREATE POLICY "Public Read Site Settings" ON site_settings FOR SELECT USING (true);

-- Public Write Policies (Allowing client operations for admin/portfolio)
CREATE POLICY "Public Write Profile" ON profile FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Write Skills" ON skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Write Experience" ON experience FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Write Projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Write Education" ON education FOR ALL USING (true) WITH CHECK (true);

-- Messages Policies (Contact Form)
CREATE POLICY "Public Insert Messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Messages" ON messages FOR SELECT USING (true);

-- ============================================================================
-- Initial Seed Data
-- ============================================================================

-- Admin Seed
-- NOTE: The password hash below is a bcrypt hash of 'admin123' (cost 10).
-- Login: admin@vijay.dev / admin123
-- To regenerate: run `npm run db:seed-admin`
INSERT INTO admin (email, password, created_at)
VALUES (
  'admin@vijay.dev',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Profile Seed
INSERT INTO profile (id, name, tagline, tagline_roles, summary, location, experience_years, experience_months, projects_count, education)
VALUES (
  1,
  'Vijay Bhesaniya',
  'Shopify Liquid & Python Developer',
  '["Shopify Liquid Developer", "Python Developer", "WordPress Developer", "eCommerce Performance Specialist"]'::jsonb,
  'Results-driven Shopify Liquid, Python, and WordPress Developer with 2+ years of experience building high-converting eCommerce storefronts, internal business systems, and content-managed websites.',
  'Ahmedabad, Gujarat, India',
  2,
  0,
  15,
  'Bachelor of Engineering — Computer Engineering, Om Engineering College, Junagadh, Gujarat | 2019 – 2023'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  summary = EXCLUDED.summary;

-- Skills Seed
INSERT INTO skills (category, skill, display_order)
VALUES
  ('Shopify & eCommerce', 'Shopify Liquid Development', 0),
  ('Shopify & eCommerce', 'Custom Theme Design & Sections', 1),
  ('Shopify & eCommerce', 'Shopify CLI & App Development', 2),
  ('Shopify & eCommerce', 'Shopify API & Third-Party Integrations', 3),
  ('Shopify & eCommerce', 'WooCommerce-to-Shopify Migration', 4),
  ('Shopify & eCommerce', 'A/B Testing & Conversion Optimization', 5),
  ('Web Development', 'WordPress Development (PHP)', 6),
  ('Web Development', 'HTML5, CSS3, JavaScript', 7),
  ('Web Development', 'Bootstrap, React', 8),
  ('Web Development', 'Contentful (Headless CMS)', 9),
  ('Backend / Python', 'Python Application Development', 10),
  ('Backend / Python', 'HRMS/BMS System Design', 11),
  ('Backend / Python', 'Data-driven Analytics Apps', 12),
  ('Performance & SEO', 'Website Speed & Performance Optimization', 13),
  ('Performance & SEO', 'SEO & Schema Markup', 14),
  ('Performance & SEO', 'Cross-Browser QA & Debugging', 15),
  ('Performance & SEO', 'Responsive / Mobile-First Design', 16)
ON CONFLICT DO NOTHING;

-- Experience Seed
INSERT INTO experience (title, company, location, start_date, end_date, description, is_current, display_order)
VALUES
  (
    'Shopify & Python Developer',
    'Trilok Ninfotech Pvt. Ltd.',
    'Ahmedabad, India',
    '2025-09-01',
    NULL,
    '["Designing and building an in-house HRMS (Human Resource Management System)", "Developing a BMS (Business Management System) for core operations", "Building a Shopify analytics application for store insights", "Leading 2-3 parallel projects end-to-end"]'::jsonb,
    TRUE,
    0
  ),
  (
    'Shopify Developer',
    'Ecodesoft Solutions',
    'Ahmedabad, India',
    '2023-12-01',
    '2025-08-31',
    '["Built and customized 10+ Shopify themes", "Integrated third-party apps and APIs", "Improved Core Web Vitals through optimization", "Led zero-downtime WooCommerce-to-Shopify migration"]'::jsonb,
    FALSE,
    1
  ),
  (
    'Shopify Developer - Intern',
    'Hopiant Pvt. Ltd.',
    'Junagadh, India',
    '2023-03-01',
    '2023-11-30',
    '["Designed and customized Shopify storefronts using Liquid", "Collaborated with senior developers on responsive features", "Performed QA testing and debugging"]'::jsonb,
    FALSE,
    2
  )
ON CONFLICT DO NOTHING;

-- Projects Seed
INSERT INTO projects (name, url, description, tech_stack, category, is_featured, display_order)
VALUES
  ('Body of Evidence', 'https://bodyofevidence.com.au/', 'A fast, dynamic web experience built on Contentful headless CMS with a React front end.', '["Contentful CMS", "React", "Headless Architecture"]'::jsonb, 'Shopify', TRUE, 0),
  ('Trade Vehicle Parts', 'https://tradevehicleparts.co.uk/', 'eCommerce automotive store with custom liquid sections and search filters.', '["Shopify", "Liquid", "JavaScript"]'::jsonb, 'Shopify', FALSE, 1),
  ('Whitaker Brothers', 'https://www.whitakerbrothers.com/', 'Enterprise storefront for document destruction & office equipment.', '["Shopify", "Liquid", "Tailwind CSS"]'::jsonb, 'Shopify', FALSE, 2),
  ('The Crafty Black Dog', 'https://thecraftyblackdog.co.uk/', 'UK military merchandise and customized gift store.', '["Shopify", "Liquid", "CSS3"]'::jsonb, 'Shopify', FALSE, 3),
  ('Van Junkies', 'https://vanjunkies.co.uk/', 'Campervan parts and accessories online store.', '["Shopify", "Liquid", "JavaScript"]'::jsonb, 'Shopify', FALSE, 4),
  ('Loxley Arts', 'https://loxleyarts.com/', 'Art supplies and framing materials storefront.', '["Shopify", "Liquid"]'::jsonb, 'Shopify', FALSE, 5),
  ('Alex Davis PCS', 'https://alexdavispcs.co.uk/', 'Custom PC builds and IT hardware store.', '["Shopify", "Liquid"]'::jsonb, 'Shopify', FALSE, 6),
  ('Dervans Fashions', 'https://dervansfashions.ie/', 'Irish family clothing and footware eCommerce store.', '["Shopify", "Liquid"]'::jsonb, 'Shopify', FALSE, 7),
  ('The Kennel Store', 'https://www.kennelstore.co.uk/', 'Dog kennels and pet housing solution provider store.', '["Shopify", "Liquid"]'::jsonb, 'Shopify', FALSE, 8),
  ('Mushroom Spawn Store', 'https://mushroomspawnstore.com/', 'Specialty organic mycology store.', '["Shopify", "Liquid"]'::jsonb, 'Shopify', FALSE, 9),
  ('Aliver Cosmetics', 'https://alivercosmetics.com/', 'Global beauty and skincare brand storefront.', '["Shopify", "Liquid"]'::jsonb, 'Shopify', FALSE, 10),
  ('All City Candy', 'https://allcitycandy.com/', 'Sweet treat and gift basket eCommerce store.', '["Shopify", "Liquid"]'::jsonb, 'Shopify', FALSE, 11),
  ('Gold Label Car Care', 'https://www.goldlabelcarcare.co.uk/', 'Premium auto detailing products store.', '["Shopify", "Liquid"]'::jsonb, 'Shopify', FALSE, 12),
  ('Healthy Hub', 'https://healthyhub.ca/', 'Canadian health supplements and wellness store.', '["Shopify", "Liquid"]'::jsonb, 'Shopify', FALSE, 13),
  ('Last Elf on the Left', 'https://lastelfontheleft.com/', 'Novelty Christmas merchandise store.', '["Shopify", "Liquid"]'::jsonb, 'Shopify', FALSE, 14),
  ('Signal and Power', 'https://www.signalandpower.com/', 'Industrial power cables and assembly supplier.', '["Shopify", "Liquid"]'::jsonb, 'Shopify', FALSE, 15)
ON CONFLICT DO NOTHING;

-- Education Seed
INSERT INTO education (degree, institution, location, start_date, end_date, display_order)
VALUES (
  'Bachelor of Engineering — Computer Engineering',
  'Om Engineering College',
  'Junagadh, Gujarat',
  '2019-06-01',
  '2023-05-31',
  0
)
ON CONFLICT DO NOTHING;
