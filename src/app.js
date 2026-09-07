import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';

import authRouter from './routes/authRoutes.js';
import productRouter from './routes/productRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import userRouter from './routes/userRoutes.js';
import healthRouter from './routes/healthRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

import errorHandler from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { mongoSanitizer } from './middleware/mongoSanitizer.js';
import requestLogger from './middleware/requestLogger.js';

const app = express();

app.use(helmet());
app.use(mongoSanitizer);
app.use(express.json());
app.use(cookieParser());
app.use(compression());

app.use(requestLogger)
app.use('/api/v1', healthRouter);
app.use(generalLimiter);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/categories', categoryRoutes);


app.use(errorHandler);

export default app;
