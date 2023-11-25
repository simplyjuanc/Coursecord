import { Request, Response } from 'express';
import Organisation from '../models/organisation';
import Course from '../models/course';

async function addCourse(req: Request, res: Response) {
  try {
    const { orgId } = req.params;
    const { title, description } = req.body;

    const newCourse = await Course.createCourse(title, description);
    await Organisation.addCourseToOrganisation(orgId, newCourse.id);

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
    res.status(200).send(course);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function getCoursesByOrganisation(req: Request, res: Response) {
  try {
    const { orgId } = req.params;

    const org = await Organisation.getOrganisationById(orgId);
    if (!org) {
      return res.status(404).send({ message: 'Organisation Not Found' });
    }

    const courses = await Course.getCoursesInOrg(org.courses);
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
    const updatedCourse = await Course.editCourse(courseId, newData);
    res.status(200).send(updatedCourse);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function deleteCourse(req: Request, res: Response) {
  try {
    const { courseId } = req.params;
    const deletedCourse = await Course.deleteCourse(courseId);
    res.status(204).send(deletedCourse);
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
};
