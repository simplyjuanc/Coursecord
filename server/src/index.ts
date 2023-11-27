import express, { Request } from 'express';
import cors from 'cors';
// import {createServer} from 'http';
import setupWebSockets from './sockets/index.sockets';
import router from './router';

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);


setupWebSockets();


const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});


