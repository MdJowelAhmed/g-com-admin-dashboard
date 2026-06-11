# G-COM Admin Dashboard (Frontend)

Admin dashboard built with React + TypeScript + Vite.

> Important: this repository is currently **frontend-only** and uses **dummy/mock data**.  
> Backend API integration will be added later.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Ant Design
- React Router

## Run Locally

```bash
npm install
npm run dev
```

## Available Scripts

- `npm run dev` - start dev server
- `npm run build` - type-check and build
- `npm run lint` - run ESLint
- `npm run test` - run unit tests once (Vitest)
- `npm run test:watch` - run tests in watch mode

## Current Architecture

- `src/pages` - route-level pages
- `src/components` - reusable UI and page widgets
- `src/layouts` - app shell/layout wrappers
- `src/context` - global providers (example: auth state)
- `src/hooks` - reusable hooks (example: filtered list logic)
- `src/data` - dummy/mock data source (single canonical source)
- `src/utils` - shared utility helpers

## Data and API Policy (Until Backend Is Ready)

- Use `src/data/*` as the single source for all mock data imports.
- Keep page components focused on UI + interaction logic.
- Avoid mixing raw data definitions inside page components.
- New features should be written so data access can move to `services` later with minimal refactor.

## Testing Scope (Current Stage)

Since backend is not ready yet, tests should focus on frontend behavior:

- reusable hooks
- component rendering and interactions
- local filtering/search/state logic

## Next Planned Step (When Backend Is Ready)

1. Add `src/services/api` for real API calls.
2. Replace `src/data/*` usages with service responses.
3. Keep UI components unchanged as much as possible.
