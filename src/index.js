import express from 'express';
import { StatusCodes } from 'http-status-codes';

import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';
import apiRoutes from './routes/apiRoutes.js';

const app = express();

/* -------------------- MIDDLEWARES -------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------- ROUTES -------------------- */
app.use('/api', apiRoutes);

app.get('/ping', (req, res) => {
  return res.status(StatusCodes.OK).json({ output: 'Pong' });
});

/* -------------------- GLOBAL ERROR HANDLER -------------------- */
/* MUST have 4 params for Express to recognize it */
app.use((err,req, res,_next) => {
  console.error('Global error handler:', err);

  return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    data: {},
    message: err.message || 'Internal Server Error',
    err: err.explanation || {}
  });
});

/* -------------------- SERVER START -------------------- */
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
