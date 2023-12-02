'use client';

import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useAppDispatch, useAppSelector } from '@/store';
import { useParams } from 'next/navigation';
import { getCourseData } from '@/services/apiClientService';
import { setCourseInfo } from '@/store/slices/courseSlice';

const Dashboard: NextPage = () => {
  const { courseId } = useParams() as { courseId: string };
  const dispatch = useAppDispatch();
  const [selectedDiv, setSelectedDiv] = useState<string | null>(null);
  const courseInfo = useAppSelector((state) => state.course.courseInfo);

  console.log(courseInfo);

  useEffect(() => {
    if (courseInfo) return;

    (async function () {
      const courseData = await getCourseData(courseId);
      dispatch(setCourseInfo({ info: courseData }));
    })();
  }, []);

  const handleDivClick = (divName: string) => {
    setSelectedDiv((prev) => (prev === divName ? null : divName));
  };

  const applyBlur = (sectionName: string) => {
    return selectedDiv !== null && selectedDiv !== sectionName ? 'blur' : '';
  };

  return (
    <div className='container mx-auto p-4 bg-white shadow-md'>
      <h1 className='text-2xl font-bold mb-4'>Course Dashboard</h1>

      <div className={selectedDiv ? 'blurBackground' : ''}>
        <div
          className={`my-4 p-4 bg-white rounded-lg border-2 border-primary-gray border-opacity-50 shadow-md ${applyBlur(
            'courseInfo'
          )}`}
          onClick={() => handleDivClick('courseInfo')}
        >
          {courseInfo && (
            <>
              <h2 className='text-xl font-semibold mb-2'>{courseInfo.title}</h2>
              <p className='mb-2'>{courseInfo.description}</p>
              <p className='font-medium'>
                Organisation: {courseInfo.organisation.name}
              </p>
            </>
          )}
        </div>

        <div
          className={`my-4 p-4 bg-white rounded-lg shadow-md border-2 border-primary-gray border-opacity-50 ${applyBlur(
            'students'
          )}`}
          onClick={() => handleDivClick('students')}
        >
          <h2 className='text-lg font-semibold mb-2'>Students</h2>
          <ul>
            {courseInfo && courseInfo.students.map((student, index) => (
              <li key={index} className='list-disc list-inside mb-1'>
                {student.student.name}
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`my-4 p-4 bg-white rounded-lg shadow-md border-2 border-primary-gray border-opacity-50  ${applyBlur(
            'instructors'
          )}`}
          onClick={() => handleDivClick('instructors')}
        >
          <h2 className='text-lg font-semibold mb-2'>Instructors</h2>
          <ul>
            {courseInfo && courseInfo.instructors.map((instructor, index) => (
              <li key={index} className='list-disc list-inside mb-1'>
                {instructor.instructor.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
