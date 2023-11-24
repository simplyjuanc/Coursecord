import { Organisation } from './index';
import Role from './role';

async function createOrganisation(name: string, owner: string) {
  const defaultRoles = await Role.createDefaultRoles();
  const newOrg = await Organisation.create({
    data: { name, owner, members: [owner], roles: defaultRoles },
  });

  return newOrg;
}

async function getOrganisations() {
  const orgs = await Organisation.findMany();
  return orgs;
}

export default { createOrganisation, getOrganisations };
