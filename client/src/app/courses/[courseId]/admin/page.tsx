'use client';
import React, { useEffect, useState } from 'react';
import { Course, DbUser, IRole, OrgInfo, SessionWithToken } from '@/types';
import { getOrgManagementInfo } from '@/services/apiClientService';
import { useSession } from 'next-auth/react';
import CourseManagement from './components/Course';
import UserTable from './components/UserTable';
import { useAppDispatch, useAppSelector } from '@/store';
import { setOrgInfo } from '@/store/slices/managementSlice';

export default function AdminTable() {
  // TODO once we have an org layer, we need to lift this entire component so the admin table is not course-specific
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const orgInfo = useAppSelector((state) => state.management.orgInfo);
  const [courseId, setCourseId] = useState<string>('');

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

  const admins = orgInfo?.members || [];

  return (
    <section className='flex-grow bg-white h-screen overflow-y-auto'>
      <div className='mt-12 max-w-[60vw] mx-auto'>
        <div className='flex items-center mb-4'>
          <h2 className='text-xl font-semibold mr-6'>
            Organisation Management:
          </h2>
          <h2 className='text-2xl font-semibold'>{orgInfo?.name}</h2>
        </div>
        <div className=''>
          <h3 className='text-xl font-semibold'>Admins:</h3>
          <UserTable users={admins} type='user' />
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
        {courseId != '' && <CourseManagement courseId={courseId} />}
      </div>
    </section>
  );
}
