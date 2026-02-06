# Copilot Instructions (MWM Portal)

- App is React 19 + TypeScript + Vite. Entry: [src/main.tsx](src/main.tsx); app layout and routing in [src/App.tsx](src/App.tsx).
- Auth gating is handled in [src/App.tsx](src/App.tsx): unauthenticated users only see `/login`, `/forgot-password`, `/new-password`; authenticated users get Header/Sidebar + main routes.
- Auth state lives in [src/context/AuthContext.tsx](src/context/AuthContext.tsx): user is stored in localStorage under `@MWM:user`; `logout()` clears it. Use `useAuth()` inside `AuthProvider`.
- Theme is a context with a no-op toggle: [src/context/ThemeContext.tsx](src/context/ThemeContext.tsx). Don’t assume theme toggling works—UI is currently fixed to light.
- Global state uses Redux Toolkit. Store is configured in [src/app/store.ts](src/app/store.ts) and slices live under [src/features](src/features). Prefer adding new global UI/data state via slices rather than component-local state if it’s shared across screens.
- Data access is centralized in [src/services/api.ts](src/services/api.ts). It switches between mock and real APIs via `VITE_USE_MOCK_API` and uses `VITE_API_BASE_URL` for real endpoints.
- Mock API implementations live in [src/services/mock](src/services/mock). When adding or changing a service function, update both the real axios call and the mock implementation/types.
- Axios instances add `Authorization: Bearer <token>` from localStorage `token` (see [src/services/api.ts](src/services/api.ts) and [src/services/produtorService.ts](src/services/produtorService.ts)). Keep this behavior consistent for new services.
- Auth API wrappers are in [src/services/auth.ts](src/services/auth.ts) and defer to mock auth when `VITE_USE_MOCK_API` is not `false`.
- Types for API/models are centralized under [src/types](src/types); mock data in [src/services/mock/api.mock.ts](src/services/mock/api.mock.ts) re-exports these types.
- UI uses MUI components (e.g., layout in [src/App.tsx](src/App.tsx)) alongside Bulma. Avoid mixing new CSS frameworks.
- Tests: unit/integration via Vitest (`npm test`, `npm run test:ui`); Playwright component tests (`npm run test:ct`) and E2E tests (`npm run test:e2e`, `npm run test:e2e:ui`).
- Environment config lives in `.env` (see README). Default mock mode (`VITE_USE_MOCK_API=true`) enables frontend-only development.
