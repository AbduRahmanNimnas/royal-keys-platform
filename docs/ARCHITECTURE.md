# Royal Keys Architecture

## Product boundary

Royal Keys is a brokerage transaction system with a public discovery surface. The brokerage remains in the transaction path so introductions, viewings, negotiations, successful outcomes and fees can be attributed.

## Core domains

1. **Owners** — identity/contact and verification state.
2. **Properties** — sale/rent inventory with review/live/under-offer/closed lifecycle.
3. **Leads** — buyers/tenants with qualification inputs and operational lead score.
4. **Introductions** — immutable-ish link between a lead and property, with introduction time and contractual protection window.
5. **Viewings** — requested/confirmed/completed/cancelled/no-show appointments.
6. **Offers** — sale negotiation workflow.
7. **Rental applications** — tenant profile and letting workflow.
8. **Deals** — final successful/failed transaction state.
9. **Commissions** — sale 3% or rental half-month rule applied only to final successful amount.
10. **Activities / tasks** — audit and follow-up layer.

## Runtime modes

### Demo/local

The React store seeds realistic data and persists mutations to browser localStorage. This allows product validation without database cost or Lovable credits.

### Production

Supabase/PostgreSQL is the intended first backend. The included migration provides normalized tables and RLS starter policies. Staff authentication is enabled automatically when Supabase environment variables are present; otherwise the app stays in explicit demo mode.

## Security principles

- Owner phone/email are never rendered on public property pages.
- Public property reads are limited to marketable statuses.
- Staff CRUD requires authenticated staff roles through RLS.
- Public lead intake should go through a validated/rate-limited server endpoint, not open anonymous table insert policies.
- Service-role keys must never be sent to the browser.
- Legal title verification must be performed by qualified professionals; software verification statuses must not imply legal title clearance.

## Integration boundaries

Future connectors should attach around domain events instead of becoming the source of truth:

- Meta/Google → create Lead.
- WhatsApp/SMS → notification and OTP delivery.
- Calendar → mirror confirmed Viewings.
- Email → owner/buyer updates.
- Payments/accounting → Commission invoice/payment state.
- Document storage → property/agency verification files.

## Git workflow

- `main`: production-ready baseline.
- `develop`: integration branch if needed.
- `feature/*`: isolated changes.
- CI runs tests, build and lint before merge.

Lovable should be used primarily for final preview/deployment/integration tasks, not routine code generation.
