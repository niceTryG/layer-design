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
VITE_API_BASE=/api
```

Use `/api` when frontend and backend are served from the same origin.
If frontend and backend are on different hosts, set this to your backend API URL (HTTPS), e.g. `https://your-backend-domain.com/api`.

## Build

```bash
npm run build
```

## Netlify deployment (frontend)

This repo includes `netlify.toml` with:

- build command: `npm run build`
- publish directory: `dist`
- SPA redirect: `/* -> /index.html`

In Netlify project settings, add environment variable only when backend is on a different host:

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

After backend deploy:

- If frontend and backend are separate hosts: set `VITE_API_BASE` to backend API URL.
- If same host: remove `VITE_API_BASE` or set it to `/api`.

## Notes

- Frontend no longer relies on mock fallback datasets.
- Partners now support optional URLs; if provided, public partner cards become clickable links.
