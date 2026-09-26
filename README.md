# Royal Keys Property Platform

A software-powered Sri Lankan real-estate brokerage application. This is intentionally **not** a pure classifieds clone: the product keeps enquiries, qualification, viewing, offers/applications, deals and commissions inside one workflow.

## Current business rules

- Property sale: **3% of the final successful transaction value**.
- Rental placement: **50% of one month's agreed rent** on successful tenant placement.
- Public pages do not expose owner phone numbers.
- Agency obligations, introduction protection, commission entitlement and payment timing remain subject to a final signed legal agreement.

## Implemented MVP

- Public home, Buy, Rent, Sell, List for Rent, How It Works.
- Search/filtering by location, type, price/rent and bedrooms.
- Property detail/gallery and privacy-safe managed enquiry flow.
- Buyer/tenant lead capture with operational scoring.
- Viewing requests.
- Sale offers.
- Rental applications.
- Owner property submission and fee acknowledgement.
- Brokerage CRM dashboard.
- Properties / Owners / Leads / Match Center / Viewings / Offers / Rental Applications.
- Deal close flow.
- Automatic commission generation.
- Commission calculator and payment status.
- Local browser persistence for demo/testing.
- Supabase production schema + RLS starter migration.

## Stack

TanStack Start + React 19 + TypeScript + Tailwind CSS 4, designed to stay compatible with the Lovable TanStack project shell.

## Local setup

```bash
npm install
npm run dev
```

Run checks:

```bash
npm test
npm run build
npm run lint
```

## Production database

1. Create a dedicated Supabase project.
2. Apply `supabase/migrations/001_initial_schema.sql` after legal/security review.
3. Copy `.env.example` to `.env.local` and provide the Supabase URL and anon key.
4. Wire the current local store actions to server-side validated database operations.
5. Do **not** expose service-role keys to the browser.

## Production work still requiring credentials / external decisions

- Staff account identities and admin role assignment.
- OTP/WhatsApp provider and templates.
- Email provider.
- Property image/document storage bucket policy.
- Signed agency agreement wording from Sri Lankan counsel.
- Domain, production hosting and analytics.
- Meta/Google lead integrations and webhook credentials.

The repository is designed so these integrations can be added without redesigning the product model.
