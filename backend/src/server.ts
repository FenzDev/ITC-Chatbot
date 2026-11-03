import express from 'express';
import cors from 'cors';
import { PORT } from './config/env.js';
import { httpLogger } from './middleware/logger.middleware.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use(httpLogger);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
