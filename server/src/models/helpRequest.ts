import { HelpRequest } from ".";
import { THelpRequest, TCreateHelpRequest } from "../../@types/types";


async function createHelpRequest(data: TCreateHelpRequest) {
  try {
    console.log('model - createHelpRequest - data :>> ', data);
    const createdRequest = await HelpRequest.create({
      data: {
        content: data.content,
        course_id : data.course_id,
        students: {
          // connect: data.students.map((student) => ({ id: student }))
          connect: { id: data.students[0] }
        }
      },
    });
    
    console.log('socket - createHelpRequest - createdRequest :>> ', createdRequest);
    return createdRequest;

  } catch (error) {
    console.error(error);
  }
}


async function getHelpRequests(courseId: THelpRequest['course_id']) {
  console.log('model - getHelpRequests - courseId :>> ', courseId);
  const requests = await HelpRequest.findMany({
    where: { course_id: courseId },
    include: {
      students: true,
      instructor: true
    }
  });
  console.log('model - getHelpRequests - requests :>> ', requests);
  return requests;
}


async function updateRequestStatus(id: string, status: THelpRequest['status']) {
  try {
    const request = await HelpRequest.update({
      where: { id },
      data: { status }
    });
    return request;
  } catch (error) {
    console.error(error);
  }
}


async function updateRequestInstructor(id: string, instructor_id: THelpRequest['instructor_id']) {
  try {
    if (!instructor_id) throw new Error("Missing instructor id");
    const request = await HelpRequest.update({
      where: { id },
      data: { instructor_id }
    });
    return request;
  } catch (error) {
    console.error(error);
  }
}


export default {
  createHelpRequest,
  getHelpRequests,
  updateRequestStatus,
  updateRequestInstructor
};