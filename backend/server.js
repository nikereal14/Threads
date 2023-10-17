import dotenv from 'dotenv';
import express from 'express';
import connectDB from './db/connectDB.js';

dotenv.config();

connectDB();
const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
	console.log(`Server started at http://localhost:${PORT}`)
);
