import { Request, Response } from 'express';
import { RequestWithUser } from '../@types/types';
import Course from '../models/course';
import CourseSection from '../models/courseSection';

async function addSection(req: Request, res: Response) {
  try {
    const { courseId } = req.params;

    const userId = (req as RequestWithUser).user.id;

    const sectionData = req.body;
    const newSection = await Course.createSection(sectionData, courseId, userId);

    res.status(201).send(newSection);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function editSection(req: Request, res: Response) {
  try {
    const { sectionId } = req.params;

    const userId = (req as RequestWithUser).user.id;

    const sectionData = req.body;

    const updatedSection = await CourseSection.editSection(
      sectionId,
      sectionData,
      userId
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

    const userId = (req as RequestWithUser).user.id;

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
