import express from 'express';
import { StatusCodes } from 'http-status-codes';

import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';
import apiRoutes from './routes/apiRoutes.js'



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api',apiRoutes)

app.get('/ping', (req, res) => {
  return res.status(StatusCodes.OK).json({ output: 'Pong' });
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    connectDB()
});
