import { MdOutlinePersonAddAlt } from 'react-icons/md';
import IconButton from '@/components/buttons/iconButton';
import { useEffect, useState } from 'react';
import AddExistingUser from './AddNewUser';
import { Course, SessionWithToken, TCourseManagement, User } from '@/types';
import {
  deleteUserFromCourse,
  getCourseData,
  getCourseManagementInfo,
} from '@/services/apiClientService';
import { useSession } from 'next-auth/react';
import UserTable from './UserTable';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  addCourse,
  removeUserFromCourse,
} from '@/store/slices/managementSlice';
import { set } from 'date-fns';

type CourseManagementProps = {
  course: {
    title: string;
    id: string;
  };
  showNewUserModal: (
    role: 'student' | 'instructor',
    users: { [key: string]: User }[]
  ) => void;
  showNewUser: boolean;
  setShowNewUser: React.Dispatch<React.SetStateAction<boolean>>;
  role: string;
  existingUsers: User[];
};

export default function CourseManagement(props: CourseManagementProps) {
  const { course, showNewUserModal } = props;
  console.log('CourseManagement - course :>> ', course);
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const courses = useAppSelector((state) => state.management.cachedCourses);
  const [activeCourse, setActiveCourse] = useState<TCourseManagement>();

  useEffect(() => {
    (async () => {
      if (!courses[course.id]) {
        const updatedCourse = await getCourseData(course.id);
        if (!updatedCourse) {
          console.error('Course not found');
          return;
        }
        console.log('updatedCourse :>> ', updatedCourse);
        dispatch(addCourse(updatedCourse));
        setActiveCourse(updatedCourse);
      }
    })();
  }, [course, courses, dispatch, session]);

  async function removeUser(role: string, userId: string) {
    try {
      dispatch(removeUserFromCourse({ role, userId, courseId: course.id }));

      const userDeleted = await deleteUserFromCourse(
        course.id,
        role,
        userId,
        session as SessionWithToken
      );
      if (userDeleted) console.log(`${role} removed from course`);
      else window.alert('Something went wrong');
    } catch (error) {
      console.error('handleDelete - error :>> ', error);
    }
  }

  return (
    <div className='bg-white w-full flex flex-col flex-none min-h-full max-h-full rounded-xl p-6 shadow-xl border-2 border-primary-gray border-opacity-40 overflow-auto overscroll-contain scrollbar-hide mb-8'>
      <h1 className='mb-6 mx-4'>
        <span className='text-xl font-medium'>Course: </span>
        <span className='text-2xl font-semibold text-center my-auto drop-shadow-sm  text-primary-1 text-opacity-70'>
          {course.title}
        </span>
      </h1>

      {activeCourse && (
        <div className='flex flex-row flex-nowrap'>


          <div className='flex flex-col items-center flex-start'>
            <div className='flex flex-row flex-nowrap justify-around w-full '>
              <h2 className='text-xl font-semibold my-auto'>Instructors:</h2>
              <div className=''>
                <IconButton
                  icon={<MdOutlinePersonAddAlt />}
                  title='Add New User'
                  onClick={() =>
                    showNewUserModal('instructor', activeCourse.instructors)
                  }
                ></IconButton>
              </div>
            </div>

            <UserTable
              users={activeCourse.instructors}
              type='instructor'
              removeUser={removeUser}
              />

          </div>

          <div className='flex flex-col items-center flex-start'>
            <div className='flex flex-row flex-nowrap justify-around w-full '>
              <h2 className='text-xl font-semibold my-auto'>Students:</h2>
              <div className=''>
                <IconButton
                  icon={<MdOutlinePersonAddAlt />}
                  title='Add New User'
                  onClick={() =>
                    showNewUserModal('student', activeCourse.students)
                  }
                ></IconButton>
              </div>
            </div>
            <UserTable
              users={activeCourse.students}
              type='student'
              removeUser={removeUser}
            />
          </div>
        </div>
      )}
    </div>
  );
}
