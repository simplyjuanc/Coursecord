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
  console.log('model - addUnitToSection - {sectionId, unitId, userId} :>> ', {
    sectionId,
    unitId,
    userId,
  });

  const updatedSection = await CourseSection.update({
    where: {
      id: sectionId,
      course: { organisation: { admins: { some: { user_id: userId } } } },
    },
    data: {
      course_units: { create: { unit_id: unitId } },
    },
  });

  console.log('model - addUnitToSection - updatedSection :>> ', updatedSection);
  return updatedSection;
}

async function removeUnitFromSection(
  sectionId: string,
  unitId: string,
  userId: string
) {
  console.log(
    'model - removeUnitFromSection - sectionId, unitId, userId :>> ',
    { sectionId, unitId, userId }
  );
  const updatedSection = await CourseSection.update({
    where: {
      id: sectionId,
      course: { organisation: { admins: { some: { user_id: userId } } } },
    },
    data: {
      course_units: { deleteMany: { section_id: sectionId, unit_id: unitId } },
    },
  });
  console.log('model - removeUnitFromSection - updatedSection :>> ', {
    updatedSection,
  });

  return updatedSection;
}

async function deleteSection(id: string, userId: string) {
  const deletedSection = await CourseSection.delete({
    where: {
      id,
      course: { organisation: { admins: { some: { user_id: userId } } } },
    },
  });
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
  createSection,
  editSection,
  addUnitToSection,
  removeUnitFromSection,
  deleteSection,
  getSyllabus,
};
