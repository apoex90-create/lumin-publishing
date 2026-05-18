# LUMIN — Premium AI-Powered Book Publishing Platform

A complete Next.js + Tailwind + PostgreSQL publishing platform MVP. Royal premium design, INR/USD currency toggle, full author signup/dashboard flow, and a 6-step book publishing wizard.

> **LUMIN** is a placeholder brand name — rename it to anything you want (see "Rebranding" section below).

---

## 📋 What's Inside

✅ **Public website** — Homepage, How It Works, Services, Pricing, About, Contact, Bookstore
✅ **Authentication** — Signup, login, logout, JWT sessions, password hashing
✅ **Author dashboard** — Overview, My Books, Publish New (6-step wizard), Analytics, Earnings, Settings
✅ **Database** — PostgreSQL via Prisma with full schema for users, books, sales, transactions
✅ **Currency toggle** — INR ↔ USD switch persists across the entire site
✅ **Premium royal design** — Deep navy + gold + cream + burgundy, custom fonts, animations
✅ **Mobile responsive** — Works on phones, tablets, and desktops

---

## 🚀 Setup (15 minutes)

### Step 1: Install Node.js

Download and install Node.js version **18 or higher** from [nodejs.org](https://nodejs.org). Choose the **LTS** version.

After installing, open your terminal (Command Prompt on Windows, Terminal on Mac) and verify:
```bash
node --version
# Should print: v18.x.x or higher
```

### Step 2: Install PostgreSQL

PostgreSQL is the database that stores users, books, and transactions.

**Option A — Easy (recommended for beginners):**
1. Sign up for a free database at [Supabase](https://supabase.com) or [Neon](https://neon.tech)
2. Create a new project — they'll give you a "Connection String" that looks like:
   `postgresql://user:pass@host.region.aws.neon.tech/dbname`
3. Copy that string — you'll paste it into `.env` in step 4.

**Option B — Local install:**
1. Download PostgreSQL from [postgresql.org/download](https://postgresql.org/download)
2. During install, set a password (remember it!) and keep the default port `5432`
3. Open pgAdmin (installed with PostgreSQL) → create a new database named `lumin`
4. Your connection string will be: `postgresql://postgres:YOUR_PASSWORD@localhost:5432/lumin`

### Step 3: Install dependencies

In your terminal, navigate to the project folder and run:
```bash
cd lumin-publishing
npm install
```
This takes 2–3 minutes and downloads everything needed.

### Step 4: Create your environment file

```bash
# On Mac/Linux:
cp .env.example .env

# On Windows:
copy .env.example .env
```

Now open `.env` in any text editor (Notepad, VS Code, etc.) and edit two lines:

```env
DATABASE_URL="paste-your-postgresql-connection-string-here"
JWT_SECRET="any-random-long-string-at-least-32-characters-long-12345abcde"
```

To generate a random JWT_SECRET, you can run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
…and paste the result.

### Step 5: Create database tables

```bash
npx prisma migrate dev --name init
```
This creates all the tables in your database. You'll be asked to confirm — type `y` and press Enter.

### Step 6: Seed demo data (optional but recommended)

```bash
node prisma/seed.js
```
This creates a demo author and 3 sample books so you can test the dashboard immediately.

### Step 7: Start the website!

```bash
npm run dev
```

Open your browser to **[http://localhost:3000](http://localhost:3000)** — you should see the LUMIN homepage.

---

## 🔑 Demo Login

After running the seed script (step 6), you can log in with:

| Account | Email | Password | What you can do |
|---|---|---|---|
| Author | `author@lumin.demo` | `demo1234` | Author dashboard, submit books |
| **Admin** 👑 | `admin@lumin.demo` | `demo1234` | **Full platform control** |

When logged in as **Admin**, click your avatar (top right) → **👑 Admin Panel** to enter the king's view at `/admin`.

Or create your own account at `/signup` — it's free (but you'll be an Author by default).

## 👑 Admin Panel — The King's View

The admin panel is at **http://localhost:3000/admin** (admin login required).

**Command Center** (`/admin`) — Real-time stats: total authors, books, revenue, platform cut, pending reviews. Quick actions and recent activity.

**Authors Management** (`/admin/authors`):
- See every author with their books, sales, and earnings
- Add an author manually (create accounts on their behalf)
- Click any author → see their full profile, all books, all transactions
- Email them directly or suspend their account

**Books Management** (`/admin/books`):
- Every book on the platform, filterable by status
- Click any book → review, approve, reject, or move through the publishing pipeline (Submitted → In Review → Editing → Cover Design → Formatting → Published)
- View sales, revenue, and platform cut per book

**Team & Roles** (`/admin/team`):
- Add team members with admin access
- 3 permission levels: Super Admin (full control), Editor (review books), Support (read-only)
- Remove or edit team members anytime

**Revenue & Payouts** (`/admin/earnings`):
- Total revenue, platform cut (25%), author payouts (75%)
- Every sale and transaction in one table
- Pending payouts management
- Export financial reports

**Site Settings** (`/admin/settings`):
- **Brand & Logo** — Change platform name, upload logo and favicon
- **Homepage Content** — Edit hero headline, subheading, stats, testimonial
- **Pricing & Plans** — Adjust plan prices and royalty percentages
- **Theme Colors** — Customize the royal palette (royal/gold/burgundy/cream)
- **SEO & Meta** — Site title, description, keywords, Open Graph image

**Platform Statistics** (`/admin/platform`) — Full analytics: author growth trends, revenue charts, genre distribution, country breakdown.

---

## 📁 Project Structure

```
lumin-publishing/
├── app/                          # All pages (Next.js App Router)
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout with nav + footer
│   ├── globals.css               # Global styles + premium theme
│   ├── how-it-works/             # /how-it-works
│   ├── pricing/                  # /pricing
│   ├── services/                 # /services
│   ├── about/                    # /about
│   ├── contact/                  # /contact
│   ├── bookstore/                # /bookstore
│   ├── login/                    # /login
│   ├── signup/                   # /signup
│   ├── dashboard/                # Author dashboard (protected)
│   │   ├── page.tsx              # Overview
│   │   ├── books/                # My Books
│   │   ├── upload/               # 6-step publishing wizard
│   │   ├── analytics/            # Charts & stats
│   │   ├── earnings/             # Royalties & payouts
│   │   └── settings/             # Profile, payments, notifications
│   └── api/                      # Backend endpoints
│       ├── auth/                 # Login, signup, logout
│       └── books/                # Create/list books
├── components/
│   ├── layout/                   # Navbar, Footer, Logo
│   ├── ui/                       # Reusable UI pieces
│   ├── dashboard/                # Dashboard components
│   ├── PricingPreview.tsx
│   └── FeaturedBooks.tsx
├── lib/
│   ├── db.ts                     # Prisma client
│   ├── auth.ts                   # Password hashing + JWT
│   ├── plans.ts                  # Plans data + price formatting
│   └── currency-context.tsx      # Currency state
├── prisma/
│   ├── schema.prisma             # Database tables definition
│   └── seed.js                   # Demo data
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── package.json                  # Dependencies & scripts
└── README.md                     # You are here
```

---

## 🎨 Rebranding (Change "LUMIN" to Your Brand)

Search and replace the name in 4 places:

1. **`components/layout/Logo.tsx`** — line with `LUMIN` text
2. **`app/layout.tsx`** — site title metadata
3. **`prisma/seed.js`** — demo email addresses (optional)
4. **`package.json`** — `"name": "lumin-publishing"` (optional)

To change the **color theme**, edit `tailwind.config.js`. The `royal`, `gold`, `burgundy`, `cream` color objects control everything.

---

## 🔌 Connecting Real AI (Optional)

The dashboard has placeholder buttons for AI features (description enhancement, cover generation). To make them actually call AI, add these to your `.env`:

```env
OPENAI_API_KEY="sk-..."           # From platform.openai.com
ANTHROPIC_API_KEY="sk-ant-..."    # From console.anthropic.com
STABILITY_API_KEY="sk-..."        # For AI covers, from stability.ai
```

Then create API routes in `app/api/ai/` that call these services. Example structure already in place — wire your own logic.

---

## 💳 Connecting Payments (Optional)

For real payment processing, add:

```env
# For Indian customers (₹)
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."

# For global customers ($)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

The plan-purchase and payout flows have placeholder UI — implement in `app/api/payments/`.

---

## 🚢 Deployment (When You're Ready to Go Live)

**Easiest path:**
1. Push code to [GitHub](https://github.com)
2. Sign up at [Vercel](https://vercel.com) (free) and connect your repo
3. Vercel auto-deploys on every push
4. In Vercel dashboard, add all your `.env` variables as "Environment Variables"
5. Use a managed Postgres (Supabase, Neon, or Railway) — never self-host for production
6. Buy a domain on Namecheap or GoDaddy, point it to Vercel — takes 5 minutes

---

## 📜 Available Scripts

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm start            # Run production server
npm run db:studio    # Open visual database editor in browser
npm run db:migrate   # Create new migration after schema changes
npm run db:seed      # Re-run seed script
```

---

## ⚠️ What's Working vs. Placeholder

**Fully working:**
- All page navigation, design, animations
- User signup, login, logout (real password hashing, real JWT sessions)
- Database read/write for users and books
- Book submission via 6-step wizard
- Currency toggle (INR ↔ USD)
- Dashboard data display
- Analytics charts (uses sample data — replace with real once you have sales)

**Placeholder/UI-only (you wire these up):**
- AI buttons (Enhance description, Generate cover) — show buttons, need OpenAI/Anthropic API
- Payment flows — show UI, need Stripe/Razorpay keys
- File upload — accepts files in form but doesn't save to S3 yet (need AWS keys)
- Email notifications — UI exists, needs SendGrid/Resend integration
- Marketing/social-post generation — placeholder, needs AI integration

This is the **MVP foundation**. Plug in services as you grow.

---

## 🆘 Troubleshooting

**"Cannot connect to database"** → Check your `DATABASE_URL` in `.env`. Make sure PostgreSQL is running (if local) or your Supabase/Neon project is active.

**"Module not found"** → Run `npm install` again.

**Port 3000 already in use** → Run `npm run dev -- -p 3001` to use a different port.

**Prisma errors** → Run `npx prisma generate` then `npx prisma migrate dev`.

**Styles look broken** → Make sure `npm install` completed without errors; Tailwind needs to build CSS.

---

## 📝 License

This code is provided to you for your business. Modify it freely. Replace placeholder content (team names, addresses, contact emails) with your real info before going live.

---

## 🙏 Built With

- **Next.js 14** — React framework
- **Tailwind CSS** — Styling
- **Prisma** — Database ORM
- **PostgreSQL** — Database
- **Lucide React** — Icons
- **Recharts** — Dashboard charts
- **bcryptjs + jsonwebtoken** — Authentication
- **Zod** — Input validation

Fonts: Cormorant Garamond (display), Crimson Pro (serif), Plus Jakarta Sans (UI) — all via Google Fonts.

---

**Need help?** Edit, break, fix, ship. That's the indie way.
Good luck with your publishing business 📖✨
