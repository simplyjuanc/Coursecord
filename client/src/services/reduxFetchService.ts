import {
  CompiledSection,
  Course,
  DbUser,
  RoleWithOrg,
  Section,
} from '@/types';
import axios from 'axios';
import store from '@/store';
import { setCourseInfo, setInstructors, setStudents, setSyllabus } from '@/store/slices/courseSlice';
import {
  setCoursesAsInstructor,
  setCoursesAsStudent,
  setRoles,
  setUser,
} from '@/store/slices/userSlice';

const baseUrl = process.env.API_URL || 'http://localhost:5000';

export async function getCourseData(courseId: string) {
  try {
    const coursePromise = axios.get<Course>(`${baseUrl}/course/${courseId}`);
    const syllabusPromise = axios.get<Section[]>(
      `${baseUrl}/syllabus/${courseId}`
    );
    const studentPromise = axios.get<DbUser[]>(`${baseUrl}/${courseId}/students`)
    const instructorPromise = axios.get<DbUser[]>(`${baseUrl}/${courseId}/instructors`)
    const [courseResponse, syllabusResponse, studentResponse, instructorResponse] = await Promise.all([
      coursePromise,
      syllabusPromise,
      studentPromise,
      instructorPromise
    ]);

    if (courseResponse.status !== 200 || syllabusResponse.status !== 200) {
      throw new Error('Error fetching course data');
    }

    const compiledSectionPromises = syllabusResponse.data.map(
      async (section: Section): Promise<CompiledSection> => {
        const units = (
          await axios.get(`${baseUrl}/section/units/${section.id}`)
        ).data;
        return {
          ...section,
          units,
        };
      }
    );
    
    const compiledSections = await Promise.all(compiledSectionPromises);
    const course = courseResponse.data;

    const info = {
      id: course.id,
      title: course.title,
      organisation: course.organisation,  
      description: course.description,
      instructors: course.instructors,
      students: course.students,
    };
    const syllabus = compiledSections;

    store.dispatch(setCourseInfo({ info }));
    store.dispatch(setSyllabus({ syllabus }));
    store.dispatch(setInstructors({ instructors: instructorResponse.data }));
    store.dispatch(setStudents({ students: studentResponse.data }));
  } catch (error) {
    console.log(error);
  }
}

export async function getUserCourse(user: DbUser) {
  try {
    
    
  } catch (error) {
    console.log(error);
  }
}
