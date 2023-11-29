import { Role } from './index';
import Organisation from './organisation';
import User from '../models/user';
import role from '../controllers/role';

async function createDefaultRoles() {
  const newRoles = [];
  newRoles.push(
    (await Role.create({ data: { title: 'admin', permissions: ['admin'] } })).id
  );
  newRoles.push(
    (
      await Role.create({
        data: { title: 'instructor', permissions: ['instructor'] },
      })
    ).id
  );
  newRoles.push(
    (
      await Role.create({
        data: { title: 'student', permissions: ['student'] },
      })
    ).id
  );

  return newRoles;
}

async function userRolesIncludeAdmin(userRoles: string[], orgId: string) {
  const org = await Organisation.getOrganisationById(orgId);

  if (!org) {
    throw new Error('Organisation Not Found');
  }

  const orgRoles = await Role.findMany({ where: { id: { in: org.roles } } });
  for (const role of orgRoles) {
    if (role.title === 'admin' && userRoles.includes(role.id)) {
      return true;
    }
  }

  return false;
}

async function getRoleByTitle(orgRoles: string[], title: string) {
  const role = await Role.findFirst({
    where: {
      id: { in: orgRoles },
      title,
    },
  });

  return role;
}

async function getRoleById(roleId: string) {
  const role = await Role.findUnique({ where: { id: roleId } });
  return role;
}

async function deleteRolesInOrg(orgRoles: string[]) {
  const deletedRoles = await Role.deleteMany({
    where: { id: { in: orgRoles } },
  });
  return deletedRoles;
}

async function getRolesByUser(userId: string) {
  const userPromise = User.getUserById(userId);
  const orgsWithUserPromise = Organisation.getOrganisationsWithMember(userId);
  const [user, orgsWithUser] = await Promise.all([
    userPromise,
    orgsWithUserPromise,
  ]);
  if (!user || !orgsWithUser) throw new Error('User or Organisation Not Found');

  const rolePromises = user.roles.map(async (roleId) => {
    let organisation = '';
    for (const org of orgsWithUser) {
      if (org.roles.includes(roleId)) {
        organisation = org.id;
        break;
      }
    }
    return {
      role: await getRoleById(roleId.replace('\n', '')),
      organisation,
    };
  });

  const roles = await Promise.all(rolePromises);

  return roles;
}
export default {
  createDefaultRoles,
  userRolesIncludeAdmin,
  getRoleByTitle,
  deleteRolesInOrg,
  getRolesByUser,
};
