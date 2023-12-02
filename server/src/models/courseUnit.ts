import { CourseUnitInfo } from '../types';
import { CourseUnit, Organisation } from './index';

async function createCourseUnit(
  organisation_id: string,
  courseUnitData: CourseUnitInfo
) {
  const newCourseUnit = await CourseUnit.create({
    data: { ...courseUnitData, organisation_id },
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
  const units = await CourseUnit.findMany({
    where: { section: { some: { section_id: sectionId } } },
  });

  return units;
}

async function getUnit(id: string) {
  const unit = await CourseUnit.findUnique({ where: { id } });
  return unit;
}

export default {
  createCourseUnit,
  deleteCourseUnit,
  editCourseUnit,
  getUnitsBySection,
  getUnit,
};
