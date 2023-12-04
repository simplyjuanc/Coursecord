import { HelpRequest } from ".";
import { THelpRequest, TCreateHelpRequest } from "../@types/types";


async function createHelpRequest(data: TCreateHelpRequest) {
  try {
    const createdRequest = await HelpRequest.create({
      data: {
        content: data.content,
        course_id: data.course_id,
        students: {
          createMany: {
            data: data.students.map((student) => ({ student_id: student }))
          }
        },
      }
    });
    return createdRequest;

  } catch (error) {
    console.error(error);
  }
}


async function getHelpRequests(courseId: THelpRequest['course_id']) {
  const requests = await HelpRequest.findMany({
    where: { course_id: courseId },
    include: {
      students: { include: { student: true } },
      instructor: true
    }
  });
  return requests;
}


async function updateRequestStatus(id: string, status: THelpRequest['status']) {
  try {
    // console.log('model - updateRequestStatus - id,status :>> ', id,status);
    let request;
    if (status === 'FINISHED') {
      request = await HelpRequest.update({
        where: { id },
        data: { status, finished_at: new Date() }
      })
    } else {
      request = await HelpRequest.update({
        where: { id },
        data: { status, finished_at: null }
      });
    }
    // console.log('model - updateRequestStatus - request :>> ', request);
    return request;
  } catch (error) {
    console.error(error);
  }
}


async function updateRequestInstructor(id: string, instructor_id: THelpRequest['instructor_id']) {
  try {
    const request = (instructor_id) ?
      await HelpRequest.update({
        where: { id },
        data: { instructor: { connect: { id: instructor_id } } }
      }) :
      await HelpRequest.update({
        where: { id },
        data: { instructor: { disconnect: true } }
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