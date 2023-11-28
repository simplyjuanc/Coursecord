import { CourseUnitInfo } from '../types';
import { CourseUnit } from './index';

async function createCourseUnit(owner: string, courseUnitData: CourseUnitInfo) {
  const newCourseUnit = await CourseUnit.create({
    data: { ...courseUnitData, owner },
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

export default { createCourseUnit, deleteCourseUnit, editCourseUnit };
