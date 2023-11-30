'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  MdOutlinePersonAddAlt,
  MdOutlineModeEdit,
  MdOutlineRestoreFromTrash,
} from 'react-icons/md';
import IconButton from '@/components/buttons/iconButton';
import { Course, DbUser, Role } from '@/types';
import AddNewUser from './components/AddNewUser';
import AddExistingUser from './components/AddExistingUser';

export default function AdminTable() {
  const courseId = useParams()['courseId'] as string;

  const baseUrl = process.env.API_URL || 'http://localhost:5000';
  const courseUrl = `${baseUrl}/course/${courseId}`;
  const instructorUrl = `${baseUrl}/${courseId}/instructors`;
  const studentUrl = `${baseUrl}/${courseId}/students`;

  const [showNewUser, setShowNewUser] = useState(false);
  const [showExistingUser, setShowExistingUser] = useState(false);
  const [course, setCourse] = useState<Course>();
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
      setRoles(roles);
      setInstructors(instructors);
      setStudents(students);
    })();
  }, [courseUrl, instructorUrl, studentUrl]);

  function showNewUserModal() {
    setShowNewUser(true);
  }

  function showExistingUserModal() {
    setShowExistingUser(true);
  }

  // NEXT:
  // Add edit and delete functionality for each user
  // After that, style the table

  return (
    <section className='mt-12'>
      <div className='flex flex-row gap-4 align-middle justify-evenly'>
        <h1>{course?.title}</h1>
        <div className='flex flex-row w-1/12 gap-2'>
          <IconButton
            icon={<MdOutlinePersonAddAlt />}
            title='Add New User'
            onClick={showNewUserModal}
          ></IconButton>
          <IconButton
            icon={<MdOutlinePersonAddAlt />}
            title='Add Existing User'
            onClick={showExistingUserModal}
          ></IconButton>
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

      {!(course?.instructors || course?.students) ? (
        <p>No users currently assigned!</p>
      ) : (
        <div className='grid grid-cols-7 p-8 mx-auto'>
          <div className='col-span-1 py-1 mb-2 text-lg font-semibold text-center bg-opacity-25 rounded-tl-lg border-1 text bg-primary-red border-primary-gray'>
            Actions
          </div>
          <div className='col-span-2 py-1 mb-2 text-lg font-semibold text-center bg-opacity-25 border-1 text bg-primary-red border-primary-gray'>
            Name
          </div>
          <div className='col-span-2 py-1 mb-2 text-lg font-semibold text-center bg-opacity-25 border-1 text bg-primary-red border-primary-gray'>
            Email
          </div>
          <div className='col-span-2 py-1 mb-2 text-lg font-semibold text-center bg-opacity-25 rounded-tr-lg border-1 text bg-primary-red border-primary-gray'>
            Role
          </div>
          {instructors &&
            instructors.map((instructor) => UserRow(instructor, roles))}
          {students && students.map((student) => UserRow(student, roles))}
        </div>
      )}
    </section>
  );
}

function UserRow(user: DbUser, roles: Role[]): React.JSX.Element {
  const userRoles = user.roles.map((id) => {
    const userRole = roles.find((role) => role.id === id);
    if (!userRole) return;
    return userRole.title[0].toUpperCase() + userRole.title.slice(1);
  });

  function handleEdit() {
    console.log('edit');
  }

  function handleDelete() {
    console.log('delete');
  }

  return (
    // <div key={user.id} className='grid grid-cols-4 col-span-4'>
    <>
      <div className='flex flex-row justify-center col-span-1 gap-2 py-2'>
        <div className='cursor-pointer' onClick={handleEdit}>
          <MdOutlineModeEdit />{' '}
        </div>
        <div className='cursor-pointer' onClick={handleDelete}>
          <MdOutlineRestoreFromTrash />
        </div>
      </div>
      <div className='col-span-2 py-2 text-center'>{user.name}</div>
      <div className='col-span-2 py-2 text-center'>{user.email}</div>
      <div className='col-span-2 py-2 text-center'>
        {userRoles && userRoles.join(', ')}
      </div>
    </>
  );
  {
    /* </div> */
  }
}
