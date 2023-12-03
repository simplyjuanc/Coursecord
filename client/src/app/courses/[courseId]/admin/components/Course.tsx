import { MdOutlinePersonAddAlt } from 'react-icons/md';
import IconButton from '@/components/buttons/iconButton';
import { useEffect, useState } from 'react';
import AddNewUser from './AddNewUser';
import AddExistingUser from './AddExistingUser';
import { Course, IRole, SessionWithToken } from '@/types';
import { getCourseManagementInfo } from '@/services/apiClientService';
import { useSession } from 'next-auth/react';
import CourseTable from './CourseTable';

type CourseManagementProps = {
  courseId: string;
  // roles: IRole[];
};

export default function CourseManagement(props: CourseManagementProps) {
  const { courseId } = props;
  const { data: session } = useSession();

  const [showNewUser, setShowNewUser] = useState(false);
  const [showExistingUser, setShowExistingUser] = useState(false);
  const [course, setCourse] = useState<Course>();
  const roles: IRole[] = [];

  useEffect(() => {
    (async () => {
      const course = await getCourseManagementInfo(
        courseId,
        session as SessionWithToken
      );
      setCourse(course);
    })();
  }, []);

  function showNewUserModal() {
    setShowNewUser(true);
  }

  function showExistingUserModal() {
    setShowExistingUser(true);
  }

  console.log('FUCK');

  return (
    <>
      <div className='flex flex-row gap-4 align-middle justify-around'>
        <h1 className='text-2xl font-bold text-center my-auto drop-shadow-lg'>
          {course?.title} Course{' '}
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
      {course != null && <CourseTable course={course} />}
    </>
  );
}
