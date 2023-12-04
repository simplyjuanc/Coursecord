import { CourseSectionInfo } from '../@types/types';
import { CourseSection } from './index';


//right now course section info is just a title but I am sure that is
//going to change so I am putting the type there to make it easier to change later

async function createSection(sectionData: CourseSectionInfo) {
  const newSection = await CourseSection.create({ data: sectionData });
  return newSection;
}

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
  removeUnitFromSection,
  deleteSection,
  getSectionsByCourse,
};
