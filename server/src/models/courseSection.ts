import { CourseSectionInfo } from '../../@types/types';
import { CourseSection } from './index';


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
      course_units: { create: { unit_id: unitId } },
    },
  });

  return updatedSection;
}

async function getSectionById(id: string) {
  const section = await CourseSection.findUnique({ where: { id } });
  return section;
}

async function removeUnitFromSection(sectionId: string, unitId: string) {
  const updatedSection = await CourseSection.update({
    where: { id: sectionId },
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

async function getSectionsByCourse(courseId: string) {
  const sections = await CourseSection.findMany({
    where: { course: { id: courseId } },
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
