import { Course as CourseType } from '@prisma/client';
import { Course, Organisation } from './index';

async function createCourse(title: string, description: string, orgId: string) {
  const course = await Course.create({
    data: { title, description, organisation_id: orgId },
  });
  return course;
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

async function getCoursesInOrg(orgId: string) {
  const courses = await Course.findMany({ where: { organisation_id: orgId } });
  return courses;
}

async function editCourse(id: string, newData: Partial<CourseType>) {
  const updatedCourse = await Course.update({ where: { id }, data: newData });
  return updatedCourse;
}

async function deleteCourse(id: string) {
  const deletedCourse = await Course.delete({ where: { id } });
  return deletedCourse;
}

async function deleteCoursesInOrganisation(orgId: string) {
  const deletedCourses = await Course.deleteMany({
    where: { organisation_id: orgId },
  });
  return deletedCourses;
}

async function addStudentToCourse(courseId: string, userId: string) {
  const updatedCourse = await Course.update({
    where: { id: courseId },
    data: {
      students: { create: { student_id: userId } },
    },
  });
  return updatedCourse;
}

async function getCoursesWithStudent(userId: string) {
  const courses = await Course.findMany({
    where: { students: { some: { student_id: userId } } },
  });
  return courses;
}

async function getCoursesWithInstructor(userId: string) {
  const courses = await Course.findMany({
    where: { instructors: { some: { instructor_id: userId } } },
  });
  return courses;
}

async function addSectionToCourse(courseId: string, sectionId: string) {
  const updatedCourse = await Course.update({
    where: { id: courseId },
    data: { syllabus: { connect: { id: sectionId } } },
  });
  return updatedCourse;
}

async function getCourseWithSection(sectionId: string) {
  const course = await Course.findFirst({
    where: { syllabus: { some: { id: sectionId } } },
  });

  return course;
}

async function getCourseUsers(courseId: string) {
  const course = await Course.findUnique({
    where: { id: courseId },
    select: {
      students: { select: { student: { include: { roles: true } } } },
      instructors: { select: { instructor: { include: { roles: true } } } },
    },
  });

  return course;
}

async function getCourseManagementInfo(courseId: string, userId: string) {
  const course = await Course.findUnique({
    where: { id: courseId } ,
    select: {
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
  getCoursesInOrg,
  editCourse,
  deleteCourse,
  deleteCoursesInOrganisation,
  addStudentToCourse,
  getCoursesWithStudent,
  getCoursesWithInstructor,
  addSectionToCourse,
  getCourseWithSection,
  getCourseUsers,
  getCourseManagementInfo,
};
