# Security / Launch Checklist

Before production launch:

- Enable Supabase auth and create only required staff accounts.
- Assign admin/broker/viewer roles explicitly.
- Review all RLS policies against actual public and staff requirements.
- Implement rate-limited server-side public enquiry endpoints.
- Add CAPTCHA/bot protection to listing and enquiry forms.
- Keep exact property address and owner PII out of public responses. The schema exposes `property_marketplace` as a safe projection instead of anonymous reads on the base table.
- Store verification documents in private buckets with signed URLs.
- Add audit logs for staff changes to owner, property, deal and commission records.
- Configure backups and recovery testing.
- Add secret rotation and separate staging/production environments.
- Add CSP/security headers on production hosting.
- Obtain final agency, privacy, retention and consent wording from Sri Lankan legal counsel.
