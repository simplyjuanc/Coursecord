import {
  CompiledSection,
  CourseInfo,
  CourseState,
  DbUser,
  Unit,
} from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CourseState = {
  courseInfo: undefined,
  syllabus: [],
  cachedUnits: {},
  students: [],
  instructors: [],
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
    setStudents: (
      state,
      { payload }: PayloadAction<{ students: DbUser[] }>
    ) => {
      state.students = payload.students;
      console.log(state.students);
    },
    setInstructors: (
      state,
      { payload }: PayloadAction<{ instructors: DbUser[] }>
    ) => {
      state.instructors = payload.instructors;
      console.log(state.instructors);
    },
    addSection: (
      state,
      { payload }: PayloadAction<{ section: CompiledSection }>
    ) => {
      if (state.syllabus && state.courseInfo) {
        state.syllabus.push(payload.section);
      }
    },

    addUnitToSection: (
      state,
      {
        payload,
      }: PayloadAction<{ sectionId: string; course_unit: { unit: Unit } }>
    ) => {
      const {
        sectionId,
        course_unit
      } = payload;

      if (state.syllabus && state.courseInfo) {
        const section = state.syllabus.find(
          (section) => section.id === sectionId
        );
        if (section) {
          section.course_units.push(course_unit);
        }
      }

      console.log('STATE', state.syllabus);
    },
    updateUnit: (state, { payload }: PayloadAction<{ newUnit: Unit }>) => {
      if (state.syllabus && state.courseInfo) {
        const newSyllabus = state.syllabus.map((section) => {
          const units = section.course_units.map((unit) =>
            unit.unit.id === payload.newUnit.id ? payload.newUnit : unit
          );

          return {
            ...section,
            units,
          };
        });
        return { ...state, syllabus: newSyllabus };
      }
    },
    deleteUnit: (state, { payload }: PayloadAction<{ unitId: string }>) => {
      if (state.syllabus && state.courseInfo) {
        const newSyllabus = state.syllabus.map((section) => {
          const units = section.course_units.filter(
            (unit) => unit.unit.id !== payload.unitId
          );

          return {
            ...section,
            units,
          };
        });
        return { ...state, syllabus: newSyllabus };
      }
    },
    deleteSection: (
      state,
      { payload }: PayloadAction<{ sectionId: string }>
    ) => {
      if (state.syllabus && state.courseInfo) {
        const newSyllabus = state.syllabus.filter(
          (section) => section.id !== payload.sectionId
        );
        return { ...state, syllabus: newSyllabus };
      }
    },
    updateSection: (
      state,
      { payload }: PayloadAction<{ newSection: CompiledSection }>
    ) => {
      if (state.syllabus && state.courseInfo) {
        const newSyllabus = state.syllabus.map((section) =>
          section.id === payload.newSection.id ? payload.newSection : section
        );
        return { ...state, syllabus: newSyllabus };
      }
    },
  },
});

export const {
  setCourseInfo,
  setSyllabus,
  setStudents,
  setInstructors,
  addSection,
  addUnitToSection,
  updateUnit,
  deleteUnit,
  deleteSection,
  updateSection,
} = courseSlice.actions;

export default courseSlice.reducer;
