'use client';
import IconButton from '@/components/buttons/iconButton';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { MdOutlinePersonAddAlt } from 'react-icons/md';
import AddNewUser from './components/AddNewUser';
import { Course, DbUser, Role } from '@/@types';
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

  function addNewUser() {
    setShowNewUser(true);
  }

  function addExistingUser() {
    setShowExistingUser(true);
  }

  // NEXT:
  // Add button to remove user from course
  // Add button to change user role

  return (
    <section className='mt-12'>
      <div className='flex flex-row gap-4 align-middle justify-evenly'>
        <h1>{course?.title}</h1>
        <div className='flex flex-row w-1/12 gap-2'>
          <IconButton
            icon={<MdOutlinePersonAddAlt />}
            title='Add New User'
            onClick={addNewUser}
          ></IconButton>
          <IconButton
            icon={<MdOutlinePersonAddAlt />}
            title='Add Existing User'
            onClick={addExistingUser}
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

      {(course?.instructors || course?.students) && (
        <div className='grid w-1/2 grid-cols-3 p-8 mx-auto gap-y-1'>
          <div className='mb-2'>Name</div>
          <div className='mb-2'>Email</div>
          <div className='mb-2'>Role</div>
          {instructors && instructors.map((instructor) => UserRow(instructor))}
          {students && students.map((student) => UserRow(student))}
        </div>
      )}
    </section>
  );
}

function UserRow(user: DbUser): React.JSX.Element {
  return (
    <div key={user.id} className='grid grid-cols-3 col-span-3'>
      <div>{user.name}</div>
      <div>{user.email}</div>
      <div>{user.roles.join(', ')}</div>
    </div>
  );
}
