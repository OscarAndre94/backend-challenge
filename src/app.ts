import express from 'express';
import type { Express } from 'express';
import { ContentTypeMiddleware } from './middlewares/content-type.middleware.js';
import { setupSwagger } from './config/swagger.js';
import router from './routes/index.js';
import { ErrorMiddleware } from './middlewares/error.middleware.js';

const app: Express = express();

// Swagger
setupSwagger(app);

// Middlewares
app.use(ContentTypeMiddleware.validate);
app.use(express.json());

//Routes
app.use(router);

// Error handling
app.use(ErrorMiddleware.handle);

// Ruta inicial
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend Challenge API is running'
  });
});

export default app;
