import { Organisation as Org } from '../types';
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

async function editOrganisation(id: string, newData: Partial<Org>) {
  const updatedOrg = await Organisation.update({
    where: { id },
    data: newData,
  });

  return updatedOrg;
}

async function deleteOrganisation(id: string) {
  const deletedOrg = await Organisation.delete({ where: { id } });
  return deletedOrg;
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
};
