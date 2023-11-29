import { Course, DbUser, RoleWithOrg, UserState } from '@/@types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: UserState = {
  user: undefined,
  roles: [],
  coursesAsInstructor: [],
  coursesAsStudent: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<{ user: DbUser }>) => {
      state.user = payload.user;
    },
    setRoles: (state, { payload }: PayloadAction<{ roles: RoleWithOrg[] }>) => {
      state.roles = payload.roles;
    },
    setCoursesAsInstructor: (
      state,
      { payload }: PayloadAction<{ courses: Course[] }>
    ) => {
      state.coursesAsInstructor = payload.courses;
    },
    setCoursesAsStudent: (
      state,
      { payload }: PayloadAction<{ courses: Course[] }>
    ) => {
      state.coursesAsStudent = payload.courses;
    },
  },
});

export const {
  setUser,
  setRoles,
  setCoursesAsInstructor,
  setCoursesAsStudent,
} = userSlice.actions;

export default userSlice.reducer;
