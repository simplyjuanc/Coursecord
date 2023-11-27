import { UserInfo } from '../types';
import { User } from './index';
import Organisation from './organisation';

async function getUserByEmail(email: string) {
  const user = await User.findUnique({ where: { email } });
  return user;
}

async function createUser(userInfo: UserInfo) {
  const newUser = await User.create({
    data: userInfo,
  });
  return newUser;
}

async function updateUser(userInfo: UserInfo) {
  const updatedUser = await User.update({
    where: { email: userInfo.email },
    data: {
      ...userInfo,
    },
  });

  return updatedUser;
}

async function assignRoleToUser(id: string, roleId: string) {
  const updatedUser = await User.update({
    where: { id },
    data: { roles: { push: roleId } },
  });
  return updatedUser;
}

async function addOrgToUser(userId: string, orgId: string) {
  const updatedUser = await User.update({
    where: { id: userId },
    data: {
      organisations: { push: orgId },
    },
  });

  return updatedUser;
}

async function userIsOrgOwner(userId: string, orgId: string) {
  const org = await Organisation.getOrganisationById(orgId)
  console.log('org owner', org?.owner)
   console.log('user', userId);

  console.log(userId === org?.owner);
  return userId === org?.owner;
}

export default { getUserByEmail, createUser, updateUser, assignRoleToUser, addOrgToUser, userIsOrgOwner };
