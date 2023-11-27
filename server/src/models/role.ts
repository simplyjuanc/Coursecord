import { Role } from './index';

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

export default { createDefaultRoles };
