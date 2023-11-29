import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';

import {
  setupStudentHelpSockets,
  setupInstructorHelpSockets
} from './helpRequests';


// type TUserSpace = {
//   organisationId: string
//   role: 'admin' | 'instructor' | 'student'
// }

export default function setupWebSockets() {
  console.log('Instantiating socket setup ');
  
  const io = new Server(5001, {
    //TODO: check config for deployment and align with Express server
    cors: {
      origin: process.env.NODE_ENV === 'production' ? false : '*'
    }
  });
  // const orgNamespace = io.of(/\/^[0-9a-fA-F]{24}$/); // regex for Mongo's ObjectId patter
  // console.log(orgNamespace.name)

  io.on('connection', (socket) => {
    console.log('Connection established with user: ', socket.id);

    socket.on('join', role => {
      console.log('role :>> ', role)

      if (role === 'student') {
        console.log('Joining student room');
        socket.join('students');
        setupStudentHelpSockets(socket);
      } else {
        console.log('Joining instructor room');
        socket.join('instructors');
        setupInstructorHelpSockets(socket);
      }
    })  

    socket.on('disconnect', () => {
      socket.disconnect();
      console.log(`User ${socket.id} disconnected`);
    });


  });


  instrument(io, {
    auth: false,
    mode: "development",
  });
}



