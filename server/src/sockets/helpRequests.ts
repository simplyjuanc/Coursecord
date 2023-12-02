import { Socket } from "socket.io";
import HelpRequestModel from "../models/helpRequest";
import { THelpRequest } from "../../@types/types";


export function setupStudentHelpSockets(socket: Socket) {
  socket.on("createRequest", async (data: THelpRequest, callback: Function) => {
    const { content, course_id, students } = data;
    const createdRequest = await HelpRequestModel.createHelpRequest(content, course_id, students)
    socket.to("instructors").emit("createRequest", createdRequest);
    callback(createdRequest);
  });
}

export function setupInstructorHelpSockets(socket: Socket) {
  socket.on("getRequests", async (data, callback: Function) => {
    const { courseId } = data;
    const requests = await HelpRequestModel.getHelpRequests(courseId);
    callback(requests);
  });


  type UpdateRequestStatusData = {
    id: string;
    status: THelpRequest["status"];
  }

  socket.on("updateRequestStatus", async (data: UpdateRequestStatusData) => {
    const { id, status } = data;
    const updatedRequest = await HelpRequestModel.updateRequestStatus(id, status);
    console.log("updatedRequest :>> ", updatedRequest);
    socket.to("instructors").emit("updateRequestStatus", updatedRequest);
  });

  socket.on("assignRequestInstructor", async (data) => {
    console.log("assignRequestInstructor: ", data);
    const { id, instructor_id } = data;
    const updatedRequest = await HelpRequestModel.updateRequestInstructor(id, instructor_id);
    console.log("updatedRequest :>> ", updatedRequest);
    socket.to("instructors").emit("assignRequestInstructor", updatedRequest);
  });
}
