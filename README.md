# Fire Alert Frontend

Production-ready React frontend for the Fire Alert emergency reporting platform. The app provides the public landing page, citizen authentication, fire report submission, report history, and an admin command center with live incident data and map visualization.

Live demo: https://fire-alert-mu.vercel.app/

The frontend is deployed on **Vercel** and connects to a **Railway-hosted FastAPI backend**.

## System Overview

Fire Alert helps people report fire emergencies with GPS coordinates and lets administrators track incoming reports from a central dashboard.

Main user flows:

- Visitors can view the public landing page.
- Users can register and log in.
- Authenticated users can submit fire reports with description, coordinates, and optional address.
- Users can review their own report history and status.
- Admin users can view all reports, filter by status, see statistics, review locations on a map, and update incident status.

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Radix UI components
- TanStack Query
- Wouter routing
- Leaflet and React Leaflet for maps
- Generated OpenAPI client packages under `lib/`

## Requirements

- Node.js 18 or newer
- pnpm 8 or newer
- Running backend API for local development

## Local Setup

Install dependencies from the `frontend` folder:

```bash
pnpm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Example `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Start the local dev server:

```bash
pnpm run dev
```

The app runs at:

```text
http://localhost:5173
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm run dev` | Start the Vite development server |
| `pnpm run typecheck` | Run TypeScript type checking |
| `pnpm run build` | Build the production app |
| `pnpm run serve` | Preview the production build locally |

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Yes | Base URL for the FastAPI backend. Use the Railway backend URL in production. |

Local example:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Production example:

```env
VITE_API_BASE_URL=https://fire-alert-backend-production.up.railway.app
```

If `VITE_API_BASE_URL` is not set, the app falls back to same-origin `/api` requests. For this deployment setup, set it explicitly because the frontend runs on Vercel and the backend runs on Railway.

## Vercel Deployment

Deploy this `frontend` folder as the Vercel project.

Production URL:

```text
https://fire-alert-mu.vercel.app/
```

Recommended Vercel configuration:

- Framework preset: Vite
- Root directory: `frontend`
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm run build`
- Output directory: `dist/public`

The included `vercel.json` configures:

- Vercel install command
- Vercel build command
- Production output directory
- SPA rewrites to `index.html` so browser refresh works on client-side routes

Set this Vercel environment variable:

```env
VITE_API_BASE_URL=https://fire-alert-backend-production.up.railway.app
```

The Railway backend must allow the Vercel frontend through CORS:

```env
FRONTEND_ORIGINS=https://fire-alert-mu.vercel.app
```

## Build

Run the production checks before deployment:

```bash
pnpm run typecheck
pnpm run build
```

Production output is generated in:

```text
dist/public
```

## Project Layout

```text
frontend/
|-- src/
|   |-- App.tsx             # Route definitions and protected routes
|   |-- main.tsx            # React entrypoint and API client setup
|   |-- pages/              # Landing, auth, user dashboard, admin dashboard
|   |-- components/         # Layout, map, and UI components
|   |-- hooks/              # API hooks and shared hooks
|   `-- lib/                # Auth context and utilities
|-- lib/
|   |-- api-spec/           # OpenAPI specification
|   |-- api-client-react/   # Generated typed API client and hooks
|   |-- api-zod/            # Generated schema helpers
|   `-- db/                 # Workspace package support
|-- public/                 # Static assets
|-- scripts/                # Utility scripts
|-- vercel.json             # Vercel deployment configuration
|-- package.json
|-- .env.example
`-- README.md
```

## API Client

Typed API helpers are generated under:

```text
lib/api-client-react
```

The frontend configures the API base URL in `src/main.tsx` using `VITE_API_BASE_URL`. Authentication tokens are stored client-side and attached by the generated API client for protected routes.

## Production Checklist

- `VITE_API_BASE_URL` points to the Railway backend URL.
- Railway backend `FRONTEND_ORIGINS` includes `https://fire-alert-mu.vercel.app`.
- `pnpm run typecheck` passes.
- `pnpm run build` passes.
- Login, registration, user report submission, admin report filtering, and status updates work against the production backend.
