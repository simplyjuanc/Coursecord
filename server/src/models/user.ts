import { UserInfo } from '../types';
import { User } from './index';
import Organisation from './organisation';
import Role from '../models/role';
import Course from '../models/course';

async function getUserByEmail(email: string) {
  const user = await User.findUnique({ where: { email } });
  return user;
}

async function getUserById(id: string) {
  const user = await User.findUnique({ where: { id } });
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
  const org = await Organisation.getOrganisationById(orgId);
  return userId === org?.owner;
}

async function getUsersByOrg(orgId: string) {
  const org = await Organisation.getOrganisationById(orgId);
  const users = await User.findMany({ where: { id: { in: org?.members } } });
  return users;
}

async function getUsersWithRoleByOrg(orgId: string, roleTitle: string) {
  const org = await Organisation.getOrganisationById(orgId);
  if (!org) {
    throw new Error('Invalid Organisation');
  }
  const role = await Role.getRoleByTitle(org.roles, roleTitle);
  if (!role) {
    throw new Error('Invalid Role');
  }
  const users = await User.findMany({ where: { roles: { has: role.id } } });
  return users;
}

async function getInstructorsByCourse(courseId: string) {
  const course = await Course.getCourseById(courseId);

  if (!course) {
    throw new Error('Invalid Course');
  }
  const instructors = await User.findMany({
    where: { id: { in: course.instructors } },
  });

  return instructors;
}

async function getStudentsByCourse(courseId: string) {
  const course = await Course.getCourseById(courseId);

  if (!course) {
    throw new Error('Invalid Course');
  }
  const students = await User.findMany({
    where: { id: { in: course.students } },
  });

  return students;
}

async function addRoleToUser(userId: string, roleId: string) {
  const updatedUser = await User.update({
    where: { id: userId },
    data: { roles: { push: roleId } },
  });

  return updatedUser;
}

async function removeRoleFromUser(userId: string, roleId: string) {
  const user = await getUserById(userId);
  if (!user) throw new Error('Invalid User');
  const updatedUser = await User.update({
    where: { id: userId },
    data: { roles: user.roles.filter((id) => id != roleId) },
  });

  return updatedUser;
}

async function deleteUser(userId: string) {
  const deletedUser = await User.delete({ where: { id: userId } });
  return deletedUser;
}

export default {
  getUserByEmail,
  createUser,
  updateUser,
  assignRoleToUser,
  addOrgToUser,
  userIsOrgOwner,
  getUsersByOrg,
  getUsersWithRoleByOrg,
  getInstructorsByCourse,
  getStudentsByCourse,
  addRoleToUser,
  removeRoleFromUser,
  deleteUser,
};
