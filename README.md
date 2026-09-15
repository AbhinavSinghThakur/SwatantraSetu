# Swatantra Setu

**Cooperative Gig Services Platform for Household & Community Services**

A production-ready MERN platform connecting verified cooperative workers with households, businesses, institutions and communities. Designed offline-first for low-connectivity (4G/5G) environments with SMS/USSD fallback workflows.

## Tech Stack

- **MongoDB** — data persistence
- **Express.js** — REST API
- **React (Vite)** — responsive web + mobile app UI
- **Node.js** — runtime

## Quick Start

```bash
npm run install:all
npm run seed    # optional if MongoDB is running
npm run dev     # API :5000, Web :5173
```

Or install packages separately:

```bash
npm install --prefix server
npm install --prefix client
npm install concurrently --no-save
npm run dev
```

Without MongoDB, the API serves realistic in-memory sample data automatically.

## Email verification

New registrations receive a bcrypt-hashed, six-digit email OTP. Codes expire after five minutes, and resend requests are limited to one per 60 seconds. Copy `server/.env.example` to `server/.env` and set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` before registering a new account. With `MONGODB_URI` configured, users and OTP metadata are stored by the existing Mongoose `User` model; without MongoDB, the existing in-memory demo mode is used.

## User Roles

| Role | Access |
|------|--------|
| Customer | Book services, track jobs, payments |
| Worker | Jobs, offline accept/reject, earnings |
| Cooperative Admin | Workforce, bookings, analytics |
| Federation Admin | Multi-coop oversight, forecasting |

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | priya.sharma@email.com | demo1234 |
| Worker | ramesh.kumar@coop.in | demo1234 |
| Coop Admin | admin@delhi-labour.coop | demo1234 |
| Federation | federation@nlcf.in | demo1234 |

## Features

- Offline-first worker profiles & job sync
- SMS/USSD-style booking fallback
- Map-based nearby worker discovery
- UPI / wallet / card / cash payments
- Multilingual UI (EN / HI + regional)
- AI matching, demand forecast, chatbot
- Trust & safety (verification, SOS, disputes)

## Project Structure

```
coopconnect/
├── client/          # React + Vite frontend
├── server/          # Express API + MongoDB models
└── package.json     # Monorepo scripts
```
