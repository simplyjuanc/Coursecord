import { Server } from 'socket.io';
import { setupHelpRequestWebSockets } from './helpRequests';


export default function setupWebSockets() {
  const io = new Server(5001, {
    cors: {
      //TODO: check config for deployment and align with Express server
      origin: process.env.NODE_ENV === 'production' ? false : '*'
    }
  });


  io.on('connection', (socket) => {
    console.log('Connection established with user: ', socket.id);
    
    setupHelpRequestWebSockets(socket);

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} disconnected`);
    });
  
    socket.onAny((event, ...args) => {
      console.log('event, args :>> ', event, args);
    });
  });

}


