import { CourseUnitInfo } from '../@types/types';
import { CourseUnit, Organisation } from './index';

async function createCourseUnit(
  organisation_id: string,
  courseUnitData: CourseUnitInfo,
  userId: string
) {
  const updatedOrg = await Organisation.update({
    where: { id: organisation_id, admins: { some: { user_id: userId } } },
    data: { course_units: { create: { ...courseUnitData } } },
    include: { course_units: true },
  });
  return updatedOrg.course_units[updatedOrg.course_units.length - 1];
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

async function getUnit(unitId: string, courseId: string, userId: string) {
  console.log('UNIT ID', unitId, 'COURSE ID', courseId, 'USER ID', userId)
  const unit = await CourseUnit.findUnique({
    where: {
      id: unitId,
      organisation: {
        courses: {
          some: {
            AND: [
              { id: courseId },
              {
                OR: [
                  { students: { some: { student_id: userId } } },
                  { instructors: { some: { instructor_id: userId } } },
                  { organisation: { admins: { some: { user_id: userId } } } },
                ],
              },
              { syllabus: { some: { course_units: { some: { unit_id: unitId } } } } },
            ],
          },
        },
      },
    },
  });
  return unit;
}

export default {
  createCourseUnit,
  deleteCourseUnit,
  editCourseUnit,
  getUnit,
};
