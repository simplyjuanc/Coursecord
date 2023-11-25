import { Role } from './index';

async function createDefaultRoles() {
  const newRoles = [];
  newRoles.push(
    (await Role.create({ data: { title: 'admin', permissions: ['all'] } })).id
  );
  newRoles.push(
    (
      await Role.create({
        data: { title: 'instructor', permissions: ['instruct'] },
      })
    ).id
  );
  newRoles.push(
    (await Role.create({ data: { title: 'student', permissions: ['learn'] } }))
      .id
  );

  return newRoles;
}

export default { createDefaultRoles };
