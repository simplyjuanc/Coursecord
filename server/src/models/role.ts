import { Role } from './index';
import Organisation from './organisation';

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
    if (role.title === 'Admin' && userRoles.includes(role.id)){
      return true
    }
  }

  return false;
}

export default { createDefaultRoles, userRolesIncludeAdmin };
