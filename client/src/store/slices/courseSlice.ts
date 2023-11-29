import { CompiledSection, CourseInfo, CourseState } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CourseState = {
  courseInfo: undefined,
  syllabus: undefined,
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setCourseInfo: (
      state,
      { payload }: PayloadAction<{ info: CourseInfo }>
    ) => {
      state.courseInfo = payload.info;
    },
    setSyllabus: (
      state,
      { payload }: PayloadAction<{ syllabus: CompiledSection[] }>
    ) => {
      state.syllabus = payload.syllabus;
    },
  },
});

export const {
  setCourseInfo,
  setSyllabus,
} = courseSlice.actions;

export default courseSlice.reducer;
