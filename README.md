# Event Booking API

REST API for the Event Booking System (Express 5 + Prisma + MySQL/MariaDB).

## Setup

```bash
npm install          # runs prisma generate
cp .env.example .env # then fill in the values
npm run migrate      # create tables
npm run seed         # sample users, events and bookings
npm run dev
```

Seed accounts (password `123456`): `admin@gmail.com` (ADMIN), `harry@gmail.com`, `shaw@gmail.com`.

### Existing database

If your database was created before `prisma/migrations` existed (e.g. with `prisma db push`),
mark the initial migration as already applied instead of running it:

```bash
npx prisma migrate resolve --applied 0_init
```

## Environment

| Key | Description |
|---|---|
| `DATABASE_URL` | Used by Prisma CLI (migrate / seed) |
| `DATABASE_HOST` / `DATABASE_PORT` / `DATABASE_USER` / `DATABASE_PASSWORD` / `DATABASE_NAME` | Used by the app at runtime |
| `PORT` | API port (web expects `5005`) |
| `JWT_SECRET` | Required — the server will not start without it |
| `CORS_ORIGIN` | Allowed origins, comma separated (default `http://localhost:5173`) |
| `WEB_URL` | Web app URL used in password reset links (default `http://localhost:5173`) |

## Password reset

`POST /auth/forgot-password` creates a reset token valid for 30 minutes. There is no email
service yet, so the reset link is printed in the server log, and — unless
`NODE_ENV=production` — also returned as `resetUrl` in the response.

Example requests for every endpoint are in `http/api.http`.
