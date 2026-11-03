import app from './app.js';
import { connectDatabase } from './config/db.js';
import { PORT } from './config/env.js';
import { logger } from './config/logger.js';

async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    const server = app.listen(PORT, () => {
      logger.info(`ITC Hub API running on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Closing server...');

      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received. Closing server...');

      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
}

startServer();
