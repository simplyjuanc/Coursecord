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

    const deletedSection = await CourseSection.deleteSection(sectionId, userId);
    res.status(204).send(deletedSection);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function getCourseSyllabus(req: Request, res: Response) {
  try {
    const { courseId } = req.params;
    console.log('controller - getCourseSyllabus - courseId :>> ', courseId);

    const syllabus = await CourseSection.getSyllabus(courseId);
    if (!syllabus) throw new Error('Syllabus not found');

    console.log('controller - getCourseSyllabus - syllabus :>> ', syllabus);
    
    res.status(200).send(syllabus);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

export default { addSection, editSection, deleteSection, getCourseSyllabus };
