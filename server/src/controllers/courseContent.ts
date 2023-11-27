import { Request, Response } from 'express';
import { CourseUnit, CourseSection, Organisation } from '../models';
import { 
  CourseUnit as TCourseUnit, 
  CourseSection as TCourseSection, 
  Organisation as TOrganisation 
} from '@prisma/client';


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

    const sectionsPromise = CourseSection.findMany({ where: { content: { has: deletedContent.id } } })
    const orgsPromise = Organisation.findMany({ where: { content: { has: deletedContent.id } } })
    const [sections, orgs] = await Promise.all([sectionsPromise, orgsPromise]);

    const updatedSections = removeCourseRelation(sections, deletedContent.id);
    const updatedOrgs = removeCourseRelation(orgs, deletedContent.id)

    const updateSectionPromises = updatedSections.map(async section => {
      await CourseSection.update({where: {id: section.id}, data: {content: {set: section.content}}})
    })

    const updateOrgPromises = updatedOrgs.map(async org => {
      await CourseSection.update({where: {id: org.id}, data: {content: {set: org.content}}})
    })

    await Promise.all([...updateSectionPromises, ...updateOrgPromises]);

    res.status(200).send({ message: `Deleted content:\n ${deletedContent}` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error:\n', error });
  }
}

function removeCourseRelation(targetCollection: TCourseSection[] | TOrganisation[], targetId: string) {
  return targetCollection.map(document => {
    const idx = document.content.indexOf(targetId);
    document.content.splice(idx, 1);
    return document;
  });
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
