import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import routes from './routes';
import { connectDB } from './config/db';
import { corsConfig } from './config/cors';

connectDB()
const app = express();

//Cors
app.use(cors(corsConfig));

// leer datos form

app.use(express.json());

app.use('/', routes);
//Rounting


export default app;