import { Organisation as TOrganisation } from '@prisma/client';
import { Organisation, User } from './index';

async function createOrganisation(name: string, owner: string) {
  const newOrg = await Organisation.create({
    data: {
      name,
      owner_id: owner,
      roles: {
        createMany: {
          data: [
            { title: 'admin', permissions: ['admin'] },
            { title: 'instructor', permissions: ['instructor'] },
            { title: 'student', permissions: ['student'] },
          ],
        },
      },
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

async function getOrganisationWithRole(roleId: string) {
  const org = await Organisation.findFirst({
    where: { roles: { some: { id: roleId } } },
  });

  return org;
}

async function addMemberToOrganisation(
  orgId: string,
  userId: string,
  roleTitle: string
) {
  const updatedOrg = await Organisation.update({
    where: { id: orgId },
    data: { members: { create: { user_id: userId } } },
    include: { roles: true },
  });

  const tileRole = updatedOrg.roles.find((role) => role.title === roleTitle);
  if (!tileRole) {
    throw new Error('Invalid Role');
  }

  await User.update({
    where: { id: userId },
    data: { roles: { create: { role_id: tileRole.id } } },
  });

  return updatedOrg;
}

async function getOrganisationsWithMember(userId: string) {
  const org = await Organisation.findMany({
    where: { members: { some: { user_id: userId } } },
  });

  return org;
}

async function getOrgManagementInfo(orgId: string, userId: string) {
  console.log(orgId, userId);
  const org = Organisation.findUnique({
    where: {
      id: orgId,
      members: {
        some: {
          user_id: userId,
          user: {
            roles: {
              some: { role: { organisation_id: orgId, title: 'admin' } },
            },
          },
        },
      },
    },
    select: {
      name: true,
      courses: { select: { title: true, id: true } },
      members: {
        where: {
          user: {
            roles: {
              some: { role: { organisation_id: orgId, title: 'admin' } },
            },
          },
        },
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
  getOrganisationWithRole,
  addMemberToOrganisation,
  getOrganisationsWithMember,
  getOrgWithSection,
  getOrgManagementInfo,
};

//below is the query that would be used to get all the info needed to manage an org
//it is pretty ridiculous so I don't think we should get all the organisation info at 1 time.
//I think the smartest thing to do would be to get the admins of the org in one query and
//and then have a dropdown menu that would allow you to select the course the wish to manage.
//then we could make a query to get the course and all the info about it.
//this way the initial query would be just the organisation, the titles and ids of the courses and the admins.
//I am also realising that to add a check that the user has the admin role to this it becomes even longer so
//that is kinda fucked up

// const org = await Organisation.findUnique({
//   where: { id: orgId },
//   include: {
//     roles: { select: { title: true, permissions: true } },
//     members: {
//       where: {
//         user: {
//           roles: {
//             some: { role: { organisation_id: orgId, title: 'admin' } },
//           },
//         },
//       },
//     },
//     courses: {
//       select: {
//         title: true,
//         students: {
//           include: {
//             student: { select: { name: true, email: true, roles: true } },
//           },
//         },
//         instructors: {
//           include: {
//             instructor: {
//               select: {
//                 name: true,
//                 email: true,
//                 roles: { where: { role: { organisation_id: orgId } } },
//               },
//             },
//           },
//         },
//       },
//     },
//   },
// });
