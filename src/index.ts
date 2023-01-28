import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import { body } from 'express-validator';
import productRouter from './routers/productRouter';

dotenv.config();

const DB_URL = String(process.env.MONGO_URL);
const PORT = Number(process.env.PORT || 8888);

const app = express();
app.use(express.json());
app.use('/api', productRouter);

app.use((req, res, next) => {
  console.log('hello middleware ⛔️😂🇵🇹');
  res.status(200);
  next();
});

const connectToDb = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(DB_URL);
    console.log('Successfully connected to the database.');
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(e.message);
    }
  }
};

/**
 *         Chamamos a função listen e passamos a porta como primeiro parametro
            A função irá mostrar a mensagem caso o servidor inicia com sucesso.
 */
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
  /*
        Na resposta, chamamos a função status, indicamos 200 (success)
        e chamamos a função json onde podemos enviar qualquer dados.
    */
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
