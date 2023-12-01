"use client";

import React, { useState } from 'react';
import type { NextPage } from 'next';
import { useAppSelector } from '@/store';

const Dashboard: NextPage = () => {
  const [selectedDiv, setSelectedDiv] = useState<string | null>(null);
  const courseInfo = useAppSelector(state => state.course.courseInfo);
  const students = useAppSelector(state => state.course.students);
  const instructors = useAppSelector(state => state.course.instructors);

  const handleDivClick = (divName: string) => {
    setSelectedDiv(prev => (prev === divName ? null : divName));
  };

  const applyBlur = (sectionName: string) => {
    return selectedDiv !== null && selectedDiv !== sectionName ? 'blur' : '';
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md">
      <h1 className="text-2xl font-bold mb-4">Course Dashboard</h1>

      <div className={selectedDiv ? 'blurBackground' : ''}>
        <div className={`my-4 p-4 bg-white rounded-lg border-2 border-primary-gray border-opacity-50 shadow-md ${applyBlur('courseInfo')}`}
             onClick={() => handleDivClick('courseInfo')}>
          {courseInfo && (
            <>
              <h2 className="text-xl font-semibold mb-2">{courseInfo.title}</h2>
              <p className="mb-2">{courseInfo.description}</p>
              <p className="font-medium">Organisation: {courseInfo.organisation}</p>
            </>
          )}
        </div>

        <div className={`my-4 p-4 bg-white rounded-lg shadow-md border-2 border-primary-gray border-opacity-50 ${applyBlur('students')}`}
             onClick={() => handleDivClick('students')}>
          <h2 className="text-lg font-semibold mb-2">Students</h2>
          <ul>
            {students.map((student, index) => (
              <li key={index} className="list-disc list-inside mb-1">{student.name}</li>
            ))}
          </ul>
        </div>

        <div className={`my-4 p-4 bg-white rounded-lg shadow-md border-2 border-primary-gray border-opacity-50  ${applyBlur('instructors')}`}
             onClick={() => handleDivClick('instructors')}>
          <h2 className="text-lg font-semibold mb-2">Instructors</h2>
          <ul>
            {instructors.map((instructor, index) => (
              <li key={index} className="list-disc list-inside mb-1">{instructor.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
