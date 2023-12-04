
import { UserInfo } from '../@types/types';
import { User, Organisation } from './index';

async function getUsers() {
  const users = await User.findMany();
  return users;
}

async function getUserByEmail(email: string) {
  const user = await User.findUnique({
    where: { email },
  });
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

async function getUsersByIds(ids: string[]) {
  try {
    const users = await User.findMany({where: { id: { in: ids } }});
    return users;
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

async function userIsOrgOwner(userId: string, orgId: string) {
  try {
    const org = await Organisation.findUnique({
      where: { id: orgId },
      select: { owner_id: true },
    });
    if (!org) throw new Error('Invalid Organisation ID');
    return userId === org.owner_id;
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

async function getUserCourses(userId: string) {
  try {
    const courses = await User.findUnique({
      where: { id: userId },
      select: {
        student_of: { select: { course: true } },
        instructor_of: { select: { course: true } },
      },
    });

    return courses;
  } catch (error) {
    console.log(error);
  }
}


async function isCourseInstructor(userId:string, courseId: string) {
  try {
    const instructors = await getInstructorsByCourse(courseId);
    if (!instructors) throw new Error("No instructors found");
    return instructors.some((instructor) => instructor.id === userId);
  } catch (error) {
    console.log(error)
  }
}

export default {
  getUsers,
  getUserByEmail,
  getUserById,
  getUsersByIds,
  createUser,
  updateUser,
  userIsOrgOwner,
  getUserById,
  deleteUser,
  getUserCourses,
  isCourseInstructor
};
