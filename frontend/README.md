# ITC Hub: Frontend (base)

No content, no mock data: only the wiring.

**Stack:** TypeScript · React 19 · Vite · React Router · TanStack Query · Tailwind CSS v4 · oxlint

## Quick start
```bash
npm install
npm run dev        # http://localhost:5173
```
Scripts: `dev`, `build` (tsc + vite), `preview`, `typecheck`, `lint`, `lint:fix`.
Until a backend/mock API runs on `VITE_PROXY_TARGET` (default :3000), `/events` shows its error state. That is expected.

## Structure
```
src/
├─ main.tsx              entry
├─ index.css             Tailwind import + @theme tokens
├─ app/
│  ├─ providers.tsx      QueryClientProvider + RouterProvider
│  └─ router.tsx         ALL routes live here
├─ pages/                one component per route
├─ features/<domain>/    types.ts · api.ts (fetch calls) · hooks.ts (TanStack Query)
├─ components/
│  ├─ layout/RootLayout  navbar + <Outlet />
│  └─ ui/                shared buttons, cards...
└─ lib/                  env.ts · api-client.ts (only place that calls fetch) · query-client.ts
```
Rule: page in `pages/`, its data code in `features/`, reusable UI in `components/`.

## Adding a page
1. Create `src/pages/AboutPage.tsx`.
2. Add `{ path: "about", element: <AboutPage /> }` to `src/app/router.tsx`.
3. Add a link in `RootLayout.tsx`.

## Adding an API call
1. Type in `features/x/types.ts`, function in `api.ts` using `api<T>("/path")`.
2. Wrap in `useQuery` (reads) or `useMutation` (writes, then `invalidateQueries`) in `hooks.ts`.
3. Use the hook in a page. Query results are cached (`staleTime` in `lib/query-client.ts`), which is your frontend caching layer.

## CORS
CORS is enforced by the browser and configured on the backend.
- **Dev:** the app calls `/api/...` on :5173 and Vite proxies it to `VITE_PROXY_TARGET`. Same origin, so no CORS. Backend routes must start with `/api` (otherwise add a `rewrite` in `vite.config.ts`).
- **Prod:** set `VITE_API_URL=https://api.yourdomain.com` and enable CORS on the backend, e.g. Express:
```ts
import cors from "cors";
app.use(cors({ origin: ["https://your-frontend.com", "http://localhost:5173"] }));
```
If you use cookies: `credentials: "include"` in `lib/api-client.ts` plus `credentials: true` and an explicit origin on the backend.

## Deploying (Module 4)
`npm run build` outputs static files to `dist/`. Host on S3 + CloudFront; add a fallback of 403/404 to `/index.html` so React Router deep links work.

## Backend contract assumed
`POST /api/auth/register` with `{name,email,password}` returning `{token}` · `GET /api/events` · `GET /api/events/:id` · `POST /api/events/:id/register` · `POST /api/chat` with `{messages}` returning `{reply}`. Change it in `features/*/api.ts`.
