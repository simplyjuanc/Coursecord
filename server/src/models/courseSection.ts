import { CourseSectionInfo } from '../types';
import { CourseSection } from './index';

async function editSection(
  sectionId: string,
  sectionData: Partial<CourseSectionInfo>,
  userId: string
) {
  const updatedSection = await CourseSection.update({
    where: {
      id: sectionId,
      course: { organisation: { admins: { some: { user_id: userId } } } },
    },
    data: sectionData,
  });
  return updatedSection;
}

async function addUnitToSection(
  sectionId: string,
  unitId: string,
  userId: string
) {
  const updatedSection = await CourseSection.update({
    where: {
      id: sectionId,
      course: { organisation: { admins: { some: { user_id: userId } } } },
    },
    data: {
      course_units: { create: { unit_id: unitId } },
    },
  });

  return updatedSection;
}

async function getSectionById(id: string) {
  const section = await CourseSection.findUnique({ where: { id } });
  return section;
}

async function removeUnitFromSection(
  sectionId: string,
  unitId: string,
  userId: string
) {
  const updatedSection = await CourseSection.update({
    where: {
      id: sectionId,
      course: { organisation: { admins: { some: { user_id: userId } } } },
    },
    data: {
      course_units: { deleteMany: { section_id: sectionId, unit_id: unitId } },
    },
  });

  return updatedSection;
}

async function setSectionUnits(sectionId: string, units: string[]) {
  const updatedSection = await CourseSection.update({
    where: { id: sectionId },
    data: {
      course_units: {
        deleteMany: { section_id: sectionId },
        createMany: {
          data: units.map((unitId) => ({
            sectionId: sectionId,
            unit_id: unitId,
          })),
        },
      },
    },
  });

  return updatedSection;
}

async function getSectionsWithUnit(unitId: string) {
  const sections = await CourseSection.findMany({
    where: { course_units: { some: { unit_id: unitId } } },
  });

  return sections;
}

async function deleteSection(id: string) {
  const deletedSection = await CourseSection.delete({ where: { id } });
  return deletedSection;
}

async function getSyllabus(courseId: string) {
  const sections = await CourseSection.findMany({
    where: { course: { id: courseId } },
    include: {
      course_units: {
        select: { unit: { select: { id: true, title: true, type: true } } },
      },
    },
  });

  return sections;
}

export default {
  editSection,
  addUnitToSection,
  getSectionById,
  removeUnitFromSection,
  setSectionUnits,
  getSectionsWithUnit,
  deleteSection,
  getSyllabus,
};
