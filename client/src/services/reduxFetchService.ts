import {
  CompiledSection,
  Course,
  DbUser,
  RoleWithOrg,
  Section,
} from '@/types';
import axios from 'axios';
import store from '@/store';
import { setCourseInfo, setSyllabus } from '@/store/slices/courseSlice';
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
    const [courseResponse, syllabusResponse] = await Promise.all([
      coursePromise,
      syllabusPromise,
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
  } catch (error) {
    console.log(error);
  }
}

export async function getUserData(user: DbUser) {
  try {
    const studentPromise = axios.get<Course[]>(
      `${baseUrl}/student/course/${user.id}`
    );
    const instructorPromise = axios.get<Course[]>(
      `${baseUrl}/instructor/course/${user.id}`
    );
    const rolesPromise = axios.get<RoleWithOrg[]>(
      `${baseUrl}/user/role/${user.id}`
    );

    const [studentResponse, instructorResponse, rolesResponse] =
      await Promise.all([studentPromise, instructorPromise, rolesPromise]);

    if (
      studentResponse.status !== 200 ||
      instructorResponse.status !== 200 ||
      rolesResponse.status !== 200
    ) {
      throw new Error('Error fetching user data');
    }

    store.dispatch(setUser({ user }));
    store.dispatch(setRoles({ roles: rolesResponse.data }));
    store.dispatch(
      setCoursesAsInstructor({ courses: instructorResponse.data })
    );
    store.dispatch(setCoursesAsStudent({ courses: studentResponse.data }));
  } catch (error) {
    console.log(error);
  }
}
