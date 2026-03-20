# Abir Mohanta — Portfolio

A dual-theme (Developer & Designer) portfolio website built with **React**, **Vite**, **TailwindCSS**, and **Neon Postgres**.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS + shadcn/ui
- **Backend**: Netlify Serverless Functions
- **Database**: [Neon](https://neon.tech) Serverless Postgres
- **Deployment**: Netlify

## Local Development

1. **Clone the repo**
   ```bash
   git clone https://github.com/itsmeabirmohanta/portfolioneon.git
   cd portfolioneon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your Neon `DATABASE_URL` in the `.env` file.

4. **Seed the database** (first time only)
   ```bash
   npm run seed:neon
   ```

5. **Start the dev server**
   ```bash
   npm run dev
   ```
   This starts both the Vite dev server and the Express API server concurrently.

## Deploying to Netlify

1. **Connect your GitHub repo** to Netlify
2. **Set environment variables** in Netlify dashboard:
   - Go to **Site settings → Environment variables**
   - Add `DATABASE_URL` with your Neon connection string
3. **Deploy** — Netlify will auto-detect the build settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

### How it works

- The Vite frontend is built as static files into `dist/`
- API routes (`/api/*`) are handled by Netlify serverless functions in `netlify/functions/`
- Client-side routing is handled via the SPA redirect rule in `netlify.toml`

## Project Structure

```
├── netlify/functions/       # Netlify serverless API functions
│   ├── health.ts
│   ├── featured-projects.ts
│   └── design-gallery.ts
├── server/                  # Express API (local development only)
├── src/                     # React frontend
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── pages/
├── netlify.toml             # Netlify deployment config
├── vite.config.ts           # Vite build config
└── package.json
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon Postgres connection string |
| `VITE_API_BASE_URL` | No | API base URL for local dev (defaults to `http://localhost:8787`) |
