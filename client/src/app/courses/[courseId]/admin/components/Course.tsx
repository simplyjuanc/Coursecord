import { MdOutlinePersonAddAlt } from 'react-icons/md';
import IconButton from '@/components/buttons/iconButton';
import { useEffect, useState } from 'react';
import AddNewUser from './AddNewUser';
import AddExistingUser from './AddExistingUser';
import { IRole, SessionWithToken } from '@/types';
import { getCourseManagementInfo } from '@/services/apiClientService';
import { useSession } from 'next-auth/react';
import UserTable from './UserTable';
import { useAppDispatch, useAppSelector } from '@/store';
import { addCourse } from '@/store/slices/managementSlice';

type CourseManagementProps = {
  courseId: string;
};

export default function CourseManagement(props: CourseManagementProps) {
  const { courseId } = props;
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const courses = useAppSelector((state) => state.management.cachedCourses);

  const [showNewUser, setShowNewUser] = useState(false);
  const [showExistingUser, setShowExistingUser] = useState(false);
  const roles: IRole[] = [];

  useEffect(() => {
    (async () => {
      if (!courses[courseId]) {
        const course = await getCourseManagementInfo(
          courseId,
          session as SessionWithToken
        );
        dispatch(addCourse(course));
      }
    })();
  }, []);

  function showNewUserModal() {
    setShowNewUser(true);
  }

  function showExistingUserModal() {
    setShowExistingUser(true);
  }

  return (
    <>
      <div className='flex flex-row gap-4 align-middle justify-around'>
        <h1 className='text-2xl font-bold text-center my-auto drop-shadow-lg'>
          {courses[courseId]?.title} Course{' '}
        </h1>
        <div className='flex flex-col gap-2 align-middle justify-evenly w-1/4'>
          <div>
            <IconButton
              icon={<MdOutlinePersonAddAlt />}
              title='Add New User'
              onClick={showNewUserModal}
            ></IconButton>
          </div>
          <div>
            <IconButton
              icon={<MdOutlinePersonAddAlt />}
              title='Add Existing User'
              onClick={showExistingUserModal}
            ></IconButton>
          </div>
        </div>
      </div>

      {showNewUser && (
        <AddNewUser
          courseId={courseId}
          setShowNewUser={setShowNewUser}
          roles={roles}
        />
      )}
      {showExistingUser && (
        <AddExistingUser
          courseId={courseId}
          setShowExistingUser={setShowExistingUser}
          roles={roles}
        />
      )}
      {courses[courseId] != null && (
        <div className='mt-5 mx-auto'>
          <h2 className='text-xl font-semibold mb-5'>Instructors:</h2>
          <div>
            <UserTable
              users={courses[courseId].instructors}
              type='instructor'
            />
          </div>
          <h2 className='text-xl font-semibold my-5'>Students:</h2>
          <div>
            <UserTable users={courses[courseId].students} type='student' />
          </div>
        </div>
      )}
    </>
  );
}
