-- ============================================
-- LUMIN PUBLISHING — Full database setup
-- Paste this entire file into Neon SQL Editor
-- Safe to run on a fresh database
-- ============================================

-- Drop existing types if they exist (for clean re-runs)
DROP TYPE IF EXISTS "Role" CASCADE;
DROP TYPE IF EXISTS "BookStatus" CASCADE;
DROP TYPE IF EXISTS "PlanTier" CASCADE;
DROP TYPE IF EXISTS "AgentType" CASCADE;
DROP TYPE IF EXISTS "AgentStatus" CASCADE;
DROP TYPE IF EXISTS "JobStatus" CASCADE;
DROP TYPE IF EXISTS "ApprovalStatus" CASCADE;

CREATE TYPE "Role" AS ENUM ('AUTHOR', 'ADMIN', 'READER');
CREATE TYPE "BookStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'IN_REVIEW', 'IN_EDITING', 'COVER_DESIGN', 'FORMATTING', 'PUBLISHED', 'REJECTED');
CREATE TYPE "PlanTier" AS ENUM ('STARTER', 'PROFESSIONAL', 'BESTSELLER');
CREATE TYPE "AgentType" AS ENUM ('ORCHESTRATOR', 'EDITOR', 'DESIGNER', 'FORMATTER', 'MARKETING', 'BLOGGER', 'SUPPORT', 'MAILER', 'ACCOUNTS', 'MAINTENANCE');
CREATE TYPE "AgentStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ERROR', 'DISABLED');
CREATE TYPE "JobStatus" AS ENUM ('QUEUED', 'RUNNING', 'AWAITING_APPROVAL', 'COMPLETED', 'FAILED', 'CANCELLED');
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Drop existing tables (clean slate)
DROP TABLE IF EXISTS "SupportMessage" CASCADE;
DROP TABLE IF EXISTS "SupportThread" CASCADE;
DROP TABLE IF EXISTS "EmailLog" CASCADE;
DROP TABLE IF EXISTS "BlogPost" CASCADE;
DROP TABLE IF EXISTS "AgentLog" CASCADE;
DROP TABLE IF EXISTS "Job" CASCADE;
DROP TABLE IF EXISTS "Agent" CASCADE;
DROP TABLE IF EXISTS "Transaction" CASCADE;
DROP TABLE IF EXISTS "Approval" CASCADE;
DROP TABLE IF EXISTS "Sale" CASCADE;
DROP TABLE IF EXISTS "Book" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "Testimonial" CASCADE;
DROP TABLE IF EXISTS "TeamMember" CASCADE;
DROP TABLE IF EXISTS "Faq" CASCADE;
DROP TABLE IF EXISTS "FooterLink" CASCADE;
DROP TABLE IF EXISTS "SocialLink" CASCADE;
DROP TABLE IF EXISTS "Plan" CASCADE;
DROP TABLE IF EXISTS "Service" CASCADE;
DROP TABLE IF EXISTS "HowItWorksStep" CASCADE;
DROP TABLE IF EXISTS "PageContent" CASCADE;
DROP TABLE IF EXISTS "SiteSetting" CASCADE;

-- Core tables
CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  role "Role" DEFAULT 'AUTHOR',
  bio TEXT,
  "avatarUrl" TEXT,
  phone TEXT,
  country TEXT DEFAULT 'IN',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Book" (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  genre TEXT NOT NULL,
  language TEXT DEFAULT 'English',
  description TEXT NOT NULL,
  "manuscriptUrl" TEXT,
  "coverUrl" TEXT,
  isbn TEXT,
  "pageCount" INTEGER,
  "priceINR" DOUBLE PRECISION,
  "priceUSD" DOUBLE PRECISION,
  status "BookStatus" DEFAULT 'DRAFT',
  "planTier" "PlanTier" DEFAULT 'STARTER',
  "publishedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  "editedManuscriptUrl" TEXT,
  "editorNotes" TEXT,
  "marketingCopy" TEXT,
  "socialPosts" TEXT,
  "coverVariants" TEXT,
  "authorId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE TABLE "Sale" (
  id TEXT PRIMARY KEY,
  "bookId" TEXT NOT NULL REFERENCES "Book"(id) ON DELETE CASCADE,
  amount DOUBLE PRECISION NOT NULL,
  currency TEXT DEFAULT 'INR',
  "buyerEmail" TEXT,
  channel TEXT DEFAULT 'direct',
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Approval" (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DOUBLE PRECISION,
  currency TEXT DEFAULT 'INR',
  status "ApprovalStatus" DEFAULT 'PENDING',
  "requesterAgent" TEXT,
  "approvedById" TEXT REFERENCES "User"(id),
  "approvedAt" TIMESTAMP,
  "rejectedReason" TEXT,
  metadata TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Transaction" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount DOUBLE PRECISION NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'completed',
  reference TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "approvalId" TEXT UNIQUE REFERENCES "Approval"(id)
);

