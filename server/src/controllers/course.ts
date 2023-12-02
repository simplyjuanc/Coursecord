import { Request, Response } from 'express';
import Organisation from '../models/organisation';
import Course from '../models/course';
import { RequestWithUser } from '../../@types/types';
import User from '../models/user';
import Role from '../models/role';

async function addCourse(req: Request, res: Response) {
  try {
    const { orgId } = req.params;
    const { title, description } = req.body;
    const userId = (req as RequestWithUser).user.id;

    //TODO: edit this so that admins can do it
    if (!(await User.userIsOrgOwner(userId, orgId))) {
      return res.status(401).send({ message: 'Unauthorised' });
    }

    const newCourse = await Course.createCourse(title, description, orgId);
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

async function getCoursesByOrganisation(req: Request, res: Response) {
  try {
    const { orgId } = req.params;
    const courses = await Course.getCoursesInOrg(orgId);
    res.status(200).send(courses);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function editCourse(req: Request, res: Response) {
  try {
    const { courseId } = req.params;
    const newData = req.body;

    const course = await Course.getCourseById(courseId);
    if (!course) {
      return res.status(404).send({ message: 'Course not found' });
    }

    const orgId = course.organisation_id;
    const userId = (req as RequestWithUser).user.id;
    if (!(await Role.userHasRole(userId, orgId, 'admin'))) {
      return res.status(401).send({ message: 'Missing Correct Permissions' });
    }

    const updatedCourse = await Course.editCourse(courseId, newData);
    res.status(200).send(updatedCourse);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function deleteCourse(req: Request, res: Response) {
  try {
    const { orgId, courseId } = req.params;
    const orgWithCourse = await Organisation.getOrganisationWithCourse(
      courseId
    );
    if (!orgWithCourse || orgWithCourse.id !== orgId) {
      return res.status(401).send('Invalid Organisation or course');
    }

    const userId = (req as RequestWithUser).user.id;
    if (!(await Role.userHasRole(userId, orgId, 'admin'))) {
      return res.status(401).send({ message: 'Missing Correct Permissions' });
    }

    const deletedCourse = await Course.deleteCourse(courseId);
    res.status(204).send(deletedCourse);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function getCoursesWithStudent(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const courses = await Course.getCoursesWithStudent(userId);
    res.status(200).send(courses);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function getCoursesWithInstructor(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const courses = await Course.getCoursesWithInstructor(userId);
    res.status(200).send(courses);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

export default {
  addCourse,
  getCourses,
  getCourseById,
  getCoursesByOrganisation,
  editCourse,
  deleteCourse,
  getCoursesWithStudent,
  getCoursesWithInstructor,
};
