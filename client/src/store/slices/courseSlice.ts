import { CompiledSection, CourseInfo, CourseState, Unit } from '@/types';
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
    addSection: (state, { payload }: PayloadAction<{section: CompiledSection}>) => {
      if (state.syllabus && state.courseInfo) {
        state.syllabus.push(payload.section);
      }
    },
    addUnitToSection: (state, { payload }: PayloadAction<{sectionId: string, unit: Unit}>) => {
      if (state.syllabus && state.courseInfo) {
        const section = state.syllabus.find((section) => section.id === payload.sectionId);
        if (section) {
          section.units.push(payload.unit);
        }
      }
    }
  },
});

export const { setCourseInfo, setSyllabus, addSection, addUnitToSection } = courseSlice.actions;

export default courseSlice.reducer;
