import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
// import { rateLimit } from 'express-rate-limit';

import productRouter from './routers/productRouter';
import authRouter from './routers/authRouter';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import userRouter from './routers/userRouter';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import reviewRouter from './routers/reviewRouter';
// import xss from 'xss-clean';
// import helmet from 'helmet';

dotenv.config();

const DB_URL = String(process.env.MONGO_URL);
const PORT = Number(process.env.PORT || 8888);

const app = express();

// Set Security HTTP headers
// app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limit requests to 1000 by hour
// const limiter = rateLimit({
//   max: 1000,
//   windowMs: 60 * 60 * 10000,
//   message: 'Too many request from this IP, try again in a hour',
// });

// app.use('/api', limiter); // apply limiter only to routes o start with /api

//* MIDDLEWARE's

//* implement cors
app.use(cors());

// Access-Control-Allow-Origin *
// app.use(cors({
//   origin: 'https:urlorigin'
// }))
app.options('*', cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '20kb' })); //* limit the size of request

// Data sanitization against NOSQL query injection

app.use(ExpressMongoSanitize());
// Data sanitization against NOSQL query injection
// app.use(xss());

//* Prevent parameter pollution with filter
app.use(
  hpp({
    whitelist: ['name', 'price', 'createdAt'],
  }),
);

app.use(cookieParser());
app.use(fileUpload());

app.use('/auth', authRouter);
app.use('/api', productRouter);
app.use('/api', userRouter);
app.use('/api/reviews', reviewRouter);

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
