# ITC Hub frontend

The frontend is a React 19 single-page application built with Vite, TypeScript, React Router, TanStack Query, and Tailwind CSS v4.

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

The development server runs at [http://localhost:5173](http://localhost:5173). Vite proxies `/api` requests to `http://localhost:3000` by default.

### Environment variables

```env
VITE_API_URL=
VITE_PROXY_TARGET=http://localhost:3000
```

- Keep `VITE_API_URL` empty during local development.
- Set `VITE_API_URL` to the deployed API origin in production.
- The backend must allow the frontend origin and credentials in production.

## Available scripts

```bash
npm run dev        # Start Vite development server
npm run build      # Type-check and create production build
npm run preview    # Preview the production build
npm run typecheck  # Run TypeScript checks
npm run lint       # Run Oxlint
npm run lint:fix   # Apply Oxlint fixes
```

## Frontend features

- Public event list and event registration flow
- Login and member registration
- Admin event creation and assistant context editor
- Assistant chat with per-user history
- Public assistant landing state with registration prompt
- SSE streaming chat responses
- GitHub-Flavored Markdown rendering for assistant messages
- Sanitized Markdown output
- TanStack Query caching for events, authentication, chat history, and assistant context
- Cookie-based authentication using `credentials: "include"`
- Persistent light/dark theme preference with system fallback

## Routes

| Route | Purpose |
|---|---|
| `/` | Home page and events |
| `/login` | Login |
| `/register` | Member registration |
| `/chat` | Assistant |
| `/admin/events` | Admin event and assistant configuration |

The admin route also checks the authenticated user's role in the UI. The backend independently enforces admin authorization.

## Structure

```text
src/
├─ app/                 Providers and router
├─ components/          Layout and reusable UI
├─ features/
│  ├─ auth/             Auth API, hooks, and types
│  ├─ chat/             Chat API, SSE parser, history, and context hooks
│  └─ events/           Events API, registration, cache, and components
├─ lib/                 API client, environment, and query client
├─ pages/               Route-level pages
├─ index.css            Theme tokens and shared component styles
└─ main.tsx             Application entry point and theme initialization
```

Use the existing conventions when adding functionality:

1. Define domain types in `features/<domain>/types.ts`.
2. Put HTTP calls in `features/<domain>/api.ts`.
3. Wrap reads and writes in `features/<domain>/hooks.ts`.
4. Put route-level UI in `pages/`.
5. Put reusable UI in `components/`.

## Backend integration

The shared API client:

- Prefixes requests with `/api`
- Sends cookies with `credentials: "include"`
- Handles the backend `{ success, data }` response envelope
- Converts API failures to `ApiError`

Chat responses are different from normal JSON endpoints: `POST /api/chat` returns `text/event-stream`, which is parsed in `features/chat/api.ts`.
