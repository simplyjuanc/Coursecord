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
      <div className='flex flex-row gap-4 align-middle justify-around'>
        <h1 className='text-2xl font-bold text-center my-auto'>{course?.title} Course </h1>
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
            instructors.map((instructor) => (
              <UserRow key={instructor.id} user={instructor} roles={roles} courseId={courseId}/>
            ))}
          {students &&
            students.map((student) => (
              <UserRow key={student.id} user={student} roles={roles} courseId={courseId}/>
            ))}
        </div>
      )}
    </section>
  );
}
