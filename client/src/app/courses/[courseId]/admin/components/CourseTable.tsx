import { Course, DbUser, IRole } from '@/types';
import UserRow from './UserRow';

type CourseTableProps = {
  course: Course;
};

export default function CourseTable(props: CourseTableProps) {
  const { course } = props;

  return (
    <div>
      {course.instructors.length === 0 && course.students.length === 0 ? (
        <p>No users currently assigned!</p>
      ) : (
        <div className='p-8 mx-auto drop-shadow'>
          <div className='grid grid-cols-7 border border-primary-gray border-opacity-30 rounded-lg'>
            <div className='col-span-1 py-1 pb-2 text-lg font-semibold text-center bg-opacity-25 border-1 text bg-primary-red border-primary-gray rounded-tl-lg'>
              Actions
            </div>
            <div className='col-span-2 py-1 pb-2 text-lg font-semibold text-center bg-opacity-25 border-1 text bg-primary-red border-primary-gray'>
              Name
            </div>
            <div className='col-span-2 py-1 pb-2 text-lg font-semibold text-center bg-opacity-25 border-1 text bg-primary-red border-primary-gray'>
              Email
            </div>
            <div className='col-span-2 py-1 pb-2 text-lg font-semibold text-center bg-opacity-25 border-1 text bg-primary-red border-primary-gray rounded-tr-lg'>
              Role
            </div>
            <div className='col-span-7 grid grid-cols-7 rounded-b-lg border-primary-gray'>
              {course.instructors.length > 0 &&
                course.instructors.map((instructor) => (
                  <UserRow
                    key={instructor.instructor.id}
                    user={instructor.instructor}
                    role='instructor'
                    courseId={course.id}
                  />
                ))}
              {course.students.length > 0 &&
                course.students.map((student) => (
                  <UserRow
                    key={student.student.id}
                    user={student.student}
                    role='student'
                    courseId={course.id}
                  />
                ))}
            </div>
            <div className='col-span-7 rounded-b-lg h-2 bg-white -mt-1'></div>
          </div>
        </div>
      )}
    </div>
  );
}
