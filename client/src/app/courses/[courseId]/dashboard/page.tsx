'use client';

import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useAppDispatch, useAppSelector } from '@/store';
import { useParams } from 'next/navigation';
import { getCourseData } from '@/services/apiClientService';
import { setCourseInfo } from '@/store/slices/courseSlice';
import Image from 'next/image';

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
    <div className='flex justify-between w-full gap-8 mx-12'>
      <div className='container w-3/5 px-16 py-12 my-8 bg-white shadow-lg shadow-slate-400 rounded-xl'>
        <h1 className='mb-8 text-3xl font-bold'>{courseInfo?.title} Home</h1>

        <div className={selectedDiv ? 'blurBackground' : ''}>
          <div
            className={`my-4 p-4 bg-white rounded-lg border-2 border-primary-2 border-opacity-50 shadow-md hover:border-primary-1 ${applyBlur(
              'courseInfo'
            )}`}
            onClick={() => handleDivClick('courseInfo')}
          >
            {courseInfo && (
              <>
                <h2 className='text-xl font-semibold text-primary-1 text-opacity-80'>
                  {courseInfo.title}
                </h2>
                <p className='mb-2 text-sm italic'>
                  by {courseInfo.organisation.name}
                </p>
                <p className='mb-2'>{courseInfo.description}</p>
              </>
            )}
          </div>

          <div
            className={`my-4 p-4 bg-white rounded-lg shadow-md border-2 border-primary-2 border-opacity-50  hover:border-primary-1   ${applyBlur(
              'instructors'
            )} `}
            onClick={() => handleDivClick('instructors')}
          >
            <h2 className='mb-2 text-lg font-semibold text-primary-1 text-opacity-80'>
              Instructors
            </h2>
            <div className='flex justify-center gap-4'>
              {courseInfo &&
                courseInfo.instructors.map((instructor) => (
                  <div
                    key={instructor.instructor.id}
                    className='flex justify-center gap-2 p-3 mb-1 align-middle list-none list-inside border-2 rounded-md'
                  >
                    <div className='relative p-3 overflow-hidden rounded-full'>
                      <Image
                        src={instructor.instructor.image}
                        alt={instructor.instructor.name}
                        fill={true}
                      />
                    </div>
                    <p className='my-auto font-semibold'>{instructor.instructor.name}</p>
                  </div>
                ))}
            </div>
          </div>

          <div
            className={`my-4 p-4 bg-white rounded-lg shadow-md border-2 border-primary-2 border-opacity-50  hover:border-primary-1  ${applyBlur(
              'students'
            )}`}
            onClick={() => handleDivClick('students')}
          >
            <h2 className='mb-2 text-lg font-semibold text-primary-1 text-opacity-80'>
              Students
            </h2>
            <ul>
              {courseInfo &&
                courseInfo.students.map((student, index) => (
                  <li key={index} className='mb-1 list-disc list-inside'>
                    {student.student.name}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
      <div className='container relative w-2/5 px-16 py-12 my-8 overflow-hidden bg-white shadow-lg shadow-slate-400 rounded-2xl'>
        <Image
          src={'/dashboard-girl-macbook.jpg'}
          alt={'Girl with Macbook'}
          layout='fill'
          objectFit='cover'
        />
      </div>
    </div>
  );
};

export default Dashboard;
