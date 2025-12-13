import express from 'express';
import { StatusCodes } from 'http-status-codes';

import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';
import apiRoutes from './routes/apiRoutes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRoutes);

app.get('/ping', (req, res) => {
  return res.status(StatusCodes.OK).json({ output: 'Pong' });
});

// ✅ Global Error Handling Middleware (must be last)
app.use((err, req, res ) => {
  console.error("Global error handler:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    data: {},
    message: err.message || "Internal Server Error",
    err: err.explanation || {}
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectDB();
});
