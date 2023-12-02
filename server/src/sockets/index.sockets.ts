import { AuthSocket } from "./AuthSocket";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import {
  setupStudentSockets,
  setupInstructorSockets,
} from "./helpRequests";

import { SocketWithUser } from "../../@types/types";


export default async function setupWebSockets(io: Server) {
  console.log("Instantiating socket setup ");
  io.use(AuthSocket);

  io.on("connection", (socket: SocketWithUser) => {
    console.log("Connection established with user: ", socket.id);
    
    // TODO  - update auth to include instructor only if part of org

    const isInstructor = socket.roles!.some((role) => role.title === "instructor");

    if (isInstructor) setupInstructorSockets(socket);
    else setupStudentSockets(socket);

    socket.on("disconnect", () => {
      socket.disconnect();
      console.log(`User ${socket.id} disconnected`);
    });
  });

  instrument(io, {
    auth: false,
    mode: "development",
  });
}


