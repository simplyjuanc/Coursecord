import { Organisation as TOrganisation } from '@prisma/client';
import { Organisation } from './index';

async function createOrganisation(name: string, owner: string) {
  const newOrg = await Organisation.create({
    data: {
      name,
      owner_id: owner,
      admins: { create: { user_id: owner } },
    },
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

async function addAdminToOrganisation(
  orgId: string,
  userId: string,
) {
  const updatedOrg = await Organisation.update({
    where: { id: orgId },
    data: { admins: { create: { user_id: userId } } },
  });

  return updatedOrg;
}

async function getOrganisationsWithAdmin(userId: string) {
  const org = await Organisation.findMany({
    where: { admins: { some: { user_id: userId } } },
  });

  return org;
}

async function getOrgManagementInfo(orgId: string, userId: string) {
  console.log(orgId, userId);
  const org = Organisation.findUnique({
    where: {
      id: orgId,
      admins: {
        some: {
          user_id: userId,
        },
      },
    },
    select: {
      name: true,
      courses: { select: { title: true, id: true } },
      admins: {
        select: { user: true },
      },
    },
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
  addAdminToOrganisation: addAdminToOrganisation,
  getOrganisationsWithAdmin,
  getOrgWithSection,
  getOrgManagementInfo,
};
