"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; 
import type { NextPage } from 'next';

interface Course {
  id: string;
  title: string;
  description: string;
  organisation: string;
}

interface User {
  id: string;
  name: string;
}

interface Organisation {
  id: string;
  name: string;
}

const Dashboard: NextPage = () => {
  const router = useRouter();
  const courseId = router.query.courseId;

  const [courseDetails, setCourseDetails] = useState<Course | null>(null);
  const [organisation, setOrganisation] = useState<Organisation | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [instructors, setInstructors] = useState<User[]>([]);

  const fetchData = async () => {
    if (!courseId) return;
    try {
      const courseRes = await fetch(`/api/course/${courseId}`);
      const courseData: Course = await courseRes.json();
      setCourseDetails(courseData);

      const orgRes = await fetch(`/api/organisation/${courseData.organisation}`);
      const orgData: Organisation = await orgRes.json();
      setOrganisation(orgData);

      const studentsRes = await fetch(`/api/${courseId}/students`);
      const studentsData: User[] = await studentsRes.json();
      setStudents(studentsData);

      const instructorsRes = await fetch(`/api/${courseId}/instructors`);
      const instructorsData: User[] = await instructorsRes.json();
      setInstructors(instructorsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [courseId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Course Dashboard</h1>
      {courseDetails && (
        <div className="my-4">
          <h2 className="text-xl font-semibold">{courseDetails.title}</h2>
          <p>{courseDetails.description}</p>
          {organisation && <p>Organisation: {organisation.name}</p>}
        </div>
      )}

      <div className="my-4">
        <h2 className="text-lg font-semibold">Students</h2>
        <ul>
          {students.map(student => (
            <li key={student.id} className="list-disc list-inside">{student.name}</li>
          ))}
        </ul>
      </div>

      <div className="my-4">
        <h2 className="text-lg font-semibold">Instructors</h2>
        <ul>
          {instructors.map(instructor => (
            <li key={instructor.id} className="list-disc list-inside">{instructor.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;