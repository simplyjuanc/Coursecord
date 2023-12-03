import { Course, RoleWithOrg, UserState } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: UserState = {
  id: '',
  roles: [],
  coursesAsInstructor: [],
  coursesAsStudent: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<{ userId: string }>) => {
      state.id = payload.userId;
    },
    setRoles: (state, { payload }: PayloadAction<{ roles: RoleWithOrg[] }>) => {
      state.roles = payload.roles;
      console.log('roles', state.roles)
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
