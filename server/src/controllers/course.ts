import { Request, Response } from 'express';
import Organisation from '../models/organisation';
import Course from '../models/course';
import { RequestWithUser } from '../@types/types';

async function addCourse(req: Request, res: Response) {
  try {
    const { orgId } = req.params;
    const courseData = req.body;
    const userId = (req as RequestWithUser).user.id;
    console.log ('BEFORE CREATE COURSE')
    const newCourse = await Course.createCourse(
      courseData,
      orgId,
      userId
    );
    console.log('AFTER CREATE COURSE')
    res.status(201).send(newCourse);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function getCourses(req: Request, res: Response) {
  try {
    const courses = await Course.getCourses();
    res.status(200).send(courses);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function getCourseById(req: Request, res: Response) {
  try {
    const { courseId } = req.params;
    const course = await Course.getCourseById(courseId);

    if (!course) {
      return res.status(404).send({ message: 'Course not found' });
    }

    res.status(200).send(course);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function editCourse(req: Request, res: Response) {
  try {
    const { courseId } = req.params;
    const newData = req.body;

    const userId = (req as RequestWithUser).user.id;

    const updatedCourse = await Course.editCourse(courseId, newData, userId);
    res.status(200).send(updatedCourse);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function deleteCourse(req: Request, res: Response) {
  try {
    const { courseId } = req.params;

    const userId = (req as RequestWithUser).user.id;

    const deletedCourse = await Course.deleteCourse(courseId, userId);
    res.status(204).send(deletedCourse);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function getCourseManagementInfo(req: Request, res: Response) {
  try {
    const { courseId } = req.params;
    const userId = (req as RequestWithUser).user.id;

    const courseManagementInfo = await Course.getCourseManagementInfo(
      courseId,
      userId
    );
    res.status(200).send(courseManagementInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function addStudentToCourse(req: Request, res: Response) {
  try {
    const { courseId, userId } = req.params;

    const updatedCourse = await Course.addStudentToCourse(courseId, userId);
    res.status(200).send(updatedCourse);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function addInstructorToCourse(req: Request, res: Response) {
  try {
    const { courseId, userId } = req.params;
    const updatedCourse = await Course.addInstructorToCourse(courseId, userId);
    res.status(200).send(updatedCourse);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function removeStudentFromCourse(req: Request, res: Response) {
  try {
    const { courseId, userId } = req.params;
    const updatedCourse = await Course.removeStudentFromCourse(
      courseId,
      userId
    );
    res.status(200).send(updatedCourse);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function removeInstructorFromCourse(req: Request, res: Response) {
  try {
    const { courseId, userId } = req.params;
    const updatedCourse = await Course.removeInstructorFromCourse(
      courseId,
      userId
    );
    res.status(200).send(updatedCourse);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

export default {
  addCourse,
  getCourses,
  getCourseById,
  editCourse,
  deleteCourse,
  getCourseManagementInfo,
  addInstructorToCourse,
  addStudentToCourse,
  removeInstructorFromCourse,
  removeStudentFromCourse,
};
