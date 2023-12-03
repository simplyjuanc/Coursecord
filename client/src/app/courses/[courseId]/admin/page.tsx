'use client';
import React, { useEffect, useState } from 'react';
import { Course, DbUser, IRole, OrgInfo, SessionWithToken } from '@/types';
import { getOrgManagementInfo } from '@/services/apiClientService';
import { useSession } from 'next-auth/react';
import CourseManagement from './components/Course';

export default function AdminTable() {
  // TODO once we have an org layer, we need to lift this entire component so the admin table is not course-specific
  // const { courseId } = useParams() as { courseId: string };
  const { data: session } = useSession();

  const [orgInfo, setOrgInfo] = useState<OrgInfo>();
  const [courseId, setCourseId] = useState<string>('');

  useEffect(() => {
    (async () => {
      const orgManagementInfo = await getOrgManagementInfo(
        '656b40666c0ea5f66060c942',
        session as SessionWithToken
      );

      console.log(orgManagementInfo.members);
      if (orgManagementInfo) {
        setOrgInfo(orgManagementInfo);
      }
    })();
  }, []);

  return (
    <section className='flex-grow bg-white'>
      <div className='mt-12 max-w-[60vw] mx-auto'>
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value=''>Select a course</option>
          {orgInfo?.courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
        {courseId != '' && <CourseManagement courseId={courseId} />}
      </div>
    </section>
  );
}

//Old fetch data
// const [courseRes, rolesRes, instructorRes, studentRes] =
//   await Promise.all([
//     fetch(courseUrl),
//     fetch(`http://localhost:5000/656b2fde7b32e44d802e342d/roles`), //TODO: replace with orgId once it's dynamic
//     fetch(instructorUrl),
//     fetch(studentUrl),
//   ]);

// const [course, roles, instructors, students] = await Promise.all([
//   courseRes.json(),
//   rolesRes.json(),
//   instructorRes.json(),
//   studentRes.json(),
// ]);

//old state
// const [course, setCourse] = useState<Course>();
// const [courseUsers, setCourseUsers] = useState<DbUser[]>([]);
// const [instructors, setInstructors] = useState<DbUser[]>();
// const [students, setStudents] = useState<DbUser[]>();
// const [roles, setRoles] = useState<IRole[]>([]);
