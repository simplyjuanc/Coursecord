import { Request, Response } from 'express';
import Organisation from '../models/organisation';
import { RequestWithUser } from '../types';
import Role from '../models/role';
import Course from '../models/course';
import CourseSection from '../models/courseSection';

async function addSection(req: Request, res: Response) {
  try {
    const { courseId } = req.params;
    const orgPromise = Organisation.getOrganisationWithCourse(courseId);
    const coursePromise = Course.getCourseById(courseId);

    const [org, course] = await Promise.all([orgPromise, coursePromise]);
    if (!org || !course) {
      return res.status(401).send('Invalid Course');
    }

    const userRoles = (req as RequestWithUser).user.roles;
    if (!(await Role.userRolesIncludeAdmin(userRoles, org.id))) {
      return res.status(401).send({ message: 'Missing Permissions' });
    }
    const sectionData = req.body;

    const newSection = await CourseSection.createSection(sectionData);
    await Course.addSectionToCourse(courseId, newSection.id);
    res.status(201).send(newSection);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function editSection(req: Request, res: Response) {
  try {
    const { sectionId } = req.params;
    const org = await Organisation.getOrgWithSection(sectionId);
    if (!org) {
      return res.status(401).send({ message: 'Invalid Section' });
    }

    const userRoles = (req as RequestWithUser).user.roles;
    if (!(await Role.userRolesIncludeAdmin(userRoles, org.id))) {
      return res.status(401).send({ message: 'Missing Permissions' });
    }

    const sectionData = req.body;

    const updatedSection = await CourseSection.editSection(
      sectionId,
      sectionData
    );
    res.status(200).send(updatedSection);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function deleteSection(req: Request, res: Response) {
  try {
    const { sectionId } = req.params;
    const org = await Organisation.getOrgWithSection(sectionId);
    console.log(org);
    if (!org) {
      return res.status(401).send({ message: 'Invalid Organisation' });
    }

    const userRoles = (req as RequestWithUser).user.roles;
    if (!(await Role.userRolesIncludeAdmin(userRoles, org.id))) {
      return res.status(401).send({ message: 'Missing Permissions' });
    }

    const deletedSection = await CourseSection.deleteSection(sectionId);
    res.status(204).send(deletedSection);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function getSectionsByCourse(req: Request, res: Response) {
  try {
    const { courseId } = req.params;

    const sections = await CourseSection.getSectionsByCourse(courseId);
    console.log(sections);
    res.status(200).send(sections);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

export default { addSection, editSection, deleteSection, getSectionsByCourse };
