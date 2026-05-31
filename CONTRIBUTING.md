# Contributing to Fire Alert (Frontend)

First off — thank you for taking the time to contribute! 🎉

Fire Alert is an open-source emergency fire-reporting platform. This repository is the **frontend** (React + Vite SPA). It talks to a separate FastAPI backend over HTTP; you do **not** need the backend running to work on most UI changes (see [Running without the backend](#running-without-the-backend)).

By participating in this project you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

---

## Table of contents

- [Ways to contribute](#ways-to-contribute)
- [Prerequisites](#prerequisites)
- [Project setup](#project-setup)
- [Running without the backend](#running-without-the-backend)
- [Development workflow](#development-workflow)
- [Commit message convention](#commit-message-convention)
- [Opening a pull request](#opening-a-pull-request)
- [Coding guidelines](#coding-guidelines)
- [Project-specific rules you must know](#project-specific-rules-you-must-know)
- [Reporting bugs & requesting features](#reporting-bugs--requesting-features)
- [Security issues](#security-issues)
- [License](#license)

---

## Ways to contribute

- 🐛 **Report bugs** — open an issue using the Bug Report template.
- ✨ **Request features** — open an issue using the Feature Request template.
- 📝 **Improve docs** — README, this guide, or in-code comments.
- 💻 **Submit code** — fix a bug or build a feature via a pull request.

If you're planning a non-trivial change, **open an issue first** to discuss it. This avoids duplicated effort and makes sure the change fits the project's direction.

---

## Prerequisites

- **Node.js 18+**
- **pnpm** — this repo is a pnpm workspace and will not work correctly with npm or yarn. Install with `npm install -g pnpm` or see https://pnpm.io/installation.
- A code editor with TypeScript support (VS Code recommended).

---

## Project setup

1. **Fork** this repository (`Musbi8788/fire_alert_frontend`) to your own GitHub account.
2. **Clone your fork:**
   ```bash
   git clone https://github.com/<your-username>/fire_alert_frontend.git
   cd fire_alert_frontend
   ```
3. **Add the upstream remote** so you can keep your fork in sync:
   ```bash
   git remote add upstream https://github.com/Musbi8788/fire_alert_frontend.git
   ```
4. **Install dependencies** (versions resolve from the workspace `catalog:`):
   ```bash
   pnpm install
   ```
5. **Create your environment file:**
   ```bash
   cp .env.example .env
   ```
   Set `VITE_API_BASE_URL` to point at a backend. For local backend development use `http://localhost:8080`; to develop against the live demo API use `https://fire-alert-backend-production.up.railway.app`.
6. **Start the dev server:**
   ```bash
   pnpm run dev
   ```
   The app runs at http://localhost:5173.

### Useful commands

| Command | What it does |
| --- | --- |
| `pnpm run dev` | Start the Vite dev server on `:5173` |
| `pnpm run typecheck` | Run TypeScript (`tsc --noEmit`) — **this is the required check** |
| `pnpm run build` | Production build to `dist/public` |
| `pnpm run serve` | Preview the production build locally |

> There is currently **no test runner or linter** configured. `pnpm run typecheck` (plus a clean `pnpm run build`) is the gate your PR must pass.

---

## Running without the backend

`VITE_API_BASE_URL` points the app at any running backend. Pointing it at the live demo API lets you build and exercise most UI without running the backend locally:

```env
VITE_API_BASE_URL=https://fire-alert-backend-production.up.railway.app
```

Use the demo accounts shown on the login screen to sign in.

---

## Development workflow

We use a **fork & pull request** model. Never commit directly to `main`.

1. **Sync your fork** with upstream before starting:
   ```bash
   git checkout main
   git pull upstream main
   ```
2. **Create a descriptive branch.** Use a prefix matching the change type:
   ```bash
   git checkout -b feat/admin-map-clustering
   # other examples:
   #   fix/login-redirect-loop
   #   docs/contributing-setup-steps
   #   refactor/report-card-component
   ```
3. **Make your changes** in small, focused commits.
4. **Verify locally before pushing:**
   ```bash
   pnpm run typecheck
   pnpm run build
   ```
5. **Push to your fork** and open a PR against `Musbi8788/fire_alert_frontend:main`.

---

## Commit message convention

This project follows [**Conventional Commits**](https://www.conventionalcommits.org/). Both commit messages and PR titles should follow this format:

```
<type>: <short, imperative description>
```

**Allowed types:**

| Type | Use for |
| --- | --- |
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `style` | Formatting / whitespace, no logic change |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | A performance improvement |
| `test` | Adding or fixing tests |
| `build` | Build system, dependencies, or tooling |
| `chore` | Routine maintenance, no src behaviour change |

**Examples:**

```
feat: add map clustering to admin dashboard
fix: prevent Bearer null header when logged out
docs: update CONTRIBUTING setup steps
refactor: extract report status badge into shared component
```

Keep the description in the imperative present tense ("add", not "added" or "adds"), lowercase, and under ~72 characters. Put extra detail in the commit body if needed.

---

## Opening a pull request

- Open your PR against the `main` branch of the upstream repo.
- Fill out the **pull request template** completely.
- Give the PR a Conventional Commits–style title (e.g. `feat: ...`).
- **Link the related issue** (e.g. "Closes #42").
- Include **before/after screenshots or a short clip** for any visible UI change.
- Confirm in the checklist that `pnpm run typecheck` and `pnpm run build` pass.
- Keep PRs focused — one logical change per PR. Large, unrelated changes bundled together are hard to review and slow to merge.
- A maintainer will review your PR. Please respond to feedback; PRs may need a few iterations before merge.

---

## Coding guidelines

- **TypeScript** — keep the codebase type-safe. No new `any` unless genuinely unavoidable, and prefer the generated API types.
- **Components** — functional components with hooks. Match the style of surrounding files.
- **Styling** — Tailwind CSS v4 utility classes. Use the `cn()` helper from `src/lib/utils.ts` to compose conditional classes. There is no separate Tailwind config file; theme tokens live in `src/index.css`.
- **Imports** — use the `@/` alias for anything under `src/` (e.g. `import { Button } from "@/components/ui"`).
- **Forms** — use `react-hook-form` with `zodResolver`; mirror the backend's validation rules in your zod schema (e.g. report description min length, latitude/longitude ranges).
- **Data fetching** — use the generated TanStack Query hooks via the wrappers in `src/hooks/use-auth-queries.ts`. Don't manually attach auth headers — see below.
- Keep accessibility in mind (labels, alt text, keyboard navigation) and ensure changes are responsive.

---

## Project-specific rules you must know

These are easy to get wrong — please read before submitting code.

1. **Never hand-edit generated API code.** Everything under `lib/api-client-react/src/generated/` and `lib/api-zod/src/generated/` is produced by [orval](https://orval.dev/) from `lib/api-spec/openapi.yaml`. To change the API surface, edit `openapi.yaml` to match the backend, then regenerate:
   ```bash
   cd lib/api-spec
   pnpm run codegen
   ```
   Commit the regenerated output together with the spec change.

2. **Auth tokens are attached globally.** The bearer token is added to every request in one place — the auth-token getter registered in `src/main.tsx`, applied by `lib/api-client-react/src/custom-fetch.ts`. **Do not re-inject `Authorization` headers per request.** Add data hooks by extending the wrappers in `src/hooks/use-auth-queries.ts`.

3. **Two UI component systems coexist** — know which you're importing:
   - `src/components/ui.tsx` — small hand-written barrel (`Button`, `Input`, `Textarea`, `Card`, `Badge`) with custom props. `import { Button } from "@/components/ui"` resolves to **this file**.
   - `src/components/ui/` — the full shadcn/Radix library, imported per-component (e.g. `@/components/ui/dialog`).

4. **Routing is Wouter, not React Router.** Route guards and role-based redirects live in `src/App.tsx` (`ProtectedRoute` / `PublicRoute`).

5. **Shared dependency versions are pinned centrally** in `pnpm-workspace.yaml` under `catalog:`. Add or bump shared deps there and reference them as `catalog:` in `package.json` rather than hardcoding versions. Note `minimumReleaseAge` intentionally delays adoption of brand-new releases.

6. **The API contract is camelCase** (`fullName`, `userId`, `isAdmin`, `createdAt`). The generated types reflect this — use them.

---

## Reporting bugs & requesting features

Use the GitHub **Issues** tab and pick the appropriate template:

- **Bug Report** — include steps to reproduce, expected vs actual behaviour, screenshots, and your browser/OS.
- **Feature Request** — describe the problem you're solving, not just the solution.

Search existing issues first to avoid duplicates.

---

## Security issues

**Do not report security vulnerabilities through public issues.** See [SECURITY.md](./SECURITY.md) for how to report them privately.

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE) that covers this project.
