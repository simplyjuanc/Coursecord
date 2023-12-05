'use client';
import React, { useEffect, useState } from 'react';
import { SessionWithToken, User } from '@/types';
import {
  getOrgManagementInfo,
  removeAdminFromOrganisation,
} from '@/services/apiClientService';
import { useSession } from 'next-auth/react';
import CourseManagement from '../../../../components/admin/CourseManagement';
import UserTable from '../../../../components/admin/UserTable';
import { useAppDispatch, useAppSelector } from '@/store';
import { setOrgInfo, removeAdminFromOrg } from '@/store/slices/managementSlice';
import IconButton from '@/components/buttons/iconButton';
import { MdOutlinePersonAddAlt } from 'react-icons/md';
import AddExistingUser from '../../../../components/admin/AddNewUser';

export default function AdminTable() {
  // TODO once we have an org layer, we need to lift this entire component so the admin table is not course-specific
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const orgInfo = useAppSelector((state) => state.management.orgInfo);
  const [course, setCourse] = useState<{ title: string; id: string; }>();
  const [showNewUser, setShowNewUser] = useState(false);
  const [existingUsers, setExistingUsers] = useState<User[]>([]);
  const [role, setRole] = useState<'student' | 'instructor' | 'admin'>(
    'student'
  );

  useEffect(() => {
    (async () => {
      if (!orgInfo) {
        const orgManagementInfo = await getOrgManagementInfo(
          '656b40666c0ea5f66060c942',
          session as SessionWithToken
        );
        if (orgManagementInfo) {
          dispatch(setOrgInfo(orgManagementInfo));
        }
      }
    })();
  }, [dispatch, orgInfo, session]);

  function showNewUserModal(
    role: 'student' | 'instructor' | 'admin',
    users: { [key: string]: User }[]
  ) {
    setShowNewUser(true);
    const existingUsers = users.map((user) => user[role]);
    console.log(users);
    console.log('EXISTING', existingUsers);
    setExistingUsers(existingUsers);
    setRole(role);
  }

  async function removeAdmin(_: string, userId: string) {
    dispatch(removeAdminFromOrg({ userId }));
    const adminDeleted = await removeAdminFromOrganisation(
      '656b40666c0ea5f66060c942',
      userId,
      session as SessionWithToken
    );
  }
// orgInfo?.courses.map((course) => course.id | title),

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    if (!e.target.value || !orgInfo) return;
    const course = orgInfo.courses.find((course) => course.id === e.target.value)
    if (!course) return;
    setCourse(course);
  }
  
  const admins = orgInfo?.admins || [];

  return (
    <section className='flex-grow bg-white h-screen overflow-y-auto'>
      <div className='mt-12 max-w-[60vw] mx-auto'>
        <div className='flex w-full items-center mb-4'>
          <div className='flex justify-between w-full my-8'>
              <h2>
                <span className='text-2xl font-medium'>Organisation Management: </span>
                <span className='text-3xl font-semibold text-primary-1 text-opacity-70'>{orgInfo?.name}</span>
              </h2>
              <div>
                <IconButton
                  icon={<MdOutlinePersonAddAlt />}
                  title='Add New User'
                  onClick={() =>
                    showNewUserModal(
                      'admin',
                      admins.map((admin) => ({ admin: admin.user }))
                    )
                  }
                ></IconButton>
              </div>

          </div>
        </div>

        <div>
          <h3 className='text-xl font-semibold'>Admins:</h3>
          <UserTable removeUser={removeAdmin} users={admins} type='user' />
        </div>
        <div className='flex mx-auto max-w-[20vw] mb-6'>
          <h2 className='text-lg my-auto font-semibold mr-4'>Select a course: </h2>
          <select
            value={course?.title || '' }
            className='border-2 border-none rounded-lg py-2 px-4 text-opacity-70'
            onChange={handleSelect}
          >
            <option value=''>Course...</option>
            {orgInfo && orgInfo.courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        {course && (
          <CourseManagement
            role={role}
            existingUsers={existingUsers}
            showNewUser={showNewUser}
            setShowNewUser={setShowNewUser}
            course={course}
            showNewUserModal={showNewUserModal}
          />
        )}
      </div>
      {showNewUser && (
        <AddExistingUser
          courseId={course!.id}
          setShowExistingUser={setShowNewUser}
          role={role}
          existingUsers={existingUsers}
        />
      )}
    </section>
  );
}
