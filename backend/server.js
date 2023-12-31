import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './db/connectDB.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

connectDB();
const app = express();

const PORT = process.env.PORT || 5000;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.listen(PORT, () =>
	console.log(`Сервер запущен на http://localhost:${PORT}`)
);
