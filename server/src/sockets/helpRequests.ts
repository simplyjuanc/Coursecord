import { SocketWithUser, TCreateHelpRequest } from "../../@types/types";
import HelpRequestModel from "../models/helpRequest";
import UserModel from "../models/user";
import { UpdateRequestStatusData } from "../../@types/types";
import { getLastResult } from "../helpers/getLastResult";



export function setStudentSockets(socket: SocketWithUser) {  
  socket.on("createRequest", async (data: TCreateHelpRequest, callback: Function) => {
    console.log("STUDENTS:    ", data.students);
    const createdRequest = await HelpRequestModel.createHelpRequest(data);
    if (!createdRequest) return;
    const requests = await HelpRequestModel.getHelpRequests(data.course_id);
    socket.to('instructors').emit("requestsUpdated", requests);
    callback();
  });
}


export function setInstructorSockets(socket: SocketWithUser) {
  socket.join('instructors');

  socket.on("getRequests", async (data:Record<'courseId',string>, callback: Function) => {
    const { courseId } = data;
    const requests = await HelpRequestModel.getHelpRequests(courseId);
    callback(requests);
  });

  socket.on("updateStatus", async (data: UpdateRequestStatusData) => {
    const { id, course_id, status } = data;
    
    const isInstructor = await UserModel.isCourseInstructor(socket.user!.id, course_id);
    if (!isInstructor) return;
    
    const updatedInstructor = HelpRequestModel.updateRequestInstructor(id, socket.user!.id);
    const updatedStatus = HelpRequestModel.updateRequestStatus(id, status);
    
    const latestRequest = await getLastResult([updatedInstructor, updatedStatus]);
    if (!latestRequest) return;

    const requests = await HelpRequestModel.getHelpRequests(course_id);
    socket.to('instructors').emit("requestsUpdated", requests);
  });
}
