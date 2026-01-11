import "./processors/mailProcessor.js"; // keep your processor here

import express from 'express';
import { createServer } from 'http';
import { StatusCodes } from 'http-status-codes';
import {Server} from 'socket.io'

import { serverAdapter } from "./config/bullBoard.js";
import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';
import messageHandlers from "./controllers/messageSocketController.js";
import apiRoutes from './routes/apiRoutes.js';
const app = express();
const server = createServer(app);
const io = new Server(server);
/* -------------------- MIDDLEWARES -------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// bull-board route AFTER app exists
app.use("/ui", serverAdapter.getRouter());


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

io.on('connection', (socket) => {
  // console.log('a user connected',socket.id);

  // // setTimeout(()=>{
  // //    socket.emit('message','This is a message from the server')
  // // },3000)

  // socket.on('messagefromclient',(data)=>{   //here client sends message to server
  //   console.log("Message from client",data);

  //   io.emit('new message',data.toUpperCase())  // here server broadcast/emmits/send the data client send to all the users at same time
  // })
  messageHandlers(io,socket)
  
});

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
      console.log(` Bull Board: http://localhost:${PORT}/ui`);
    });
  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
