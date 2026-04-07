# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (Vite HMR)
npm run build     # Type-check + production build (tsc -b && vite build)
npm run lint      # Run ESLint across the project
npm run preview   # Preview production build locally
```

No test runner is configured.

## Architecture

Feature-based vertical slice structure under `src/features/`. Each feature follows:

```
src/features/<feature>/
  components/   # React UI components
  hooks/        # Custom hooks (often re-exports from src/context/)
  pages/        # Page-level components wired to routes
  services/     # API calls and business logic
```

**Active features**: `auth` (login page done). Scaffolded but empty: `user`, `contact`, `project`, `stack`, `language`.

### Key files

| File | Purpose |
|---|---|
| `src/lib/api.ts` | Axios instance with base URL + Bearer token interceptor |
| `src/context/AuthContext.tsx` | Auth state (token, user), `login(token)`, `logout()`. Token persisted in `localStorage`. JWT decoded client-side to extract `id`, `email`, `rol`. |
| `src/App.tsx` | BrowserRouter + AuthProvider + Routes. `ProtectedRoute` redirects unauthenticated users to `/login`. |

### Routing (React Router v7)

- `/` → redirect based on auth state
- `/login` → `LoginPage`
- `/dashboard` → protected, placeholder for now

### API

Backend: `VITE_API_BASE_URL` (see `.env`). All calls go through `src/lib/api.ts`.

- **Auth login** — `POST /auth/login` with `application/x-www-form-urlencoded` (`username`, `password`). Returns `{ access_token, token_type }`.
- All other endpoints use `Authorization: Bearer <token>` (injected automatically by the axios interceptor).
- File uploads use `multipart/form-data`.

## Key Technical Details

- **Tailwind CSS v4** — configured via `@tailwindcss/vite` plugin (no `tailwind.config.js`). Import in CSS is `@import "tailwindcss"`. Design uses `zinc-*` scale for backgrounds, `violet/purple` gradient as accent.
- **React 19** with the React Compiler enabled via Babel — avoid manual `useMemo`/`useCallback`.
- **TypeScript strict mode** — `noUnusedLocals` and `noUnusedParameters` enforced.
- **ESLint flat config** — `eslint.config.js` with `typescript-eslint` recommended + react-hooks rules.
