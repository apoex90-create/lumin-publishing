# 🚀 Upgrade Guide — Database-Driven Content

This update converts your site from hardcoded content to fully admin-editable content. You now manage **everything** from the admin panel.

## What's New

✅ **Embarrassing developer comment removed** from About page
✅ **Fake team replaced** with honest "Our Approach" section (real team can be added via admin)
✅ **/careers, /press, /terms, /privacy, /refund, /copyright** — no more footer 404s
✅ **Proper 404 page** with helpful navigation
✅ **Pricing checkmarks fixed** with explicit visibility
✅ **Unique SEO metadata** on every page
✅ **Real contact form** that creates support tickets
✅ **Admin Content Manager** at `/admin/content`:
  - Testimonials
  - Team Members
  - FAQs
  - Footer Links
  - Social Media
  - Pricing Plans
  - Services
  - How It Works Steps
✅ **Site Settings** at `/admin/settings` — edit brand, hero, stats, contact, SEO
✅ **Visibility toggles** — hide testimonials, team, stats, social icons until you have real content

## How to Deploy the Update

### Step 1: Upload new files to GitHub

The simplest way: download the new zip, replace your files on GitHub.

1. Go to **github.com/apoex90-create/lumin-publishing**
2. For each new/changed file in the zip, upload it via **Add file → Upload files**

OR (faster): Replace the entire `lumin-publishing` folder contents on GitHub.

### Step 2: Reset the database

The new code expects new tables (Testimonial, TeamMember, FAQ, FooterLink, etc.). Run this:

1. Go to **Neon SQL Editor** (console.neon.tech)
2. Open `SETUP.sql` from this project
3. Copy the **entire content**
4. Paste into Neon SQL Editor
5. Click **Run**

⚠️ **This will DELETE all existing data** and create a clean slate with:
- Admin user: `admin@lumin.demo` / `demo1234`
- All 10 agents
- Default pricing plans
- Default How It Works steps
- All footer links (no more 404s)
- All default settings

### Step 3: Vercel will auto-redeploy

Once you push to GitHub, Vercel detects the changes and rebuilds automatically. Wait 2-3 minutes.

### Step 4: Login and configure

1. Go to your site → `/login`
2. Use `admin@lumin.demo` / `demo1234`
3. Click your avatar → **👑 Admin Panel**
4. Visit `/admin/content` to manage everything

## First Things to Do After Login

1. **Change your admin password** at `/dashboard/settings`
2. **Edit Site Settings** at `/admin/settings`:
   - Change `brand.name` if you want a different name
   - Set real contact email
   - Adjust hero text
3. **Add real social media links** at `/admin/content/social` (or leave empty — icons stay hidden)
4. **Add real testimonials** at `/admin/content/testimonials` when you have them (or leave empty)
5. **Enable team section** at `/admin/settings → Visibility` once you've added real team members

## Key Principle: Honest by Default

The site now **hides sections that have no real content**:
- No testimonials added → testimonials section disabled by default
- No team members → team section hidden
- No social links → social icons hidden
- No published books → "Featured Books" section disappears

You can enable each section once you have real content to display. No more "Priya Raghavan" fake testimonials.
