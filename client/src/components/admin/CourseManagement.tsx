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
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const courses = useAppSelector((state) => state.management.cachedCourses);
  const [activeCourse, setActiveCourse] = useState<Course>();
  // console.log('CourseManagement - course :>> ', course);
  
  useEffect(() => {
    (async () => {
      if (!courses[course.id]) {
        const updatedCourse = await getCourseManagementInfo(course.id, session as SessionWithToken);
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
      console.log('removeUser - role, userId :>> ', role, userId);
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


  console.log('activeCourse :>> ', activeCourse);

  return (
    <div className='flex flex-col flex-none w-full max-h-full min-h-full p-6 mb-8 overflow-auto bg-white border-2 shadow-xl rounded-xl border-primary-gray border-opacity-40 overscroll-contain scrollbar-hide'>
      <h1 className='mx-4 mb-6'>
        <span className='text-xl font-medium'>Course: </span>
        <span className='my-auto text-2xl font-semibold text-center drop-shadow-sm text-primary-1 text-opacity-70'>
          { course.title }
        </span>
      </h1>

      {activeCourse && (
        <div className='flex flex-row flex-nowrap'>

          <div className='flex flex-col items-center flex-start'>
            <div className='flex flex-row justify-around w-full flex-nowrap '>
              <h2 className='my-auto text-xl font-semibold'>Instructors:</h2>
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
            <div className='flex flex-row justify-around w-full flex-nowrap '>
              <h2 className='my-auto text-xl font-semibold'>Students:</h2>
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
