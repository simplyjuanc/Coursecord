import { Role } from './index';

async function userRolesIncludes(
  userRoles: string[],
  title: string,
  orgId: string
) {
  const roles = await Role.findMany({
    where: { id: { in: userRoles }, organisation_id: orgId, title: title },
  });

  return roles.length > 0;
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
  createDefaultRoles,
  userRolesIncludes,
  getRoleByTitle,
  deleteRolesInOrg,
  getRolesByUser,
  getRolesByOrg,
  getRoleById,
};
