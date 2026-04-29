# TermsWatch

**Automated Terms of Service & Privacy Policy Change Monitoring**

TermsWatch automatically monitors legal documents across your SaaS stack. Get instant alerts when privacy policies, terms of service, or security docs change — with compliance context, audit trails, and zero alert fatigue.

## Problem

Your SaaS stack uses 50+ third-party services. Each can change their legal terms at any time, exposing you to:
- GDPR Article 28 violations (up to 4% of revenue in fines)
- SOC2 audit failures (missing vendor due diligence)
- Liability shifts and data processing risks
- Reputational damage from undisclosed privacy changes

## Solution

The only purpose-built tool for legal document monitoring:

- **Legal-Text Extraction** — Automatically extracts terms, privacy, and cookie policy text. Filters out blog posts and marketing noise.
- **Triple-Redundancy Detection** — Three independent methods ensure zero false negatives.
- **Smart Alerts** — Only alerts on meaningful legal changes. Highlights compliance keywords (GDPR, liability, data processing, etc.).
- **Audit Archive** — Permanent version history with timestamps. Export reports for SOC2, ISO27001, and GDPR compliance.
- **Pre-built Catalog** — One-click monitoring for 500+ common SaaS services.

## Tech Stack

- **Backend:** Node.js, Express, SQLite, BullMQ
- **Frontend:** React, Vite, Tailwind CSS
- **Infrastructure:** Railway/Render, Cloudflare R2
- **Payments:** Stripe
- **Email:** Resend

## Getting Started

```bash
# Install dependencies
npm run setup

# Start backend
cd backend && npm run dev

# Start frontend (in another terminal)
cd frontend && npm run dev
```

## Pricing

| Plan | Price | Monitors | Features |
|------|-------|----------|----------|
| **Free** | $0 | 1 | Weekly checks, email alerts, 30-day archive |
| **Starter** | $49/mo | 15 | Daily checks, Slack alerts, 1-year archive, catalog |
| **Pro** | $99/mo | 50 | Hourly checks, API access, unlimited archive, team mgmt |
| **Enterprise** | $199/mo | Unlimited | All features + white-label reports, custom integrations |

## Roadmap

- [x] MVP — Core monitoring, diffing, alerts
- [ ] V1 — Compliance categorization, Slack/Teams integration, API
- [ ] V2 — Semantic diff, risk scoring, Jira/Linear integration
- [ ] V3 — AI compliance recommendations, mobile app, GRC integrations

## License

MIT

---

Built autonomously as part of the [$2K MRR Challenge](https://github.com/megatronix122/termswatch).
