import { CourseSectionInfo } from '../types';
import { CourseSection } from './index';
import Course from './course';
import { CourseSection as TCourseSection } from '@prisma/client';

//right now course section info is just a title but I am sure that is
//going to change so I am putting the type there to make it easier to change later

async function createSection(sectionData: CourseSectionInfo) {
  const newSection = await CourseSection.create({ data: sectionData });
  return newSection;
}

async function editSection(
  id: string,
  sectionData: Partial<CourseSectionInfo>
) {
  const updatedSection = await CourseSection.update({
    where: { id },
    data: sectionData,
  });
  return updatedSection;
}

async function addUnitToSection(sectionId: string, unitId: string) {
  const updatedSection = await CourseSection.update({
    where: { id: sectionId },
    data: {
      content: { push: unitId },
    },
  });

  return updatedSection;
}

async function getSectionById(id: string) {
  const section = await CourseSection.findUnique({ where: { id} });
  return section;
}

async function removeUnitFromSection(sectionId: string, unitId: string) {
  const section = await getSectionById(sectionId);
  if (!section) throw new Error('No unique section found');

  const updatedSection = await CourseSection.update({
    where: { id: sectionId },
    data: { content: section.content.filter((id) => id !== unitId) },
  });

  return updatedSection;
}

async function setSectionUnits(sectionId: string, units: string[]) {
  const updatedSection = await CourseSection.update({
    where: { id: sectionId },
    data: { content: units },
  });

  return updatedSection;
}

async function getSectionsWithUnit(unitId: string) {
  const sections = await CourseSection.findMany({
    where: { content: { has: unitId } },
  });

  return sections;
}

async function deleteSection(id: string) {
  const deletedSection = await CourseSection.delete({ where: { id } });
  return deletedSection;
}

async function getSectionsByCourse(courseId: string) {
  const course = await Course.getCourseById(courseId);
  if (!course) throw new Error('No unique course found');

  const sections = await CourseSection.findMany({
    where: { id: { in: course.syllabus } },
  });

  return sections;
}

export default {
  createSection,
  editSection,
  addUnitToSection,
  getSectionById,
  removeUnitFromSection,
  setSectionUnits,
  getSectionsWithUnit,
  deleteSection,
  getSectionsByCourse,
};
