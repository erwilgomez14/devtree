import express from 'express';
import 'dotenv/config';
import routes from './routes';
import { connectDB } from './config/db';

const app = express();

connectDB()
// leer datos form

app.use(express.json());

app.use('/', routes);
//Rounting


export default app;