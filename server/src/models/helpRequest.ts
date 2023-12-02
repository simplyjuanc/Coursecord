import { HelpRequest } from ".";
import { THelpRequest } from "../../@types/types";


async function createHelpRequest(content: string, course_id: string, students: string[]) {
  try {
    if (!content || !course_id || !students) throw new Error("Missing data");
    const createdRequest = await HelpRequest.create({
      data: {
        content,
        course_id,
        students: {
          connect: students.map((student) => ({ id: student }))
        }
      },
    });
    return createdRequest;

  } catch (error) {
    console.error(error);
  }
}


async function getHelpRequests(courseId: string) {
  const requests = await HelpRequest.findMany({
    where: { course: { id: courseId } },
    include: {
      students: true,
      instructor: true
  }});
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