
import express from 'express';
import type { Express } from 'express';

const app: Express = express();

// Middlewares
app.use(express.json());

// Ruta inicial
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend Challenge API is running'
  });
});

export default app;
