<<<<<<< HEAD
# Zama Console

Deployed demo: https://zama.sil.mt

Zama Console is a modern API gateway management interface built with React, TypeScript, and Vite. Developers can sign in (or continue as Guest), create and manage API keys, and view detailed usage analytics with beautiful charts. The application is fully client-side with mocked services and a comprehensive feature flag system for demonstration purposes.

## Run locally

Prereqs: Node 18+ and npm.

```bash
npm install
npm run dev
# open http://localhost:5173
=======
# Sandbox Console (React + TypeScript + Vite)

Deployed demo: <YOUR_URL_HERE>

This is a tiny “Sandbox Console” for a fictional gateway. Developers can sign in (or continue as Guest), create and manage pretend API keys, and view synthetic usage analytics. The app is fully client-side with mocked services and a visible feature flag system.

## Run locally

Prereqs: Node 18+ and pnpm/npm.

```bash
pnpm install
pnpm dev
# open http://localhost:5174
>>>>>>> ed5c1c21234bc45c5f84973d4ae88c93976e8c0b
```

Build:

```bash
<<<<<<< HEAD
npm run build && npm run preview
```

## Authentication

Local mock session stored in `localStorage` with a 24h expiry. Protected routes use a `RequireAuth` guard that redirects to `/signin` when unauthenticated or after expiry. We also include a Guest sign-in button so reviewers can access the app without external credentials.

**Why**: Keeps the scope focused and deterministic without external providers or serverless setup, while still demonstrating route protection and session expiry.

## Feature Flags
=======
pnpm build && pnpm preview
```

## Auth choice

Option C: Local mock session stored in `localStorage` with a 24h expiry. Protected routes use a `RequireAuth` guard that redirects to `/signin` when unauthenticated or after expiry. We also include a Guest sign-in button so reviewers can access the app without external credentials.

Why: Keeps the scope focused and deterministic without external providers or serverless setup, while still demonstrating route protection and session expiry.

## Feature flag
>>>>>>> ed5c1c21234bc45c5f84973d4ae88c93976e8c0b

Open the Dev panel (floating code button) to toggle features:

- Color mode switch visibility (+ default theme when disabled)
- User menu visibility
- Various UI/keys flags (copy, revoke, descriptions)
<<<<<<< HEAD
- Language switcher functionality
- Tooltips and other UI enhancements

This demonstrates a practical feature flag rollout pattern for UI features.

## API Keys Management

- Create, edit, revoke, and delete API keys
- Regenerate keys with security validation
- Full key is shown exactly once (in a reveal modal) on create/regenerate
- Keys are persisted in `localStorage` via a mock DB service
- Copy-to-clipboard functionality with toast notifications
- Comprehensive permission and usage tracking

## Usage Analytics & Charts

- Synthetic per-key stats generated on first access
- Aggregates across all API keys
- Interactive charts built with **Recharts** for modern, beautiful visualizations
- Multiple chart types: Bar charts for 24-hour usage, Area charts for 14-day trends
- Period selector (24h/7d/30d) with responsive design
- Real-time data updates with smooth animations

## Documentation & Quick Start

- Comprehensive documentation sections powered by Markdown
- Quickstart guide with curl and Node.js examples
- Inline copy buttons on all code blocks
- Error handling tips and common troubleshooting
- Multi-language support (English, Dutch, French)

## Internationalization (i18n)

Full internationalization support with:
- English, Dutch, and French translations
- Dynamic language switching
- Localized date/time formats
- RTL language support preparation

## Testing

**E2E Testing with Playwright:**
- Guest entry and redirect to dashboard
- Create key → reveal modal → revoke workflow
- Feature flag toggles UI elements (hides user menu)
- Usage chart visibility with data validation
- Empty state handling for keys list
- Responsive design testing
=======

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
>>>>>>> ed5c1c21234bc45c5f84973d4ae88c93976e8c0b

Run E2E locally:

```bash
<<<<<<< HEAD
npx playwright install
npm run test:e2e
```

**Unit Testing with Vitest:**
- Component testing with React Testing Library
- Store pattern testing
- Utility function validation
- Mock service testing

Run unit tests:

```bash
npm run test
npm run test:ui
```

## Architecture & Technology Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite for fast development and optimized builds
- **Routing:** React Router v7 with authentication guards
- **State Management:** React Context for auth, feature flags, keys, theme, locale
- **Styling:** SCSS with CSS custom properties, BEM methodology
- **Charts:** Recharts for modern, responsive data visualizations
- **Testing:** Playwright for E2E, Vitest for unit testing
- **Code Quality:** ESLint with React plugin, TypeScript strict mode

**Advanced CSS Features:**
- CSS Anchor Positioning for modern layout effects
- Scroll-Linked Animations for smooth interactions
- Polyfills for cross-browser compatibility
- CSS custom properties for theming

## Component Architecture

- **Atomic Design:** Small, reusable components with clear separation of concerns
- **Store Pattern:** Context-based state management with hooks and providers
- **Type Safety:** Full TypeScript coverage with strict type checking
- **Accessibility:** ARIA labels, keyboard navigation, semantic HTML
- **Responsive:** Mobile-first design with fluid layouts

## Performance Optimizations

- **Code Splitting:** Route-based and component-based lazy loading
- **Bundle Optimization:** Tree shaking, minification, and compression
- **Image Optimization:** WebP/HEVC formats with fallbacks
- **Caching:** Service worker preparation and localStorage optimization
- **Rendering:** React.memo, useMemo, and useCallback where appropriate

## Security Features

- **API Key Protection:** Keys shown only once with secure handling
- **Input Validation:** Client-side validation for all forms
- **XSS Prevention:** React's built-in XSS protection
- **CSRF Considerations**: Token-based authentication patterns

## Development Experience

- **Hot Module Replacement:** Instant development feedback
- **TypeScript Integration:** Full IDE support and autocomplete
- **ESLint Configuration:** Consistent code style and error prevention
- **DevTools Integration:** Feature flag panel and debugging tools
- **Component Documentation:** README files and comprehensive examples

## Mock Data & Services

Stats are generated deterministically on first load and cached in `localStorage`. All API interactions use mock services that simulate real-world behavior including loading states, errors, and data persistence. No backend is required.

## Future Improvements

- **Backend Integration:** Real API endpoints and database persistence
- **Advanced Analytics:** More sophisticated chart types and data visualization
- **Team Management:** Multi-user support and permission systems
- **Webhook Management:** Configure and test webhook endpoints
- **Rate Limiting:** Visualize and configure API rate limits
- **Audit Logs:** Comprehensive activity tracking and reporting

## Contributing

This project serves as a demonstration of modern React development practices, including:

- Clean architecture patterns
- Comprehensive testing strategies
- Internationalization implementation
- Modern CSS features and polyfills
- Component-driven development
- Performance optimization techniques

## Environment Variables

No environment variables are required for development. See `.env.example` for available configuration options.

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Modern CSS features are enhanced with polyfills for broader compatibility.
=======
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
>>>>>>> ed5c1c21234bc45c5f84973d4ae88c93976e8c0b
