import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Course, ManagementState, OrgInfo, User } from '@/types';

const initialState: ManagementState = {
  orgInfo: undefined,
  cachedCourses: {},
};

const managementSlice = createSlice({
  name: 'management',
  initialState,
  reducers: {
    setOrgInfo(state, { payload }: PayloadAction<OrgInfo>) {
      state.orgInfo = payload;
    },
    addCourse(state, { payload }: PayloadAction<Course>) {
      state.cachedCourses[payload.id] = payload;
    },
    updateCourse(state, { payload }: PayloadAction<Course>) {
      state.cachedCourses[payload.id] = { payload }.payload;
    },
    deleteCourse(state, { payload }: PayloadAction<string>) {
      delete state.cachedCourses[payload];
    },
    addUserToCourse(
      state,
      { payload }: PayloadAction<{ courseId: string; user: User; role: string }>
    ) {
      const { courseId, user, role } = payload;
      const course = state.cachedCourses[courseId];

      if (role === 'student') {
        course.students.push({ student: user });
      } else if (role === 'instructor') {
        course.instructors.push({ instructor: user });
      }

      state.cachedCourses = { ...state.cachedCourses, [courseId]: course };
    },
    removeUserFromCourse(
      state,
      {
        payload,
      }: PayloadAction<{ courseId: string; userId: string; role: string }>
    ) {
      const { courseId, userId, role } = payload;
      const course = state.cachedCourses[courseId];

      if (role === 'student') {
        course.students = course.students.filter(
          (student) => student.student.id !== userId
        );
      } else {
        course.instructors = course.instructors.filter(
          (instructor) => instructor.instructor.id !== userId
        );
      }

      state.cachedCourses = { ...state.cachedCourses, [courseId]: course };
    },
  },
});

export const {
  setOrgInfo,
  addCourse,
  updateCourse,
  deleteCourse,
  addUserToCourse,
  removeUserFromCourse
} = managementSlice.actions;
export default managementSlice.reducer;
