import { Request, Response } from 'express';
import { CourseUnit, CourseSection } from '../models';

// REMOVE? 
async function addCourseUnit(req: Request, res: Response) {
  try {
    const { orgId, sectionId } = req.params;
    const { title, markdown_body, type } = req.body;
    const newUnit = await CourseUnit.create(
      {
        data: { title, markdown_body, owner: orgId, type },
      });

    const updatedSection = await CourseSection.update({
      where: { id: sectionId },
      data: {
        content: { push: newUnit.id }
      }
    });

    res.status(201).send({ newUnit, updatedSection });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error:\n', error });
  }
}

async function addUnitToSection(req: Request, res: Response) {
  try {
    const { sectionId, contentId } = req.params;
    const updatedSection = await CourseSection.update({ where: { id: sectionId }, data: { content: { push: contentId } } });
    res.status(200).send({ updatedSection });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error:\n', error });
  }
}

async function removeContentFromUnit(req: Request, res: Response) {
  try {
    const { sectionId, contentId } = req.params;
    const section = await CourseSection.findUnique({ where: { id: sectionId } });
    if (!section) throw new Error('No unique section found');

    const contentIdx = section.content.indexOf(contentId);
    const updatedContent = section.content.splice(contentIdx, 1);
    const updatedSection = await CourseSection.update({
      where: { id: sectionId },
      data: { content: { set: updatedContent } }
    });
    res.status(200).send({ updatedSection, updatedContent });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error:\n', error });
  }
}

async function deleteContent(req: Request, res: Response) {
  try {
    const { contentId } = req.params;
    const deletedContent = await CourseUnit.delete({ where: { id: contentId } });
    res.status(200).send({ message: `Deleted content:\n ${deletedContent}` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error:\n', error });
  }
}

async function editContent(req: Request, res: Response) {
  try {
    const { contentId } = req.params;
    const { title, type, markdown_body } = req.body // TODO : sync with front end on naming of this field
    const updatedContent = await CourseUnit.update({
      where: { id: contentId },
      data: { markdown_body, title, type }
    });
    res.status(200).send({ message: `Updated content:\n ${updatedContent}` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error:\n', error });
  }
}

export default {
  addCourseUnit,
  addUnitToSection,
  removeContentFromUnit,
  deleteContent,
  editContent
};
