# 🤖 LUMIN — Fully Autonomous Publishing Platform

## The Architecture

LUMIN is now a **fully autonomous publishing house** — 10 AI agents do all the work, you only approve money.

```
                    🎯 ORCHESTRATOR (Manager)
                    Decides what each agent does next
                              │
        ┌──────────┬──────────┼──────────┬──────────┐
        ▼          ▼          ▼          ▼          ▼
    ✏️ EDITOR   🎨 DESIGNER  📚 FORMATTER  📣 MARKETING  📰 BLOGGER
    Edits        Cover         EPUB/PDF       Ad copy,      Daily SEO
    manuscripts  generation   generation      social posts  blog posts
        │
        ▼
    💬 SUPPORT   📧 MAILER    🌐 MAINTENANCE  💰 ACCOUNTS
    24/7 author  All outbound  Site health,    👑 NEEDS YOUR
    inquiries    emails        backups, fixes  APPROVAL
```

### How autonomy works

1. **Author submits a book** → Orchestrator routes it to Editor
2. **Editor finishes** → Orchestrator sends to Designer
3. **Designer creates covers** → Orchestrator sends to Formatter
4. **Formatter generates files** → Book auto-publishes
5. **Mailer sends congrats email**, Marketing creates ads, Blogger writes related posts
6. **Sales happen** → Accounts batches weekly payouts → **WAITS FOR YOUR APPROVAL**
7. **Author asks a question** → Support answers in seconds, 24/7

You sit on the throne. The bots do the work. You only see notifications when:
- An agent fails (you decide: retry, fix, or pause)
- A payment needs approval (every single one)
- A support ticket gets escalated

---

## 🚀 Deployment to Production

### The Stack (recommended for global scale)

| Layer | Service | Why | Cost |
|---|---|---|---|
| Hosting | **Vercel** | Auto-scales globally, built-in cron | Free → $20/mo |
| Database | **Neon Postgres** | Serverless, scales to zero | Free → $19/mo |
| File Storage | **Cloudflare R2** | Free egress, S3-compatible | $0.015/GB |
| AI Brain | **Anthropic Claude** | Best for writing/editing | Pay per use (~₹5/book) |
| Image AI | **Stability AI** | Best book covers | $10/1000 images |
| Email | **Resend** | 3K emails/month free | Free → $20/mo |
| Payments | **Razorpay + Stripe** | India + global | 2% per transaction |
| Monitoring | **Better Stack** | Uptime + logs | Free → $25/mo |

**Total minimum cost to start: ~₹0-3,000/month** until you have real traffic.

### Step-by-step deployment

#### 1. Database (Neon)
- Go to **neon.tech** → Sign up → Create project
- Copy the connection string → save as `DATABASE_URL`

#### 2. Push code to GitHub
```bash
cd lumin-publishing
git init
git add .
git commit -m "Initial commit"
# Create empty repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/lumin-publishing.git
git push -u origin main
```

#### 3. Deploy to Vercel
- Go to **vercel.com** → Sign up with GitHub
- Click "Import Project" → choose your repo
- Add environment variables (paste each from .env)
- Click Deploy. Done in 90 seconds.

#### 4. Run migrations on production DB
In Vercel project → Settings → Functions → Run once:
```bash
npx prisma migrate deploy
ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="a-strong-password" node prisma/seed.js
```

Or run locally pointing to prod DB:
```bash
DATABASE_URL="your-prod-url" npx prisma migrate deploy
DATABASE_URL="your-prod-url" ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="a-strong-password" node prisma/seed.js
```

Always set `ADMIN_EMAIL`/`ADMIN_PASSWORD` when seeding production — without
them the seed script generates a random password and prints it once to the
console (never a fixed/known default).

#### 5. Activate cron
Vercel reads `vercel.json` and automatically runs `/api/cron` every minute. This is what makes agents work. No extra setup.

#### 6. Add your custom domain
Vercel → Project → Settings → Domains → Add your domain. Update DNS as instructed.

### Going truly global (CDN + multiple regions)

Vercel + Neon + Cloudflare R2 already runs in 100+ edge locations worldwide. Authors in Mumbai, New York, London, Sydney all get sub-second responses. **No extra config needed.**

For 10M+ users scale, you'd add:
- Cloudflare in front for DDoS + WAF
- Read replicas of Postgres in EU and US
- Queue (Upstash QStash) for the agent system instead of direct DB

---

## 🤖 Agent Configuration

### Where to control everything: `/admin/agents`

Once logged in as admin, you see all 10 agents with:
- **Status** (Active / Paused) — toggle with one click
- **Total runs** — how many jobs they've done
- **Total errors** — how many failed
- **Total cost** — AI spend per agent (so you know which is expensive)

### Pausing an agent

If a bot starts misbehaving (e.g., Marketing keeps writing weird posts), click **PAUSE** on that agent. All its queued jobs hold until you resume.

### Changing what an agent does

