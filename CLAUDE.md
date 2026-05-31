# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This is the **frontend** of Fire Alert — a React + Vite SPA for emergency fire reporting. Citizens register, log in, and submit fire reports with GPS coordinates; admins triage incoming reports on a dashboard with a live map and a status workflow (`pending` → `in-progress` → `resolved`). Deployed to **Vercel** (`https://fire-alert-mu.vercel.app/`).

## Commands

`pnpm` is required (the repo is a pnpm workspace). Node 18+.

```bash
pnpm install            # install; versions resolve from the workspace catalog
pnpm run dev            # Vite dev server on :5173
pnpm run typecheck      # tsc --noEmit — the only check; run before pushing
pnpm run build          # production build → dist/public
pnpm run serve          # preview the production build
```

There is no test runner and no ESLint config — `pnpm run typecheck` is the gate.

To regenerate the API client after the API contract changes, run from `lib/api-spec/`:
```bash
pnpm run codegen        # orval: openapi.yaml → typed client + zod schemas
```

## How this connects to the backend

The frontend talks to a separate **FastAPI backend** (its own repo, deployed to Railway at `https://fire-alert-backend-production.up.railway.app/`). The two are linked only by an HTTP contract — there is no shared code, just a copy of the OpenAPI spec on this side.

- `VITE_API_BASE_URL` (`.env`) points at the backend. `src/main.tsx` reads it and calls `setBaseUrl(...)`; if unset, the client falls back to same-origin `/api`. In production it must be the Railway URL.
- All backend routes live under `/api` (e.g. `/api/users/login`, `/api/reports`, `/api/admin/reports`). The generated client already prepends `/api`, so relative paths combine with the base URL.
- **The wire format is camelCase** (`fullName`, `userId`, `isAdmin`, `createdAt`). The backend deliberately exposes camelCase even though its database is snake_case, so the TS types are camelCase end to end.
- Auth is a JWT bearer token (50-day expiry) returned by `/api/users/login` and `/api/users/register`. CORS on the backend only allows specific origins (the Vercel domain, `*.vercel.app` previews, and localhost) — a new deploy origin must be whitelisted there.

## The generated API client (most important architecture)

`lib/api-spec/openapi.yaml` is the **source of truth** for the API surface. `orval` (config in `lib/api-spec/orval.config.ts`) generates two workspace packages from it:

- `@workspace/api-client-react` (`lib/api-client-react/`) — typed functions + TanStack Query hooks (`useGetUserReports`, `useCreateReport`, `loginUser`, …) and all request/response types (`UserProfile`, `FireReport`, `CreateReportRequest`, …).
- `@workspace/api-zod` (`lib/api-zod/`) — zod schemas mirroring the same types.

Rules:
- **Never hand-edit anything under `generated/`** — it is overwritten by `codegen`. Hand-written code lives only in `lib/api-client-react/src/custom-fetch.ts` and `index.ts`.
- `openapi.yaml` is maintained by hand here and is *not* auto-exported from the backend, so it can drift. When the API changes, update the YAML to match the backend, then re-run `codegen`.
- `custom-fetch.ts` is the orval "mutator" — the single fetch wrapper for every request. It applies the base URL, normalizes JSON/error parsing into `ApiError`, and can attach a bearer token via `setAuthTokenGetter`.

## Auth flow (and its duplicated token injection — a gotcha)

- `src/lib/auth-context.tsx` (`AuthProvider` / `useAuth`) holds `{ user, token }`, persisted to `localStorage` under `fire_alert_token` and `fire_alert_user`. `isAuthenticated` is just `!!token`. No server-side session validation on load — stored values are trusted until an API call fails.
- Tokens reach the backend through a **single global mechanism**: `src/main.tsx` registers `setAuthTokenGetter(() => localStorage.getItem("fire_alert_token"))`, so `custom-fetch` attaches `Authorization: Bearer …` to every request automatically (only when no `authorization` header is already set). Do not re-inject auth headers per call — that path was removed to keep one source of truth.
- `src/hooks/use-auth-queries.ts` wraps the generated hooks purely to centralize query keys, polling, and TanStack `invalidateQueries` — it no longer touches auth. When adding authenticated calls, extend these wrappers rather than calling generated hooks directly. Unauthenticated calls (`loginUser`, register) are called directly from the generated client in the page components.
- Admin views poll: `useAdminReports` / `useAdminStats` set `refetchInterval: 10000` (10s).

## Routing & access control

`src/App.tsx` uses **Wouter** (not React Router). Two guard wrappers enforce role-based redirects:
- `ProtectedRoute` — unauthenticated → `/login`; admins are pushed to `/admin`, non-admins to `/dashboard`. `requireAdmin` gates `/admin`.
- `PublicRoute` — authenticated users are bounced off `/`, `/login`, `/register` to their dashboard.

Pages: `Landing`, `Login`, `Register`, `UserDashboard` (submit + own report history; uses `navigator.geolocation` for GPS), `AdminDashboard` (all reports, filter, map, status updates), `not-found`.

## UI components — two systems coexist (gotcha)

- `src/components/ui.tsx` — a small **hand-written** barrel exporting `Button`, `Input`, `Textarea`, `Card`, `Badge` with custom props (`label`, `error`, `isLoading`, `variant`). `import { Button } from "@/components/ui"` resolves to **this file** (it shadows the directory). The pages use these.
- `src/components/ui/` — the full **shadcn/Radix** library ("new-york" style, ~50 files), imported per-component as `@/components/ui/button`, etc. `components.json` configures shadcn for adding more.

`Badge`'s variants are exactly the report statuses (`pending` / `in-progress` / `resolved`), tied to the backend status values. Styling is Tailwind v4 (via `@tailwindcss/vite`, no separate config file — see `src/index.css`); `cn()` in `src/lib/utils.ts` merges classes.

## Conventions

- Path alias: `@/...` → `src/...` (Vite + tsconfig).
- Build output is `dist/public` (set in `vite.config.ts`); Vercel serves it with SPA rewrites (`vercel.json`).
- Dependency versions are pinned centrally in `pnpm-workspace.yaml` under `catalog:`; package entries reference `catalog:` instead of literal versions. Add shared deps there. `minimumReleaseAge` delays adoption of brand-new releases.
- Forms use `react-hook-form` + `zodResolver`; client-side zod schemas in pages should match the backend's validation (e.g. report `description` min length 10, lat/long ranges).
