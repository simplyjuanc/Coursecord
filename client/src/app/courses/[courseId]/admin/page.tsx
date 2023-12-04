'use client';
import React, { useEffect, useState } from 'react';
import { SessionWithToken, User } from '@/types';
import {
  getOrgManagementInfo,
  removeAdminFromOrganisation,
} from '@/services/apiClientService';
import { useSession } from 'next-auth/react';
import CourseManagement from './components/Course';
import UserTable from './components/UserTable';
import { useAppDispatch, useAppSelector } from '@/store';
import { setOrgInfo, removeAdminFromOrg } from '@/store/slices/managementSlice';
import IconButton from '@/components/buttons/iconButton';
import { MdOutlinePersonAddAlt } from 'react-icons/md';
import AddExistingUser from './components/AddNewUser';

export default function AdminTable() {
  // TODO once we have an org layer, we need to lift this entire component so the admin table is not course-specific
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const orgInfo = useAppSelector((state) => state.management.orgInfo);
  const [courseId, setCourseId] = useState<string>('');
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
  }, []);

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

  const admins = orgInfo?.admins || [];

  return (
    <section className='flex-grow bg-white h-screen overflow-y-auto'>
    <section className='flex-grow bg-white h-screen overflow-y-auto'>
      <div className='mt-12 max-w-[60vw] mx-auto'>
        <div className='flex w-full items-center mb-4'>
          <div className='flex justify-between'>
            <div className='flex items-center'>
              <h2 className='text-xl font-semibold mr-6'>
                Organisation Management:
              </h2>
              <h2 className='text-2xl font-semibold'>{orgInfo?.name}</h2>
            </div>

            {admins && (
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
            )}
          </div>
        </div>
        <div className=''>
          <h3 className='text-xl font-semibold'>Admins:</h3>
          <UserTable removeUser={removeAdmin} users={admins} type='user' />
        </div>
        <div className='flex mx-auto max-w-[20vw] mb-6'>
          <h2 className='text-lg font-semibold mr-4'>Select a course: </h2>
          <select
            value={courseId}
            className='border-2 border-primary-2 border-opacity-40 rounded-lg'
            onChange={(e) => setCourseId(e.target.value)}
          >
            <option value=''>...</option>
            {orgInfo?.courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        {courseId != '' && (
          <CourseManagement
            role={role}
            existingUsers={existingUsers}
            showNewUser={showNewUser}
            setShowNewUser={setShowNewUser}
            courseId={courseId}
            showNewUserModal={showNewUserModal}
          />
        )}
      </div>
      {showNewUser && (
        <AddExistingUser
          courseId={courseId}
          setShowExistingUser={setShowNewUser}
          role={role}
          existingUsers={existingUsers}
        />
      )}
    </section>
  );
}
