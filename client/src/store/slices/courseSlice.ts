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

    addSection: (
      state,
      { payload }: PayloadAction<{ section: CompiledSection }>

      if (state.syllabus && state.courseInfo) {
        state.syllabus.push(payload.section);
      }
    },
    addUnitToSection: (
      state,
      { payload }: PayloadAction<{ sectionId: string; unit: Unit }>
    ) => {
      if (state.syllabus && state.courseInfo) {
        const section = state.syllabus.find(
          (section) => section.id === payload.sectionId
        );
        if (section) {
          section.units.push(payload.unit);
        }
      }
    },
    updateUnit: (state, { payload }: PayloadAction<{ newUnit: Unit }>) => {
      if (state.syllabus && state.courseInfo) {
        const newSyllabus = state.syllabus.map((section) => {
          const units = section.units.map((unit) =>
            unit.id === payload.newUnit.id ? payload.newUnit : unit
          );

          return {
            ...section,
            units,
          };
        });
        return { ...state, syllabus: newSyllabus };
      }
    },
  },
});

export const {
  setCourseInfo,
  setSyllabus,
  addSection,
  addUnitToSection,
  updateUnit,
} = courseSlice.actions;

export default courseSlice.reducer;
