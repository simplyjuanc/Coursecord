import { CourseUnitInfo } from '../../@types/types';
import { CourseUnit } from './index';

async function createCourseUnit(
  organisation_id: string,
  courseUnitData: CourseUnitInfo,
  userId: string
) {
  const newCourseUnit = await Organisation.update({
    where: { id: organisation_id, admins: { some: { user_id: userId } } },
    data: { course_units: { create: { ...courseUnitData } } },
  });
  return newCourseUnit;
}

async function deleteCourseUnit(unitId: string, userId: string) {
  const deletedUnit = await CourseUnit.delete({
    where: {
      id: unitId,
      organisation: { admins: { some: { user_id: userId } } },
    },
  });
  return deletedUnit;
}

async function editCourseUnit(
  unitId: string,
  courseUnitData: Partial<CourseUnitInfo>,
  userId: string
) {
  const updatedCourseUnit = await CourseUnit.update({
    where: {
      id: unitId,
      organisation: { admins: { some: { user_id: userId } } },
    },
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
