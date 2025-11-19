# TinyLink - Take Home Assignment

Stack: Next.js (App Router), TypeScript, TailwindCSS, Neon (Postgres), Drizzle ORM.

## Local dev

1. Copy `.env` to `.env.local` and set `DATABASE_URL` and `BASE_URL`.
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:3000`

## Deployment
- Deploy Next.js to Vercel.
- Create Neon Postgres & set `DATABASE_URL` secret on Vercel.
- Set `BASE_URL` to your production URL.

## Notes
- Routes:
  - `GET /` Dashboard
  - `GET /code/:code` Stats page
  - `GET /:code` Redirect (302)
  - `GET /healthz` Health check
  - API:
    - `POST /api/links`
    - `GET /api/links`
    - `GET /api/links/:code`
    - `DELETE /api/links/:code`
