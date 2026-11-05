# ITC Hub

ITC Hub is a full-stack club platform for discovering events, registering as a member, and chatting with an AI assistant that can use live event data.

## Features

- Public health check and event browsing
- Member registration and login with an HTTP-only cookie
- Admin login through configured environment credentials
- Admin-only event creation panel
- Member-only event registration with duplicate and capacity protection
- Member and admin chat with persisted, per-user history
- Streaming AI responses over Server-Sent Events (SSE)
- Admin-editable assistant instructions
- Automatic event context supplied to the assistant from MongoDB
- Sanitized GitHub-Flavored Markdown assistant responses
- Per-user chat rate limiting
- Light/dark theme with system preference and saved choice
- Swagger UI API documentation in development

## Project structure

```text
backend/     Express, MongoDB, authentication, events, chat, Swagger
frontend/    React, Vite, React Router, TanStack Query, Tailwind CSS
```

## Requirements

- Node.js 20+ recommended
- npm
- MongoDB database
- OpenAI-compatible chat completion provider for AI responses

## Quick start

Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Configure the backend first by copying `backend/.env.example` to `backend/.env` and filling in the values. Then start both applications in separate terminals:

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The frontend proxies `/api` requests to `http://localhost:3000` by default.

## Environment configuration

Backend variables are documented in [backend/.env.example](./backend/.env.example).

Important values:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET` and `JWT_EXPIRES_IN`: authentication token configuration
- `FRONTEND_URL`: allowed frontend origin
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`: fallback admin login
- `AI_API_KEY`, `AI_BASE_URL`, and `AI_MODEL`: OpenAI-compatible AI provider

Frontend variables are documented in [frontend/.env.example](./frontend/.env.example):

- `VITE_API_URL`: deployed backend origin; leave empty in development
- `VITE_PROXY_TARGET`: local backend target for the Vite proxy

## API overview

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | Health check |
| POST | `/api/auth/register` | Public | Create a member account |
| POST | `/api/auth/login` | Public | Log in and set cookie |
| POST | `/api/auth/logout` | Public | Clear cookie |
| GET | `/api/auth/me` | Authenticated | Get current user |
| GET | `/api/events` | Public | List events |
| GET | `/api/events/:id` | Public | Get an event |
| POST | `/api/events` | Admin | Create an event |
| POST | `/api/events/:id/register` | Member | Register for an event |
| POST | `/api/chat` | Member/Admin | Stream an AI response |
| GET | `/api/chat/history` | Member/Admin | Get current user's chat history |
| DELETE | `/api/chat/history` | Member/Admin | Clear current user's history |
| GET | `/api/chat/context` | Admin | Read assistant instructions |
| PUT | `/api/chat/context` | Admin | Update assistant instructions |

When running the backend in development, Swagger UI is available at [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

## Validation

```bash
cd backend
npm run build
npm run lint

cd ../frontend
npm run build
npm run lint
```

See the component-specific documentation:

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
