import { Socket } from 'socket.io';
import { HelpRequest } from '../models';


export function setupHelpRequestWebSockets(socket:Socket) {

  socket.on('createRequest', async (data) => {
    const { content, course, students } = data;
    const createdRequest = await HelpRequest.create({ data: { content, course, students } });
    socket.broadcast.emit('createRequest', createdRequest);
  });

  socket.on('updateRequestStatus', async (data) => {
    const { id, status } = data;
    const updatedRequest = await HelpRequest.update({ where: { id }, data: { status } });
    console.log('updatedRequest :>> ', updatedRequest);
    socket.broadcast.emit('updateRequestStatus', updatedRequest);
  });

  socket.on('assignRequestInstructor', async (data) => {
    console.log('assignRequestInstructor: ', data);
    const { id, instructor } = data;
    const updatedRequest = await HelpRequest.update({ where: { id }, data: { instructor } });
    console.log('updatedRequest :>> ', updatedRequest);
    socket.broadcast.emit('assignRequestInstructor', updatedRequest);
  });

}
