# Sandbox Console (React + TypeScript + Vite)

Deployed demo: <YOUR_URL_HERE>

This is a tiny “Sandbox Console” for a fictional gateway. Developers can sign in (or continue as Guest), create and manage pretend API keys, and view synthetic usage analytics. The app is fully client-side with mocked services and a visible feature flag system.

## Run locally

Prereqs: Node 18+ and pnpm/npm.

```bash
pnpm install
pnpm dev
# open http://localhost:5174
```

Build:

```bash
pnpm build && pnpm preview
```

## Auth choice

Option C: Local mock session stored in `localStorage` with a 24h expiry. Protected routes use a `RequireAuth` guard that redirects to `/signin` when unauthenticated or after expiry. We also include a Guest sign-in button so reviewers can access the app without external credentials.

Why: Keeps the scope focused and deterministic without external providers or serverless setup, while still demonstrating route protection and session expiry.

## Feature flag

Open the Dev panel (floating code button) to toggle features:

- Color mode switch visibility (+ default theme when disabled)
- User menu visibility
- Various UI/keys flags (copy, revoke, descriptions)

This demonstrates a practical feature flag rollout pattern for UI features.

## API keys

- Create, edit, revoke, delete
- Regenerate key
- Full key is shown exactly once (in a reveal modal) on create/regenerate
- Keys are persisted in `localStorage` via a mock DB service
- Copy-to-clipboard with toasts

## Usage & analytics

- Synthetic per-key stats generated on first access
- Aggregates across keys
- Chart + table with a simple period selector (24h/7d/30d)

## Docs & quickstart

- Documentation sections (Markdown-powered)
- A “Quickstart” with curl and Node examples
- Inline Copy buttons on code blocks, and a tip for common 401 errors

## Testing

Playwright E2E (scaffolded) covering:

- Guest entry and redirect to dashboard
- Create key → reveal modal → revoke
- Feature flag toggles the UI (hides user menu)
- Usage chart visible with data
- Empty state for keys

Run E2E locally:

```bash
pnpm dlx playwright install
pnpm exec playwright test
```

Unit tests: A couple of Vitest examples exist; extend as needed.

## Architecture & tradeoffs

- Routing: React Router with a simple `RequireAuth` wrapper
- State: React Context for auth, feature flags, keys, theme, i18n
- Data: Mock services layered behind `services/` that read/write to `localStorage`
- Theming: CSS custom properties, dark/light via `data-theme` and `color-mode` on `<html>`
- Components: Small, reusable set with SCSS (BEM) and basic tokens
- Charts: Chart.js via `react-chartjs-2` for familiarity and minimal setup

Tradeoffs: Pure client-side mocks keep iteration quick but limit realism (no real latency/error diversity). Feature flags focus on visible UI changes for review simplicity.

## Synthetic data

Stats are generated deterministically on first load and cached in `localStorage`. Keys are also persisted locally. No backend is required.

## Reflection

If I had more time: I would add richer error simulation, accessibility polish on all focus states, more granular feature flags, and full CI with Playwright on multiple browsers.

AI coding assistance: Used occasionally to accelerate boilerplate and spot edge cases. Worked well for scaffolding and quick refactors; less helpful for nuanced UX decisions where manual iteration was faster.

## .env

No environment variables are required. See `.env.example` for shape.
