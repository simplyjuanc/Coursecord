import { CourseUnitInfo } from '../types';
import { CourseUnit, Organisation } from './index';
import CourseSection from '../models/courseSection';

async function createCourseUnit(owner: string, courseUnitData: CourseUnitInfo) {
  const newCourseUnit = await CourseUnit.create({
    data: { ...courseUnitData, owner },
  });
  await Organisation.update({
    where: { id: owner },
    data: { content: { push: newCourseUnit.id } },
  });
  return newCourseUnit;
}

async function deleteCourseUnit(id: string) {
  const deletedUnit = await CourseUnit.delete({ where: { id } });
  return deletedUnit;
}

async function editCourseUnit(
  id: string,
  courseUnitData: Partial<CourseUnitInfo>
) {
  const updatedCourseUnit = await CourseUnit.update({
    where: { id },
    data: courseUnitData,
  });

  return updatedCourseUnit;
}

async function getUnitsBySection(sectionId: string) {
  const section = await CourseSection.getSectionById(sectionId);
  if (!section) throw new Error('No unique section found');

  const units = await CourseUnit.findMany({
    where: { id: { in: section.content } },
  });

  return units;
}

export default {
  createCourseUnit,
  deleteCourseUnit,
  editCourseUnit,
  getUnitsBySection,
};
