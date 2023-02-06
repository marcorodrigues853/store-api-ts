import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';

import { body } from 'express-validator';
import productRouter from './routers/productRouter';
import authRouter from './routers/authRouter';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

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

app.use('/api', productRouter);
app.use('/auth', authRouter);

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

app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).json('Server Api Store!');
});

interface IUser {
  email: string;
  id?: number;
  name?: string;
  password?: string;
}
const users: IUser[] = [
  { id: 1, name: 'Utilizador1', email: 'marco@2.com', password: 'w' },
  { id: 2, name: 'Utilizador2', email: 'marco@aswdsa.com', password: '#"$dsf' },
  { id: 3, name: 'Utilizador3', email: 'marco@aswdsa.com', password: '#"$dsf' },
];

app.get('/users/:id', (req: express.Request, res: express.Response) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) res.status(404).send('Utilizador não encontrado.');
  res.json(user);
});

app.post('/users', (req: express.Request, res: express.Response) => {
  const user = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email,
  };
  users.push(user);
  res.json(user);
});

app.put('/users/:id', (req: express.Request, res: express.Response) => {
  const user = users.find((u) => u.id === parseInt(req.params.id)) as IUser;
  if (!user) res.status(404).send('Utilizador não encontrado.');
  user.name = req.body.name;
  res.json(user);
});

app.delete('/users/:id', (req: express.Request, res: express.Response) => {
  const user = users.find((u) => u.id === parseInt(req.params.id)) as IUser;
  if (!user) res.status(404).send('Utilizador não encontrado.');
  const index = users.indexOf(user);
  users.splice(index, 1);
  res.json(user);
});

app.post('/login', (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;
  const hasEmail = users.find((u) => u.email === email);

  if (!hasEmail) res.status(200).json('email no found');
  console.log(hasEmail);

  const isCorrect = users.filter(
    (user) => user.password === password && user.email === email,
  );

  console.log('iscorrect', isCorrect);
  if (isCorrect.length === 0) res.status(409).json('deixa de ser nabo');

  res.status(200).json('Logged In');
});

app.post(
  '/register',
  body('username').isEmail(),
  body('password').isLength({ min: 8 }),
  (req: express.Request, res: express.Response) => {
    const [email, password, name] = req.body;

    const newUser: IUser = {
      id: ++users.length,
      email,
      password,
      name,
    };

    const hasEmail = users.find((u) => u.email === email);
    if (!hasEmail) res.status(404).send('Utilizador não registado.');

    users.push(newUser);
    res.status(200).json(newUser);
  },
);
