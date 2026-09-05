import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes.js';
import productRouter from './routes/productRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import userRouter from './routes/userRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(generalLimiter);

app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter);
app.use('/api/user', userRouter);

app.use(errorHandler);

export default app;
