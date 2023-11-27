import { io } from '..';

export function setupHelpRequestWebSockets() {
  io.on('connection', (socket) => {
    console.log('Connection established with user: ', socket.id);

    socket.on('message', data => {
      console.log(data);
      io.emit(`Message: ${data} from ${socket.id.substring(0, 5)}}`);
    });

    socket.on('status-change', data => {
      console.log(data);
    });

    socket.on('assign-instructor', data => {
      console.log(data);
    })

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });
}
