import { Request, Response } from 'express';
import CourseUnit from '../models/courseUnit';
import CourseSection from '../models/courseSection';
import { RequestWithUser } from '../@types/types';

async function addCourseUnit(req: Request, res: Response) {
  try {
    const userId = (req as RequestWithUser).user.id;
    const { orgId, sectionId } = req.params;
    const unitData = req.body;
    
    console.log('controller - addCourseUnit - userId, orgId, sectionId :>> ', {userId, orgId, sectionId});
    console.log('controller - addCourseUnit - unitData :>> ', unitData);
    
    const newUnit = await CourseUnit.createCourseUnit(orgId, unitData, userId);
    console.log('controller - addCourseUnit - newUnit :>> ', newUnit);
    
    const updatedSection = await CourseSection.addUnitToSection(
      sectionId,
      newUnit.id,
      userId
      );
    console.log('controller - addCourseUnit - updatedSection :>> ', updatedSection);
      
    res.status(201).send({ newUnit, updatedSection });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error:\n', error });
  }
}

async function addUnitToSection(req: Request, res: Response) {
  try {
    const { sectionId, unitId } = req.params;
    const userId = (req as RequestWithUser).user.id;

    console.log('controller - addUnitToSection - sectionId, unitId, userId :>> ', sectionId, unitId, userId);
    const updatedSection = await CourseSection.addUnitToSection(
      sectionId,
      unitId,
      userId
      );
    console.log('controller - addUnitToSection - updatedSection :>> ', updatedSection);
    
    res.status(200).send({ updatedSection });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error:\n', error });
  }
}

async function removeUnitFromSection(req: Request, res: Response) {
  try {
    const { sectionId, unitId } = req.params;

    const userId = (req as RequestWithUser).user.id;

    const updatedSection = await CourseSection.removeUnitFromSection(
      sectionId,
      unitId,
      userId
    );
    res.status(200).send({ updatedSection });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error:\n', error });
  }
}

async function deleteUnit(req: Request, res: Response) {
  try {
    const { unitId } = req.params;

    const userId = (req as RequestWithUser).user.id;

    const deletedUnit = await CourseUnit.deleteCourseUnit(unitId, userId);

    res.status(200).send({ message: `Deleted content:\n ${deletedUnit}` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error:\n', error });
  }
}

async function editUnit(req: Request, res: Response) {
  try {
    const { unitId } = req.params;

    const userId = (req as RequestWithUser).user.id;

    const unitData = req.body;
    const updatedContent = await CourseUnit.editCourseUnit(
      unitId,
      unitData,
      userId
    );
    res.status(200).send({ message: `Updated content:\n ${updatedContent}` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error:\n', error });
  }
}

async function getUnit(req: Request, res: Response) {
  try {
    const { unitId } = req.params;
    const unit = await CourseUnit.getUnit(unitId);
    console.log('controller - getUnit - unit :>> ', unit);

    res.status(200).send(unit);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error:\n', error });
  }
}

export default {
  addCourseUnit,
  addUnitToSection,
  removeUnitFromSection,
  deleteUnit,
  editUnit,
  getUnit,
};
