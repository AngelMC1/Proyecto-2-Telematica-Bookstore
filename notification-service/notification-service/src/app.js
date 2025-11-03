import express from 'express';
import notificationRoutes from './routes/notification.routes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Rutas
app.use('/api/notifications', notificationRoutes);

export default app;
