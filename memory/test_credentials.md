# BSA GRC — Test Credentials

## Admin Panel
- URL: `/admin/login`
- Email: `admin@bsagrc.co.id`
- Password: `BSA@GRC2026!`

Auth: JWT (jose) in httpOnly cookie `bsa_admin_session`, bcrypt password hashing.
Admin user stored in Neon table `bsa_admin_users` (auto-seeded on first login from ADMIN_EMAIL/ADMIN_PASSWORD env).
Brute force: locks an IP+email for 15 minutes after 5 failed attempts (table `bsa_login_attempts`).

## Database
- Neon Postgres via `DATABASE_URL` in `/app/.env`. Only `bsa_*` prefixed tables belong to this app.

## Notes
- Password can be changed in Admin → Akun & Password. Keep it as above for testing.
