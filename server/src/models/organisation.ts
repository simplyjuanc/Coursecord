import { Organisation as TOrganisation } from '@prisma/client';
import { Organisation } from './index';
import Role from './role';

async function createOrganisation(name: string, owner: string) {
  const defaultRoles = await Role.createDefaultRoles();
  const newOrg = await Organisation.create({
    data: { name, owner, members: [owner], roles: defaultRoles },
  });

  return newOrg;
}

async function getOrganisations() {
  const orgs = await Organisation.findMany();
  return orgs;
}

async function getOrganisationByName(name: string) {
  const org = await Organisation.findUnique({ where: { name } });
  return org;
}

async function getOrganisationById(id: string) {
  const org = await Organisation.findUnique({ where: { id } });
  return org;
}

async function addCourseToOrganisation(id: string, course: string) {
  const updatedOrg = await Organisation.update({
    where: { id },
    data: { courses: { push: course } },
  });
  return updatedOrg;
}

async function removeCourseFromOrganisation(id: string, course: string) {
  const org = await Organisation.findUnique({ where: { id } });
  if (!org) throw new Error('Organisation not found');

  const updatedOrg = await Organisation.update({
    where: { id },
    data: { courses: org.courses.filter((id) => id !== course) },
  });

  return updatedOrg;
}

async function editOrganisation(
  id: string,
  newData: Partial<TOrganisation>,
  userId: string
) {
  const updatedOrg = await Organisation.update({
    where: { id, owner: userId },
    data: newData,
  });

  return updatedOrg;
}

async function deleteOrganisation(id: string) {
  const deletedOrg = await Organisation.delete({ where: { id } });
  return deletedOrg;
}

async function getOrganisationWithUnit(unitId: string) {
  const orgs = await Organisation.findFirst({
    where: { content: { has: unitId } },
  });

  return orgs;
}

async function setOrganisationUnits(orgId: string, units: string[]) {
  const updatedOrg = await Organisation.update({
    where: { id: orgId },
    data: {
      content: units,
    },
  });
  return updatedOrg;
}

async function getOrganisationWithSection(sectionId: string) {
  const org = await Organisation.findFirst({
    where: { content: { has: sectionId } },
  });

  return org;
}

export default {
  createOrganisation,
  getOrganisations,
  getOrganisationByName,
  getOrganisationById,
  addCourseToOrganisation,
  removeCourseFromOrganisation,
  editOrganisation,
  deleteOrganisation,
  getOrganisationWithUnit,
  setOrganisationUnits,
  getOrganisationWithSection
};
