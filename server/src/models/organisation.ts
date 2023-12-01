import { Organisation as TOrganisation } from "@prisma/client";
import { Organisation } from "./index";
import Course from "./course";
import Role from "./role";

async function createOrganisation(name: string, owner: string) {
  const defaultRoles = await Role.createDefaultRoles();
  const newOrg = await Organisation.create({
    data: { name, owner_id: owner, roles: defaultRoles },
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

async function editOrganisation(
  id: string,
  newData: Partial<TOrganisation>,
  userId: string
) {
  const updatedOrg = await Organisation.update({
    where: { id, owner_id: userId },
    data: newData,
  });

  return updatedOrg;
}

async function deleteOrganisation(id: string) {
  const deletedOrg = await Organisation.delete({ where: { id } });
  return deletedOrg;
}

async function getOrganisationWithUnit(unitId: string) {
  const org = await Organisation.findFirst({
    where: { course_units: { some: { id: unitId } } },
  });

  return org;
}

async function setOrganisationUnits(orgId: string, units: string[]) {
  const updatedOrg = await Organisation.update({
    where: { id: orgId },
    data: {
      course_units: {},
    },
  });

  return updatedOrg;
}

async function getOrgWithSection(sectionId: string) {
  const org = await Organisation.findFirst({
    where: { courses: { some: { syllabus: { some: { id: sectionId } } } } },
  });

  return org;
}

async function getOrganisationWithCourse(courseId: string) {
  const org = await Organisation.findFirst({
    where: { courses: { some: { id: courseId } } },
  });

  return org;
}

async function getOrganisationWithRole(roleId: string) {
  const org = await Organisation.findFirst({
    where: { roles: { some: {id:roleId} } },
  });

  return org;
}

async function addMemberToOrganisation(orgId: string, userId: string) {
  const updatedOrg = await Organisation.update({
    where: { id: orgId },
    data: { members: { create: {user_id:userId} } },
  });

  return updatedOrg;
}

async function getOrganisationsWithMember(userId: string) {
  const org = await Organisation.findMany({
    where: { members: { some: {user_id:userId} } },
  });

  return org;
}

export default {
  createOrganisation,
  getOrganisations,
  getOrganisationByName,
  getOrganisationById,
  editOrganisation,
  deleteOrganisation,
  getOrganisationWithUnit,
  setOrganisationUnits,
  getOrganisationWithCourse,
  getOrganisationWithRole,
  addMemberToOrganisation,
  getOrganisationsWithMember,
  getOrgWithSection,
};