Edit `lib/agents/registry.ts` — each agent has a `systemPrompt`. Change the prompt → restart → agent behaves differently. No code expertise needed; just rewrite the instructions in English.

### Adding new agents

1. Add to `registry.ts`
2. Create `lib/agents/executors/your-bot.ts`
3. Register it in `queue.ts`'s `executors` map

That's it — three steps to give your platform a new specialist.

---

## 👑 The Approval Throne

**Every money action** the Accounts Bot wants to make requires your approval.

### How it works

1. Friday 3pm → Accounts Bot calculates royalty payouts
2. For each author, creates a pending Approval (no money moves yet)
3. You get an email + see them at `/admin/approvals`
4. You click **Approve** or **Reject** for each one
5. Approved: money flows via Razorpay/Stripe
6. Rejected: payout cancelled, author notified

### Approval types

- **`payout`** — Royalty to author (weekly)
- **`refund`** — Refund requests
- **`expense`** — Infrastructure/AI costs > ₹10,000

### Bulk approval

If you trust the bots, you can later approve all pending payouts under ₹X at once. (Add to the approvals page if needed.)

---

## 📊 Monitoring & Operations

### Daily checklist (5 min)

1. Check `/admin/approvals` — approve pending money items
2. Check `/admin/agents` — make sure all 10 are green (Active, no errors)
3. Check `/admin/books?status=SUBMITTED` — confirm books are flowing through

### Weekly checklist (15 min)

1. Review `/admin/earnings` for the week
2. Look at top-failing jobs in agent logs
3. Spot-check blog posts the Blogger published (`/admin/content/blog`)

### What to do if an agent fails

Open `/admin/agents` → click the agent → see error logs. Common fixes:
- API key expired → update in Vercel env vars
- Out of credit → top up Anthropic/Stripe
- Bug in prompt → edit `registry.ts`

---

## 💸 Operating Costs at Scale

Per **100 books published/month**:

| Item | Cost |
|---|---|
| Vercel hosting | ₹0 (free tier) |
| Neon database | ₹0 (free → ₹1,500 at scale) |
| Claude API (editing + writing) | ₹500 (~₹5/book) |
| Stability AI (covers) | ₹2,000 (₹20/book) |
| Resend email | ₹0 (under 3K/month) |
| Cloudflare R2 storage | ₹500 (10GB total) |
| **TOTAL** | **~₹3,000/month** |

Per **1,000 books/month**: ~₹30,000/month — still profitable at any plan price.

### Hard cost cap

Set the `MAX_AI_SPEND_INR_PER_DAY` env var (you'd add to maintenance bot logic) to auto-pause agents if AI costs spike unexpectedly.

---

## 🔐 Security Notes

1. **Never commit .env** — already in .gitignore
2. **Rotate `JWT_SECRET`** every 6 months — changing it invalidates all active sessions (users must re-login). Deploy new value, then restart Vercel functions.
3. **Set `PII_ENCRYPTION_KEY`** (64-char hex, 32 random bytes) before going live — without it, author payout details (bank account, IFSC, PAN, UPI) cannot be encrypted at rest and the app will refuse to start in production
4. **Rotating `PII_ENCRYPTION_KEY`** — you MUST re-encrypt existing DB rows before deploying the new key, or all payout fields will return null. Run this migration script **before** swapping the key in Vercel:
   ```sql
   -- Identify rows that need re-encryption (run in Neon SQL editor)
   SELECT id, "payoutUpi", "payoutBankAccount", "payoutPanNumber"
   FROM "User" WHERE "payoutMethod" IS NOT NULL;
   ```
   Then run a Node script using `decryptPII` (old key) → `encryptPII` (new key) → `prisma.user.update` for each row.
5. **Enable 2FA on**: Vercel, Neon, Razorpay, Stripe, AI provider accounts
6. **Backup DB daily** — Neon does this automatically, but verify in dashboard
7. **Set up Sentry** for error alerts before going live

---

## 🆘 Disaster Recovery

If everything explodes:

1. **Vercel down** → traffic stops, but data is safe in Neon
2. **Neon down** → site shows error page (build a fallback static page in `/app/maintenance/page.tsx`)
3. **AI API down** → mock responses kick in (see `lib/ai-provider.ts`), agents log errors but don't crash
4. **You lose admin access** → recover via Neon SQL editor: `UPDATE "User" SET role = 'ADMIN' WHERE email = 'you@example.com';`

---

## What's left to wire (after you deploy)

The platform is **structurally complete**. To go from "running" to "fully automated production":

1. **Connect real image AI** in `lib/agents/executors/designer.ts` (calls Stability AI)
2. **Connect real email sending** in `lib/agents/executors/mailer.ts` (calls Resend)
3. **Connect real payments** in payment flow (Razorpay/Stripe)
4. **File upload to S3/R2** for manuscripts (currently saved as paths in DB)

Each of these is ~50 lines of code. The architecture is already designed for them — just swap the mock blocks with real API calls.

---

You now command a publishing house that runs itself. 👑✨
