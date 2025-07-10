import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import { connectDB } from './utils/db';
import authRoutes from './routes/auth';
import productRoutes from './routes/product';
import orderRoutes from './routes/order';
import userRoutes from './routes/user';
import adminRoutes from './routes/admin';
import { connectDB } from './utils/db';
// import connectDB from './utils/db';
// import { connectDB } from './utils/db';
// import { connectDB } from './utils/db';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Placeholder for MongoDB connection
// TODO: Connect to MongoDB using mongoose and process.env.MONGOURI

app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

const startServer = async () => {
   
  await connectDB();
  console.log("PORT", PORT)
  console.log("herrrr")
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer(); 