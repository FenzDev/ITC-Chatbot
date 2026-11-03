import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { httpLogger } from './middleware/logger.middleware.js';

import authRoutes from './modules/auth/auth.routes.js';
import eventRoutes from './modules/events/event.routes.js';
import { FRONTEND_URL } from './config/env.js';

const app = express();

// ==========================================
// 1. Security middleware
// ==========================================

app.use(helmet());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

// ==========================================
// 2. Request parsing
// ==========================================

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ==========================================
// 3. Logging
// ==========================================

app.use(httpLogger);

// ==========================================
// 4. Health check
// ==========================================

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'ITC Hub API is running',
  });
});

// ==========================================
// 5. API routes
// ==========================================

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// ==========================================
// 6. Not found handler
// ==========================================

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: 'Route not found',
    },
  });
});

// ==========================================
// 7. Global error handler
// ==========================================

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
      },
    });
  },
);

export default app;
