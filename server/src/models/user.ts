import { UserInfo } from '../types';
import { User, Organisation } from './index';
// import Organisation from './organisation';
import Role from '../models/role';
import Course from '../models/course';
import { Organisation as TOrganisation } from '@prisma/client';

async function getUserByEmail(email: string) {
  const user = await User.findUnique({ where: { email } });
  return user;
}

async function getUserById(id: string) {
  try {
    const user = await User.findUnique({ where: { id } });
    if (!user) throw new Error('Invalid User');
    return user;
  } catch (error) {
    console.log(error);
  }
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
    data: { roles: { connect: { id: roleId } } },
  });
  return updatedUser;
}

async function userIsOrgOwner(userId: string, orgId: string) {
  try {
    const org = await Organisation.findUnique({ where: { id: orgId }, select: { owner_id: true } });
    if (!org) throw new Error('Invalid Organisation ID');
    return userId === org.owner_id;
  } catch (error) {
    console.log(error);
  }
}

async function getUsersByOrg(orgId: string) {
  try {
    const users = await Organisation.findUnique({
      where: { id: orgId },
      select: {
        members: { select: { user: true } }
      }
    });
    if (!users) throw new Error('Invalid Organisation ID');
    return users.members.map(member => member.user);
  } catch (error) {
    console.log(error);
  }
}

async function getUsersWithRoleByOrg(orgId: string, roleTitle: string) {
  try {
    const users = await User.findMany({
      where: {
        member_of: { every: { organisation_id: orgId } },
        roles: {
          some: {
            role: { title: roleTitle }
          }
        }
      },
    });
    return users;
  } catch (error) {
    console.log(error);
  }
}

async function getInstructorsByCourse(courseId: string) {
  try {
    const instructors = await User.findMany({
      where: { instructor_of: { some: { id: courseId } } }
    });
    return instructors;
  } catch (error) {
    console.log(error);
  }
}

async function getStudentsByCourse(courseId: string) {
  const students = await User.findMany({
    where: { student_of: { some: { id: courseId } } },
  });
  return students;
}

async function addRoleToUser(userId: string, roleId: string) {
  try {
    const updatedUser = await User.update({
      where: { id: userId },
      data: {
        roles: { connect: { id: roleId } }
      }
    });

    return updatedUser;

  } catch (error) {
    console.log(error);
  }
}

async function removeRoleFromUser(userId: string, roleId: string) {
  try {
    const updatedUser = await User.update({
      where: { id: userId },
      data: { roles: { disconnect: { id: roleId } } },
    });
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

async function deleteUser(userId: string) {
  try {
    const deletedUser = await User.delete({ where: { id: userId } });
    return deletedUser;
  } catch (error) {
    console.log(error);
  }
}

export default {
  getUserByEmail,
  createUser,
  updateUser,
  assignRoleToUser,
  userIsOrgOwner,
  getUserById,
  getUsersByOrg,
  getUsersWithRoleByOrg,
  getInstructorsByCourse,
  getStudentsByCourse,
  addRoleToUser,
  removeRoleFromUser,
  deleteUser
};
