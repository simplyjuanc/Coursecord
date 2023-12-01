'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MdOutlinePersonAddAlt } from 'react-icons/md';
import IconButton from '@/components/buttons/iconButton';
import { Course, DbUser, Role } from '@/types';
import AddNewUser from './components/AddNewUser';
import AddExistingUser from './components/AddExistingUser';
import UserRow from './components/UserRow';

export default function AdminTable() {
  // TODO once we have an org layer, we need to lift this entire component so the admin table is not course-specific
  const courseId = useParams()['courseId'] as string;

  const baseUrl = process.env.API_URL || 'http://localhost:5000';
  const courseUrl = `${baseUrl}/course/${courseId}`;
  const instructorUrl = `${baseUrl}/${courseId}/instructors`;
  const studentUrl = `${baseUrl}/${courseId}/students`;

  const [showNewUser, setShowNewUser] = useState(false);
  const [showExistingUser, setShowExistingUser] = useState(false);
  const [course, setCourse] = useState<Course>();
  const [courseUsers, setCourseUsers] = useState<DbUser[]>([]);
  const [instructors, setInstructors] = useState<DbUser[]>();
  const [students, setStudents] = useState<DbUser[]>();
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    (async () => {
      const [courseRes, rolesRes, instructorRes, studentRes] =
        await Promise.all([
          fetch(courseUrl),
          fetch(`http://localhost:5000/6565c3bdf515f6ec9392f30e/roles`), //TODO: replace with orgId once it's dynamic
          fetch(instructorUrl),
          fetch(studentUrl),
        ]);

      const [course, roles, instructors, students] = await Promise.all([
        courseRes.json(),
        rolesRes.json(),
        instructorRes.json(),
        studentRes.json(),
      ]);

      setCourse(course);
      setCourseUsers([...(instructors || []), ...(students || [])]);
      setRoles(roles);
    })();
  }, [courseUrl, instructorUrl, studentUrl]);

  function showNewUserModal() {
    setShowNewUser(true);
  }

  function showExistingUserModal() {
    setShowExistingUser(true);
  }

  return (
    <section className='flex-grow bg-white'>
      <div className='mt-12 max-w-[60vw] mx-auto'>
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

        {!courseUsers ? (
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
                {courseUsers &&
                  courseUsers.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      roles={roles}
                      courseId={courseId}
                    />
                  ))}
              </div>
              <div className='col-span-7 rounded-b-lg h-2 bg-white -mt-1'></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
