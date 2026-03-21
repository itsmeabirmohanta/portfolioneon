# Abir Mohanta Portfolio

Production-ready portfolio built with React, Vite, Netlify Functions, and Neon Postgres.

## Stack

- Frontend: React 18, TypeScript, Vite, TailwindCSS, shadcn/ui
- API: Netlify Functions for production, Express API for local or container deployment
- Database: Neon Serverless Postgres
- Hosting: Netlify (recommended)

## Quick Start

1. Clone and install dependencies.

```bash
git clone https://github.com/itsmeabirmohanta/portfolioneon.git
cd portfolioneon
npm install
```

1. Create local environment file.

```bash
cp .env.example .env
```

1. Add your Neon connection string in .env.

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

1. Seed database tables and rows.

```bash
npm run seed:neon
```

1. Start local development.

```bash
npm run dev
```

## Deployment Files Included

- netlify.toml: build config, redirects, and security headers
- public/_redirects: redirect fallback for SPA routing and API rewrites
- .nvmrc: Node runtime pin for consistent CI/CD builds
- Dockerfile.api: container deployment for Express API
- .dockerignore: safe, lean container context

## Routing and Redirects

Production routing is configured in two places for safety:

1. Netlify redirect rules in netlify.toml.

1. Rule: /api/* -> /.netlify/functions/:splat.

1. Rule: /* -> /index.html for React Router SPA fallback.

1. Static fallback in public/_redirects mirrors the same API and SPA behavior.

Frontend routes are handled in src/App.tsx using BrowserRouter.

## Security Hardening

### Netlify Edge and Static Protections

Configured in netlify.toml:

- Strict-Transport-Security
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- Cross-Origin-Opener-Policy
- Cross-Origin-Resource-Policy
- no-store for API responses

### Function-Level Protections

Shared security layer in netlify/functions/_lib/security.ts provides:

- Method allowlisting (GET/OPTIONS or explicit methods)
- CORS allowlist support using CORS_ALLOWLIST
- Per-IP in-memory rate limiting with response headers
- Standardized secure response headers

Applied to:

- netlify/functions/health.ts
- netlify/functions/featured-projects.ts
- netlify/functions/design-gallery.ts

### Express API Protections

Configured in server/index.ts:

- helmet for secure HTTP headers
- hpp against HTTP parameter pollution
- express-rate-limit for /api/*
- x-powered-by disabled
- trust proxy enabled for real client IP handling
- JSON payload limit set to 100kb
- CORS allowlist enforcement
- Protected /api/seed endpoint using X-API-Key in production

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| DATABASE_URL | Yes | Neon Postgres connection string |
| VITE_API_BASE_URL | No | Local frontend override for API base URL |
| API_PORT | No | Express API port (default 8787) |
| CORS_ALLOWLIST | Recommended | Comma-separated allowed browser origins |
| SEED_API_KEY | Required in production Express deployments | Secret for /api/seed endpoint |
| YOUTUBE_API_KEY | Recommended | YouTube Data API v3 key used to auto-fetch video titles and descriptions |

Example CORS_ALLOWLIST:

```env
CORS_ALLOWLIST=https://your-domain.com,https://www.your-domain.com
```

## Netlify Deployment Steps

1. Connect repository to Netlify.

1. Build settings are auto-detected from netlify.toml.

1. Set environment variables in Netlify dashboard: DATABASE_URL and CORS_ALLOWLIST.

1. Deploy.

## API Container Deployment (Optional)

Use Dockerfile.api when you want to deploy the Express API separately.

Build:

```bash
docker build -f Dockerfile.api -t portfolio-api .
```

Run:

```bash
docker run --rm -p 8787:8787 --env-file .env portfolio-api
```

## Scripts

- npm run dev: run Vite + Express together
- npm run dev:web: run Vite only
- npm run dev:api: run Express API in watch mode
- npm run start:api: run Express API once (production style)
- npm run build: production frontend build
- npm run seed:neon: seed Neon data

## Notes on Rate Limiting

- Express limiter is suitable for single-instance deployments.
- Netlify function limiter is in-memory and best-effort per warm instance.
- For enterprise-grade distributed limiting, use an external store (Redis/Upstash) or provider WAF rate limiting.

## Recommended Extra Protections

- Enable Netlify WAF and bot protection.
- Add Neon least-privilege DB roles.
- Rotate DATABASE_URL and SEED_API_KEY regularly.
- Keep package dependencies updated and run periodic npm audit.
