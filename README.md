# Layer Design Studio

Portfolio website with React (frontend) + Express/SQLite (backend admin API).

## Local development

### 1. Frontend
```bash
npm install
cp .env.example .env
npm run dev
```

The frontend runs on `http://localhost:5173`.

### 2. Backend
```bash
cd server
npm install
npm start
```

The backend runs on `http://localhost:3001` with API at `http://localhost:3001/api`.

### 3. Environment variable

Frontend uses:

```env
VITE_API_BASE=http://localhost:3001/api
```

Set this to your hosted backend URL in production.

## Build

```bash
npm run build
```

## Netlify deployment (frontend)

This repo includes `netlify.toml` with:

- build command: `npm run build`
- publish directory: `dist`
- SPA redirect: `/* -> /index.html`

In Netlify project settings, add environment variable:

```env
VITE_API_BASE=https://your-backend-domain.com/api
```

## Backend deployment

Deploy `server/` to a Node host (Render, Railway, Fly.io, VPS, etc.).

Required backend env vars:

```env
PORT=3001
ADMIN_PASSWORD=your-secure-password
```

After backend deploy, set Netlify `VITE_API_BASE` to that API URL.

## Notes

- Frontend no longer relies on mock fallback datasets.
- Partners now support optional URLs; if provided, public partner cards become clickable links.
