import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

dotenv.config();


const PORT = Number(process.env.PORT || 8888);
const DB_URL = String(process.env.MONGO_URI);


const app = express();
app.use(express.json());
// app.use('/api');

const connectToDb = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(DB_URL);
    console.log("Successfully connected to the database.");
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

startApp()


app.get("/", (req: express.Request, res: express.Response) => {
  /*
        Na resposta, chamamos a função status, indicamos 200 (success)
        e chamamos a função json onde podemos enviar qualquer dados.
    */
  res.status(200).json("Servidor funciona!");
});
