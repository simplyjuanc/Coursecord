import { AuthSocket } from "./AuthSocket";
import { Server, Socket } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import Role from "../models/role";
import {
  setupStudentHelpSockets,
  setupInstructorHelpSockets,
} from "./helpRequests";
import organisation from "../models/organisation";
import user from "../models/user";
import HelpRequestModel from "../models/helpRequest";
import { SocketWithUser } from "../../@types/types";


export default async function setupWebSockets(io: Server) {
  console.log("Instantiating socket setup ");
  io.use(AuthSocket);
  io.on("connection", (socket: Socket) => {
    console.log("Connection established with user: ", socket.id);

    socket.on("join", async (courseId: string, callback: Function) => {
      try {
        
      } catch (error) {
        console.log(error)
      }
      if (!callback) return;
      const userId = (socket as SocketWithUser).user.id;
      const org = await organisation.getOrganisationWithCourse(courseId);
      
      // const isInstructor = await Role.userHasRole(userId, )
      
      // const roles = await Role.getRolesByUser((socket as SocketWithUser).user.id);
      // const isInstructor = await Role.userHasRole(
      //   roles.map((role) => role.id!),
      //   "instructor",
      //   org?.id ?? ""
      // );
      // if (isInstructor) {
      //   let requests = await HelpRequestModel.getHelpRequests(courseId);
      //   callback(requests);
      // }

      callback([]);
    });

    socket.on("createRequest", async (data: any, callback: Function) => {
      const { content, course, students } = data;
      console.log("STUDENTS", students);
      await HelpRequest.create({
        data: { content, course, students },
      });
      let requests = await getUpdatedRequests(course);
      io.emit("requestsUpdated", requests);
      callback();
    });

    socket.on("updateStatus", async (data: any) => {
      const { course, request, destination } = data;
      const org = await organisation.getOrganisationWithCourse(course);
      const roles = await Role.getRolesByUser((socket as any).user.id);
      let isInstructor = await Role.userHasRole(
        roles.map((role) => role.id!),
        "instructor",
        org?.id ?? ""
      );
      if (!isInstructor) return;
      await HelpRequest.update({
        where: { id: request },
        data: {
          status: destination,
          instructor: destination === "WAITING" ? "" : (socket as any).user.id,
          finished_at: destination === "FINISHED" ? new Date() : null,
        },
      });
      let requests = await getUpdatedRequests(course);
      io.emit("requestsUpdated", requests);
    });

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

