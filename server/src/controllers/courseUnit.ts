import { Request, Response } from 'express';
import CourseUnit from '../models/courseUnit';
import CourseSection from '../models/courseSection';
import Organisation from '../models/organisation';
import { RequestWithUser } from '../types';
import Role from '../models/role';

async function addCourseUnit(req: Request, res: Response) {
  try {
    const { orgId, sectionId } = req.params;
    const unitData = req.body;

    const userRoles = (req as RequestWithUser).user.roles;

    if (!(await Role.userRolesIncludeAdmin(userRoles, orgId))) {
      return res.status(401).send({ message: 'Incorrect Permissions' });
    }

    const newUnit = await CourseUnit.createCourseUnit(orgId, unitData);

    const updatedSection = await CourseSection.addUnitToSection(
      sectionId,
      newUnit.id
    );

    res.status(201).send({ newUnit, updatedSection });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error:\n', error });
  }
}

async function addUnitToSection(req: Request, res: Response) {
  try {
    const { sectionId, unitId } = req.params;

    const { isValid, orgId } = await sectionAndUnitAreValid(sectionId, unitId);
    if (!isValid) {
      return res.status(401).send({ message: 'Invalid section or unit' });
    }

    const userRoles = (req as RequestWithUser).user.roles;
    if (!(await Role.userRolesIncludeAdmin(userRoles, orgId))) {
      return res.status(401).send({ message: 'Unauthorised' });
    }

    const updatedSection = await CourseSection.addUnitToSection(
      sectionId,
      unitId
    );
    res.status(200).send({ updatedSection });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error:\n', error });
  }
}

async function removeUnitFromSection(req: Request, res: Response) {
  try {
    const { sectionId, unitId } = req.params;

    const { isValid, orgId } = await sectionAndUnitAreValid(sectionId, unitId);
    if (!isValid) {
      return res.status(401).send({ message: 'Invalid section or unit' });
    }

    const userRoles = (req as RequestWithUser).user.roles;
    if (!(await Role.userRolesIncludeAdmin(userRoles, orgId))) {
      return res.status(401).send({ message: 'Unauthorised' });
    }

    const updatedSection = await CourseSection.removeUnitFromSection(
      sectionId,
      unitId
    );
    res.status(200).send({ updatedSection });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error:\n', error });
  }
}

async function deleteContent(req: Request, res: Response) {
  try {
    const { unitId } = req.params;
    const org = await Organisation.getOrganisationWithUnit(unitId);
    if (!org) {
      return res.status(401).send({ message: 'Invalid unit' });
    }

    const userRoles = (req as RequestWithUser).user.roles;
    if (!(await Role.userRolesIncludeAdmin(userRoles, org.id))) {
      return res.status(401).send({ message: 'Unauthorised' });
    }

    const deletedUnit = await CourseUnit.deleteCourseUnit(unitId);
    const sections = await CourseSection.getSectionsWithUnit(unitId);

    const updateSectionPromises = sections.map(async (section) => {
      const newUnits = section.content.filter((id) => id !== unitId);
      await CourseSection.setSectionUnits(section.id, newUnits);
    });

    const newOrgUnits = org.content.filter((id) => id !== unitId);
    const updateOrgPromise = Organisation.setOrganisationUnits(
      org.id,
      newOrgUnits
    );

    await Promise.all([...updateSectionPromises, updateOrgPromise]);

    res.status(200).send({ message: `Deleted content:\n ${deletedUnit}` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error:\n', error });
  }
}

async function editContent(req: Request, res: Response) {
  try {
    const { unitId } = req.params;
    const org = await Organisation.getOrganisationWithUnit(unitId);
    if (!org) {
      return res.status(401).send({ message: 'Invalid Unit' });
    }
    const userRoles = (req as RequestWithUser).user.roles;
    if (!(await Role.userRolesIncludeAdmin(userRoles, org.id))) {
      return res.status(401).send({ message: 'Unauthorised' });
    }

    const unitData = req.body;
    const updatedContent = await CourseUnit.editCourseUnit(unitId, unitData);
    res.status(200).send({ message: `Updated content:\n ${updatedContent}` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error:\n', error });
  }
}

async function sectionAndUnitAreValid(sectionId: string, unitId: string) {
  const orgWithSectionPromise =
    Organisation.getOrganisationWithSection(sectionId);
  const orgWithUnitPromise = Organisation.getOrganisationWithUnit(unitId);
  const [orgWithSection, orgWithUnit] = await Promise.all([
    orgWithSectionPromise,
    orgWithUnitPromise,
  ]);

  if (orgWithSection && orgWithUnit && orgWithSection.id === orgWithUnit.id) {
    return { isValid: true, orgId: orgWithSection.id };
  }

  return { isValid: false, orgId: '' };
}

export default {
  addCourseUnit,
  addUnitToSection,
  removeUnitFromSection,
  deleteContent,
  editContent,
};
