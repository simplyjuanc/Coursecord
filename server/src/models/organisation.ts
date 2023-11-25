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

async function getOrganisationByName(name: string) {
  const org = await Organisation.findUnique({where: {name}})
  return org;
}

export default { createOrganisation, getOrganisations, getOrganisationByName };
