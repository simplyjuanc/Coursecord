import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Course, ManagementState, OrgInfo } from '@/types';

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
  },
});

export const { setOrgInfo, addCourse, updateCourse, deleteCourse } =
  managementSlice.actions;
export default managementSlice.reducer;
