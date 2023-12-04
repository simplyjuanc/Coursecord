import { AuthSocket } from "./AuthSocket";
import { Server } from "socket.io";
import { SocketWithUser } from "../@types/types";
import {
  setStudentSockets,
  setInstructorSockets,
} from "./helpRequests";


export default async function setupWebSockets(io: Server) {
  console.log("Instantiating socket setup ");
  io.use(AuthSocket);

  io.on("connection", (socket: SocketWithUser) => {
    console.log("Connection established with user: ", socket.id);
    
    if (socket.isCourseInstructor) setInstructorSockets(socket);
    else setStudentSockets(socket);

    socket.on("disconnect", () => {
      socket.disconnect();
      console.log(`User ${socket.id} disconnected`);
    });
  });
}


