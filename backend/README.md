# ITC Hub backend

The backend is an Express 5 API written in TypeScript. It uses MongoDB through Mongoose, cookie-based JWT authentication, Zod validation, Swagger documentation, and an OpenAI-compatible streaming chat provider.

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

The API runs at [http://localhost:3000](http://localhost:3000).

Swagger UI is available in development at [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

## Environment variables

Copy `.env.example` to `.env` and set real values:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

MONGODB_URI=mongodb://localhost:27017/itc-hub

JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1h

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-secure-password

AI_API_KEY=
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
```

Configuration is validated during startup with `validEnv`. Missing or invalid required values prevent the server from starting.

The configured admin account is a fallback account: login checks MongoDB first, then accepts `ADMIN_EMAIL` and `ADMIN_PASSWORD` when no database user exists with that email.

## Scripts

```bash
npm run dev      # Start with tsx watch
npm run build    # Compile TypeScript to dist/
npm run start    # Run the compiled server
npm run lint     # Run Oxlint
```

## API endpoints

### Health

- `GET /api/health` — public liveness check; does not access MongoDB.

### Authentication

- `POST /api/auth/register` — validates input, hashes the password, and sets an HTTP-only cookie.
- `POST /api/auth/login` — authenticates a database user or configured admin fallback.
- `POST /api/auth/logout` — clears the authentication cookie.
- `GET /api/auth/me` — returns the current authenticated user.

Authentication uses an HTTP-only `token` cookie. The frontend must send requests with credentials enabled.

### Events

- `GET /api/events` — public event list.
- `GET /api/events/:id` — public event details.
- `POST /api/events` — admin-only event creation.
- `POST /api/events/:id/register` — member-only registration.

Registration is atomic and rejects duplicate registrations, full events, closed registrations, and invalid event IDs. Registered user IDs are not exposed through public event responses.

### Chat

- `POST /api/chat` — member/admin-only SSE response stream.
- `GET /api/chat/history` — current member/admin's private history.
- `DELETE /api/chat/history` — clears only the current user's history.
- `GET /api/chat/context` — admin-only assistant instruction read.
- `PUT /api/chat/context` — admin-only assistant instruction update.

Chat history is stored by authenticated user ID. Chat responses include:

1. Admin-managed assistant instructions
2. Current upcoming and ongoing events from MongoDB
3. The user's stored conversation

The chat endpoint is rate limited to 10 requests per authenticated user per minute. SSE responses are marked `no-cache`.

## Architecture

```text
src/
├─ app.ts                 Express middleware, routes, Swagger, errors
├─ server.ts              Database connection and HTTP startup
├─ config/                Environment, database, logger, Swagger
├─ middleware/            Authentication, roles, logging, rate limiting
├─ modules/
│  ├─ auth/               Auth routes, controllers, service, validation
│  ├─ events/             Event model, routes, controllers, service
│  ├─ chat/               Chat model, context, routes, controllers, service
│  └─ users/              User model
├─ types/                 Express request type extensions
└─ utils/                 JWT helpers
```

## Authorization

- `authenticate` reads and verifies the HTTP-only JWT cookie.
- `requireRole('member')` or `requireRole('admin')` restricts individual routes.
- `requireAnyRole('member', 'admin')` allows authenticated chat access.
- Frontend role checks improve UX, but backend middleware remains the source of truth.

## API response conventions

Successful JSON responses generally use:

```json
{
  "success": true,
  "data": {}
}
```

Errors use:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Readable error message"
  }
}
```

## Validation and deployment

Run checks before deployment:

```bash
npm run build
npm run lint
```

Set `NODE_ENV=production`, use a strong `JWT_SECRET`, configure a production MongoDB URI, restrict `FRONTEND_URL` to the real frontend origin, and provide an AI provider key for chat responses.
