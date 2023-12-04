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


async function addAdminToOrganisation(
  orgId: string,
  userId: string
  // authUserId: string
) {
  const updatedOrg = await Organisation.update({
    where: { id: orgId /* , admins: { some: { user_id: authUserId } } */ }, //temporary will later require authentication
    data: { admins: { create: { user_id: userId } } },
  });
  return updatedOrg;
}

async function removeAdminFromOrganisation(
  orgId: string,
  userId: string,
  authUserId: string
) {
  const updatedOrg = await Organisation.update({
    where: { id: orgId, admins: { some: { user_id: authUserId } } },
    data: { admins: { deleteMany: { user_id: userId } } },
  });
  return updatedOrg;
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
  editOrganisation,
  deleteOrganisation,
  addAdminToOrganisation,
  removeAdminFromOrganisation,
  getOrgManagementInfo,
  getOrganisationByName
};
