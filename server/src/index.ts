import express from 'express';
import router from './router';
import cors from 'cors';
// import {createServer} from 'http';
import { Server } from 'socket.io';
import { setupHelpRequestWebSockets } from './sockets/index.sockets';

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);


// const httpServer = createServer(app);
export const io = new Server(5001, {
  cors: {
    //TODO: check config for deployment and align with Express server
    origin: process.env.NODE_ENV === 'production' ? false : '*' 
  }
});


setupHelpRequestWebSockets();


const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`Sever listening on http://${HOST}:${PORT}`);
});


