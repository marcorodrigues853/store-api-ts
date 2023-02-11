import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';

import productRouter from './routers/productRouter';
import authRouter from './routers/authRouter';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import userRouter from './routers/userRouter';

dotenv.config();

const DB_URL = String(process.env.MONGO_URL);
const PORT = Number(process.env.PORT || 8888);

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//* MIDDLEWARE's

//* implement cors
app.use(cors());

// Access-Control-Allow-Origin *
// app.use(cors({
//   origin: 'https:urlorigin'
// }))
app.options('*', cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

// app.use(
//   (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     console.log('Run every time do you call API -  middleware  ON ⛔️ 😂 🇵🇹');
//     next();
//   },
// );

app.use('/auth', authRouter);
app.use('/api', productRouter);
app.use('/api', userRouter);

const connectToDb = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(DB_URL);
    console.log('Successfully connected to the database. 💩🦟');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};

const startApp = async () => {
  try {
    connectToDb();
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(e.message);
    }
  }
};

startApp();
