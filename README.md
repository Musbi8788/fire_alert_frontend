# FireAlert Frontend

React + Vite frontend for FireAlert GM.

---

## Requirements

- Node.js 18+
- pnpm 8+

---

## Install

From this frontend repo root:

```bash
pnpm install
```

---

## Run

From this frontend repo root:

```bash
pnpm run dev
```

The app runs on `http://localhost:5173` by default.

---

## Environment

Create `.env` from `.env.example` for local development.

- `VITE_API_BASE_URL` to point the frontend to the backend (example `http://localhost:8080`). If unset, the app uses same-origin `/api` requests.
- `PORT` to change the dev server port (default 5173)
- `BASE_PATH` to set the app base path (default `/`)

For Vercel, set `VITE_API_BASE_URL` to the Render backend URL, for example:

```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

---

## Build

```bash
pnpm run typecheck
pnpm run build
```

The production output is `dist/public`.

---

## Deploy To Vercel

Use this folder as the GitHub repo root.

- Framework Preset: Vite
- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm run build`
- Output Directory: `dist/public`

`vercel.json` includes SPA rewrites so browser refresh works for app routes.

---

## Project Layout

```
+-- src/            # app code
+-- public/         # static assets
+-- lib/            # OpenAPI spec + generated client libs
+-- scripts/        # utility scripts
```

---

## API Client

Typed API hooks are generated under `lib/api-client-react` from `lib/api-spec/openapi.yaml`.
