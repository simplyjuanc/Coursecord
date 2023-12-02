import { Role } from './index';
import Course from './course';

async function userHasRole(userId: string, orgId: string, roleTitle: string) {
  const roles = await Role.findMany({
    where: {
      users: { some: { id: userId } },
      organisation_id: orgId,
      title: roleTitle,
    },
  });

  return roles.length > 0;
}

async function getRoleByTitle(orgId: string, title: string) {
  const role = await Role.findFirst({
    where: {
      organisation_id: orgId,
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

async function getRolesByOrg(orgId: string) {
  const roles = await Role.findMany({
    where: { organisation_id: orgId },
  });

  return roles;
}

async function getRolesByUser(userId: string) {
  const roles = Role.findMany({
    where: { users: { some: { user_id: userId } } },
  });

  return roles;
}

export default {
  userHasRole,
  getRoleByTitle,
  deleteRolesInOrg,
  getRolesByUser,
  getRolesByOrg,
  getRoleById,
};
