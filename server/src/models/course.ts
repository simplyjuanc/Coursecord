import { Course as TCourse } from '@prisma/client';
import { Course, Organisation } from './index';
import { CourseSectionInfo } from '../@types/types';

async function createCourse(
  courseData: { title: string; description: string },
  orgId: string,
  userId: string
) {
  const updatedOrg = await Organisation.update({
    where: { id: orgId, admins: { some: { user_id: userId } } },
    data: { courses: { create: courseData } },
    include: { courses: true },
  });
  return updatedOrg.courses[updatedOrg.courses.length - 1];
}

async function getCourses() {
  const courses = await Course.findMany();
  return courses;
}

async function getCourseById(id: string) {
  const course = await Course.findUnique({
    where: { id },
    include: {
      organisation: { select: { name: true } },
      instructors: {
        select: { instructor: { select: { name: true, image: true } } },
      },
      students: {
        select: { student: { select: { name: true, image: true } } },
      },
    },
  });
  return course;
}

async function editCourse(
  courseId: string,
  newData: Partial<TCourse>,
  userId: string
) {
  const updatedCourse = await Course.update({
    where: {
      id: courseId,
      organisation: { admins: { some: { user_id: userId } } },
    },
    data: newData,
  });
  return updatedCourse;
}

async function deleteCourse(courseId: string, userId: string) {
  const deletedCourse = await Course.delete({
    where: {
      id: courseId,
      organisation: { admins: { some: { user_id: userId } } },
    },
  });
  return deletedCourse;
}

async function addStudentToCourse(
  courseId: string,
  userId: string,
  authUserId: string
) {
  const updatedCourse = await Course.update({
    where: {
      id: courseId,
      organisation: { admins: { some: { user_id: authUserId } } },
    },
    data: {
      students: { create: { student_id: userId } },
    },
  });
  return updatedCourse;
}

async function addInstructorToCourse(
  courseId: string,
  userId: string,
  authUserId: string
) {
  const updatedCourse = await Course.update({
    where: {
      id: courseId,
      organisation: { admins: { some: { user_id: authUserId } } },
    },
    data: {
      instructors: { create: { instructor_id: userId } },
    },
  });
  return updatedCourse;
}

async function removeStudentFromCourse(courseId: string, userId: string, authUserId: string) {
  const updatedCourse = await Course.update({
    where: { id: courseId, organisation: { admins: { some: { user_id: authUserId } } } },
    data: {
      students: { deleteMany: { student_id: userId } },
    },
  });
  return updatedCourse;
}

async function removeInstructorFromCourse(
  courseId: string,
  userId: string,
  authUserId: string
) {
  const updatedCourse = await Course.update({
    where: {
      id: courseId,
      organisation: { admins: { some: { user_id: authUserId } } },
    },
    data: {
      instructors: { deleteMany: { instructor_id: userId } },
    },
  });
  return updatedCourse;
}

async function addSectionToCourse(courseId: string, sectionId: string) {
  const updatedCourse = await Course.update({
    where: { id: courseId },
    data: { syllabus: { connect: { id: sectionId } } },
  });
  return updatedCourse;
}

async function getCourseUsers(courseId: string) {
  const course = await Course.findUnique({
    where: { id: courseId },
    select: {
      students: { select: { student: true } },
      instructors: { select: { instructor: true } },
    },
  });

  return course;
}

async function createSection(
  sectionData: CourseSectionInfo,
  courseId: string,
  userId: string
) {
  const updatedCourse = await Course.update({
    where: {
      id: courseId,
      organisation: { admins: { some: { user_id: userId } } },
    },
    data: { syllabus: { create: { ...sectionData } } },
    include: { syllabus: true },
  });
  
  return updatedCourse.syllabus[updatedCourse.syllabus.length - 1];
}

async function getCourseManagementInfo(courseId: string, userId: string) {
  const course = await Course.findUnique({
    where: {
      id: courseId,
      organisation: { admins: { some: { user_id: userId } } },
    },
    select: {
      id: true,
      title: true,
      description: true,
      instructors: {
        select: {
          instructor: {
            select: {
              name: true,
              email: true,
              id: true,
            },
          },
        },
      },
      students: {
        select: {
          student: {
            select: {
              name: true,
              email: true,
              id: true,
            },
          },
        },
      },
    },
  });
  return course;
}

export default {
  createCourse,
  getCourses,
  getCourseById,
  editCourse,
  deleteCourse,
  addSectionToCourse,
  getCourseUsers,
  getCourseManagementInfo,
  createSection,
  addStudentToCourse,
  addInstructorToCourse,
  removeInstructorFromCourse,
  removeStudentFromCourse,
};
