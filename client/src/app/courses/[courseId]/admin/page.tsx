'use client';
import IconButton from '@/components/buttons/iconButton';
import { useParams, usePathname } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';
import { MdOutlinePersonAddAlt } from 'react-icons/md';
import AddNewUser from './AddNewUser';
import { Course, DbUser } from '@/@types';
import AddExistingUser from './AddExistingUser';

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
  // const [roles, setRoles] = useState<string[]>();

  useEffect(() => {
    fetch(courseUrl)
      .then((res) => res.json())
      .then((data) => setCourse(data))
      .catch((error) => console.error(error));
  }, [courseUrl]);

  useEffect(() => {
    fetch(instructorUrl)
      .then((res) => res.json())
      .then((data) => setInstructors(data))
      .catch((error) => console.error(error));

    fetch(studentUrl)
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error(error));
  }, [instructorUrl, studentUrl]);

  function addNewUser() {
    setShowNewUser(true);
  }

  function addExistingUser() {
    setShowExistingUser(true);
  }
  
  // NEXT: 
  // Set up the AddExistingUser components
  // Add button to remove user from course
  // Add button to change user role 

  return (
    <section className='mt-12'>
      <div className='flex flex-row justify-evenly gap-4 align-middle'>
        <h1>{course?.title}</h1>
        <div className='flex flex-row gap-2 w-1/12'>
        <IconButton
          icon={<MdOutlinePersonAddAlt />}
          title='Add Existing User'
          onClick={addNewUser}
        ></IconButton>
        <IconButton
          icon={<MdOutlinePersonAddAlt />}
          title='Add New User'
          onClick={addExistingUser}
        ></IconButton>

        </div>
      </div>

      {showNewUser && <AddNewUser courseId={courseId} setShowNewUser={setShowNewUser} />}
      {showExistingUser && <AddExistingUser courseId={courseId} setShowExistingUser={setShowExistingUser} />}


      {(course?.instructors || course?.students) && (
        <div className='grid grid-cols-3 p-8 gap-y-1 w-1/2 mx-auto'>
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