CREATE TABLE "Agent" (
  id TEXT PRIMARY KEY,
  type "AgentType" UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  status "AgentStatus" DEFAULT 'ACTIVE',
  config TEXT NOT NULL,
  "lastRunAt" TIMESTAMP,
  "totalRuns" INTEGER DEFAULT 0,
  "totalErrors" INTEGER DEFAULT 0,
  "totalCostINR" DOUBLE PRECISION DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Job" (
  id TEXT PRIMARY KEY,
  "agentId" TEXT NOT NULL REFERENCES "Agent"(id),
  "bookId" TEXT REFERENCES "Book"(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  status "JobStatus" DEFAULT 'QUEUED',
  priority INTEGER DEFAULT 5,
  payload TEXT NOT NULL,
  result TEXT,
  "errorMsg" TEXT,
  attempts INTEGER DEFAULT 0,
  "scheduledAt" TIMESTAMP DEFAULT NOW(),
  "startedAt" TIMESTAMP,
  "completedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "approvalId" TEXT UNIQUE REFERENCES "Approval"(id)
);

CREATE TABLE "AgentLog" (
  id TEXT PRIMARY KEY,
  "agentId" TEXT NOT NULL REFERENCES "Agent"(id) ON DELETE CASCADE,
  level TEXT DEFAULT 'info',
  message TEXT NOT NULL,
  metadata TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "BlogPost" (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  "coverUrl" TEXT,
  category TEXT DEFAULT 'Writing Tips',
  tags TEXT,
  "publishedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  "authorBot" TEXT DEFAULT 'BLOGGER'
);

CREATE TABLE "EmailLog" (
  id TEXT PRIMARY KEY,
  "userId" TEXT REFERENCES "User"(id),
  "toEmail" TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  template TEXT,
  status TEXT DEFAULT 'queued',
  "sentAt" TIMESTAMP,
  error TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "SupportThread" (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  "userEmail" TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "SupportMessage" (
  id TEXT PRIMARY KEY,
  "threadId" TEXT NOT NULL REFERENCES "SupportThread"(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  body TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "SiteSetting" (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  type TEXT DEFAULT 'string',
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Editable content tables
CREATE TABLE "Testimonial" (
  id TEXT PRIMARY KEY,
  quote TEXT NOT NULL,
  "authorName" TEXT NOT NULL,
  "authorRole" TEXT,
  "imageUrl" TEXT,
  rating INTEGER DEFAULT 5,
  "isFeatured" BOOLEAN DEFAULT FALSE,
  "sortOrder" INTEGER DEFAULT 0,
  "isPublished" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "TeamMember" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  "imageUrl" TEXT,
  email TEXT,
  "linkedinUrl" TEXT,
  "twitterUrl" TEXT,
  "sortOrder" INTEGER DEFAULT 0,
  "isPublished" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Faq" (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  "sortOrder" INTEGER DEFAULT 0,
  "isPublished" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "FooterLink" (
  id TEXT PRIMARY KEY,
  section TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  "isExternal" BOOLEAN DEFAULT FALSE,
  "sortOrder" INTEGER DEFAULT 0,
  "isPublished" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "SocialLink" (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  "isPublished" BOOLEAN DEFAULT TRUE,
  "sortOrder" INTEGER DEFAULT 0,
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Plan" (
  id TEXT PRIMARY KEY,
  tier TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  "priceINR" DOUBLE PRECISION NOT NULL,
  "priceUSD" DOUBLE PRECISION NOT NULL,
  "royaltyPercent" INTEGER NOT NULL,
  features TEXT NOT NULL,
  "isPopular" BOOLEAN DEFAULT FALSE,
  "sortOrder" INTEGER DEFAULT 0,
  "isPublished" BOOLEAN DEFAULT TRUE,
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Service" (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT NOT NULL,
  "iconName" TEXT DEFAULT 'Sparkles',
  "colorClass" TEXT DEFAULT 'from-royal-700 to-royal-900',
  "sortOrder" INTEGER DEFAULT 0,
  "isPublished" BOOLEAN DEFAULT TRUE,
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "HowItWorksStep" (
  id TEXT PRIMARY KEY,
  "stepNumber" INTEGER NOT NULL,
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  detail TEXT,
  "iconName" TEXT DEFAULT 'Sparkles',
  "sortOrder" INTEGER DEFAULT 0,
  "isPublished" BOOLEAN DEFAULT TRUE,
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "PageContent" (
  id TEXT PRIMARY KEY,
  "pageSlug" TEXT UNIQUE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SEED DATA — only essentials, no fake content
-- ============================================

-- 1) Admin user (password "demo1234")
-- IMPORTANT: Change this password after first login!
INSERT INTO "User" (id, email, "passwordHash", "fullName", role, country) VALUES
  ('admin-001', 'admin@lumin.demo', '$2b$10$rXOyGYTPzkXC.YYO5xZh3.K0yJLpaxQqHzKxV3FxLvL9pXZ8KwGEa', 'Platform Admin', 'ADMIN', 'IN');

-- 2) All 10 agents (autonomous bots)
INSERT INTO "Agent" (id, type, name, description, config) VALUES
  ('agent-1', 'ORCHESTRATOR', '🎯 Manager', 'Routes work to all other agents.', '{}'),
  ('agent-2', 'EDITOR', '✏️ Editorial Bot', 'Edits manuscripts. Grammar, style, structure.', '{}'),
  ('agent-3', 'DESIGNER', '🎨 Design Bot', 'Creates book covers via AI image generation.', '{}'),
  ('agent-4', 'FORMATTER', '📚 Format Bot', 'Converts to EPUB, MOBI, PDF.', '{}'),
  ('agent-5', 'MARKETING', '📣 Marketing Bot', 'Writes ads, social posts, launch campaigns.', '{}'),
  ('agent-6', 'BLOGGER', '📰 Blog Bot', 'Writes SEO blog posts daily.', '{}'),
  ('agent-7', 'SUPPORT', '💬 Support Bot', 'Answers inquiries 24/7.', '{}'),
  ('agent-8', 'MAILER', '📧 Mail Bot', 'Composes and sends all outbound emails.', '{}'),
  ('agent-9', 'ACCOUNTS', '💰 Accounts Bot', 'Money flow. All transactions need admin approval.', '{}'),
  ('agent-10', 'MAINTENANCE', '🌐 Maintenance Bot', 'Site health, backups, monitoring.', '{}');

-- 3) Default pricing plans (you can edit these in admin)
INSERT INTO "Plan" (id, tier, name, tagline, "priceINR", "priceUSD", "royaltyPercent", features, "isPopular", "sortOrder") VALUES
  ('plan-1', 'STARTER', 'Starter', 'For first-time authors', 4999, 59, 70,
    '["AI-assisted grammar & style edit","3 AI-generated cover options","EPUB + PDF formatting","Listed on our bookstore","Basic author profile page","Sales dashboard & analytics","70% royalty to author"]',
    FALSE, 1),
  ('plan-2', 'PROFESSIONAL', 'Professional', 'Our most popular plan', 14999, 179, 75,
    '["Everything in Starter, plus:","Advanced AI edit + 1 human proofread","10 AI covers + 1 custom revision","Print-ready PDF (paperback)","ISBN included","Amazon KDP distribution","AI marketing kit (social + ad copy)","75% royalty to author"]',
    TRUE, 2),
  ('plan-3', 'BESTSELLER', 'Bestseller', 'Full premium publishing', 39999, 479, 80,
    '["Everything in Professional, plus:","Full human edit (multiple rounds)","Custom cover by designer","Hardcover + paperback + ebook","ISBN + barcode + DOI","Global distribution (Amazon, Apple, Google, IngramSpark)","Book launch campaign","Dedicated author website page","80% royalty to author"]',
    FALSE, 3);

-- 4) Default How It Works steps (you can edit in admin)
INSERT INTO "HowItWorksStep" (id, "stepNumber", title, text, detail, "iconName") VALUES
  ('step-1', 1, 'Submit Your Manuscript', 'Upload your work in any common format — .docx, .pdf, .txt, or .rtf.', 'Your manuscript is encrypted at rest.', 'Upload'),
  ('step-2', 2, 'AI-Assisted Editorial Review', 'Our AI editor identifies grammar issues, pacing, and style inconsistencies — while preserving your voice.', 'You approve every change before it goes into the final manuscript.', 'Sparkles'),
  ('step-3', 3, 'Cover & Interior Design', 'Choose from six design directions. Our AI generates options, refined to perfection.', 'Bestseller plan includes a fully custom cover by an award-winning designer.', 'Palette'),
  ('step-4', 4, 'Formatting & ISBN', 'EPUB for ebooks, print-ready PDF for paperback and hardcover. ISBN registration included.', 'Files are delivered to all major retailers within 48 hours.', 'FileCheck'),
  ('step-5', 5, 'Global Distribution', 'Your book goes live on Amazon, Apple Books, Google Play, Kobo, and more.', 'Reach readers in over 180 countries.', 'Globe'),
  ('step-6', 6, 'Launch & Marketing', 'AI-generated social posts, ad copy, and book trailers.', 'You retain full ownership of your work and 70–80% of royalties — always.', 'Megaphone');

-- 5) Default footer links — NO 404s, all point to real pages
INSERT INTO "FooterLink" (id, section, label, url, "sortOrder") VALUES
  ('fl-1',  'Publish',  'How It Works',    '/how-it-works', 1),
  ('fl-2',  'Publish',  'Pricing',          '/pricing',      2),
  ('fl-3',  'Publish',  'Services',         '/services',     3),
  ('fl-4',  'Publish',  'Get Started',      '/signup',       4),
  ('fl-5',  'Discover', 'Bookstore',        '/bookstore',    1),
  ('fl-6',  'Company',  'About',            '/about',        1),
  ('fl-7',  'Company',  'Contact',          '/contact',      2),
  ('fl-8',  'Company',  'Careers',          '/careers',      3),
  ('fl-9',  'Company',  'Press',            '/press',        4),
  ('fl-10', 'Legal',    'Terms of Service', '/terms',        1),
  ('fl-11', 'Legal',    'Privacy Policy',   '/privacy',      2),
  ('fl-12', 'Legal',    'Refund Policy',    '/refund',       3),
  ('fl-13', 'Legal',    'Copyright / DMCA', '/copyright',    4);

-- 6) Default site settings
INSERT INTO "SiteSetting" (key, value, type) VALUES
  ('brand.name', 'LUMIN', 'string'),
  ('brand.tagline', 'Where extraordinary stories become beautifully published books', 'string'),
  ('brand.description', 'AI-powered tools, human craft, and global reach for serious authors.', 'string'),
  ('contact.email', 'hello@lumin.publishing', 'string'),
  ('contact.phone', '', 'string'),
  ('contact.address', 'India', 'string'),
  ('contact.hours', 'Mon–Fri, 10am–7pm IST', 'string'),
  ('hero.headline', 'Your story.', 'string'),
  ('hero.headline.emphasis', 'Beautifully', 'string'),
  ('hero.headline.suffix', 'published.', 'string'),
  ('hero.subheading', 'From manuscript to published book in 7 days. AI-assisted editing, premium covers, and global distribution — all crafted with the care your story deserves.', 'string'),
  ('hero.cta.primary', 'Begin Your Journey', 'string'),
  ('hero.cta.secondary', 'See How It Works', 'string'),
  ('stats.1.number', '0', 'string'),
  ('stats.1.label', 'Authors Joined', 'string'),
  ('stats.2.number', '180+', 'string'),
  ('stats.2.label', 'Countries Reached', 'string'),
  ('stats.3.number', '7 days', 'string'),
  ('stats.3.label', 'Average Time to Publish', 'string'),
  ('stats.4.number', '80%', 'string'),
  ('stats.4.label', 'Royalty to Authors', 'string'),
  ('seo.title', 'LUMIN — Premium AI-Powered Book Publishing', 'string'),
  ('seo.description', 'Publish your book in days, not years. AI-assisted editing, premium design, and global distribution.', 'string'),
  ('seo.keywords', 'book publishing, AI publishing, self publishing, ebook, ISBN, author platform', 'string'),
  ('show.testimonials', 'false', 'boolean'),
  ('show.team', 'false', 'boolean'),
  ('show.bookstore.featured', 'true', 'boolean'),
  ('show.stats', 'false', 'boolean'),
  ('show.social.icons', 'false', 'boolean'),
  ('about.mission.title', 'Every author deserves a beautiful book.', 'string'),
  ('about.mission.text', 'We believe the gatekeeping era of publishing is over — but most "self-publishing" tools have failed authors by giving them software when they needed partnership. LUMIN blends the precision of AI with the judgment of craft.', 'string');

-- DONE!
-- Login: admin@lumin.demo / demo1234
-- After login: go to /admin and start configuring your site.
