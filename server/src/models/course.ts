import { Course as CourseType } from '@prisma/client';
import { Course, Organisation } from './index';


async function createCourse(title: string, description: string, orgId: string ){
  const course = await Course.create({ data: { title, description, organisation: orgId} });
  return course;
}

async function getCourses() {
  const courses = await Course.findMany();
  return courses;
}

async function getCourseById(id: string) {
  const course = await Course.findUnique({ where: { id } });
  return course;
}

async function getCoursesInOrg(orgCourses: string[]) {
  const courses = await Course.findMany({ where: { id: { in: orgCourses } } });
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
  const org = await Organisation.findUnique({ where: { id: orgId } });
  if (!org) throw new Error('Organisation Not Found');

  const deletedCourses = await Course.deleteMany({
    where: { id: { in: org.courses } },
  });
  return deletedCourses;
}

async function addStudentToCourse(courseId: string, userId: string) {
  const updatedCourse = await Course.update({
    where: { id: courseId },
    data: { students: { push: userId } },
  });
  return updatedCourse;
}

async function getCoursesWithStudent(userId: string) {
  const courses = await Course.findMany({where: {students: {has: userId}}});
  return courses;
}

async function getCoursesWithInstructor(userId: string) {
  const courses = await Course.findMany({where: {instructors: {has: userId}}});
  return courses;
}

async function addSectionToCourse(courseId: string, sectionId: string) {
  const updatedCourse = await Course.update({
    where: { id: courseId },
    data: { syllabus: { push: sectionId } },
  });
  return updatedCourse;
}

async function getCourseWithSection(sectionId: string) {
  const course = await Course.findFirst({
    where: { syllabus: { has: sectionId } },
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
  getCourseWithSection
};
