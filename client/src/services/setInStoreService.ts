import { CompiledSection, Course, Section } from '@/@types';
import axios from 'axios';
import store from '@/store';
import { setCourseInfo, setSyllabus } from '@/store/slices/courseSlice';

export async function getCourseData(courseId: string) {
  try {
    const coursePromise = axios.get<Course>(
      `${process.env.API_URL || 'http://localhost:5000'}/course/${courseId}`
    );
    const syllabusPromise = axios.get<Section[]>(
      `${process.env.API_URL || 'http://localhost:5000'}/syllabus/${courseId}`
    );
    const [courseResponse, syllabusResponse] = await Promise.all([
      coursePromise,
      syllabusPromise,
    ]);
    if (courseResponse.status !== 200 || syllabusResponse.status !== 200) {
      throw new Error('Error fetching course data');
    }

    const compiledSectionPromises = syllabusResponse.data.map(
      async (section: Section) : Promise<CompiledSection> => {
        const units = (
          await axios.get(
            `${process.env.API_URL || 'http://localhost:5000'}/section/units/${
              section.id
            }`
          )
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
    return {
      course: undefined,
      sections: [],
    };
  }
}
