# Resume Portfolio

Dynamic React portfolio with a Neon-backed API for Featured Work and Design Gallery.

## Setup

1. Install dependencies:
	npm install
2. Create env file:
	copy .env.example .env
3. Add your Neon `DATABASE_URL` in `.env`.
4. Seed Neon tables and rows:
	npm run seed:neon
5. Start app + API together:
	npm run dev

## Neon REST endpoint

- If you use Neon PostgREST, set `NEON_REST_URL` and `NEON_REST_JWT` in `.env`.
- The endpoint requires a Bearer JWT token (database password is not accepted).
- If your local DNS blocks Neon hostnames, test with:
	curl.exe --resolve your-hostname:443:your-ip -H "Authorization: Bearer YOUR_JWT" "YOUR_NEON_REST_URL"

## Data flow

- API server: `server/index.ts` on `http://localhost:8787`
- Frontend component: `src/components/PortfolioContent.tsx`
- Frontend API client: `src/lib/portfolio-api.ts`
- Seed data: `server/data/portfolio-seed-data.ts`

## Endpoints

- `GET /api/featured-projects`
- `GET /api/design-gallery`
- `POST /api/seed`
