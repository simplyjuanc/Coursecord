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
    <div className='flex gap-8 justify-between w-full mx-12'>
      <div className='container  py-12 px-16 bg-white shadow-lg shadow-slate-400 my-8 rounded-xl w-3/5'>
        <h1 className='text-3xl font-bold mb-8'>{courseInfo?.title} Home</h1>

        <div className={selectedDiv ? 'blurBackground' : ''}>
          <div
            className={`my-4 p-4 bg-white rounded-lg border-2 border-primary-2 border-opacity-50 shadow-md ${applyBlur(
              'courseInfo'
            )}`}
            onClick={() => handleDivClick('courseInfo')}
          >
            {courseInfo && (
              <>
                <h2 className='text-xl font-semibold text-primary-1 text-opacity-80'>
                  {courseInfo.title}
                </h2>
                <p className='text-sm italic mb-2'>
                  by {courseInfo.organisation.name}
                </p>
                <p className='mb-2'>{courseInfo.description}</p>
              </>
            )}
          </div>

          <div
            className={`my-4 p-4 bg-white rounded-lg shadow-md border-2 border-primary-2 border-opacity-50  ${applyBlur(
              'instructors'
            )} `}
            onClick={() => handleDivClick('instructors')}
          >
            <h2 className='text-lg font-semibold mb-2  text-primary-1 text-opacity-80'>
              Instructors
            </h2>
            <div className='flex gap-4 justify-center'>
              {courseInfo &&
                courseInfo.instructors.map((instructor) => (
                  <div
                    key={instructor.instructor.id}
                    className='list-none list-inside mb-1 border-2 p-3 rounded-md flex align-middle justify-center gap-2'
                  >
                    <div className='relative rounded-full flex place-content-center overflow-hidden'>
                      <Image
                        src={instructor.instructor.image}
                        alt={instructor.instructor.name}
                        width={32}
                        height={32}
                      />
                    </div>
                    <p className='my-auto font-semibold'>{instructor.instructor.name}</p>
                  </div>
                ))}
            </div>
          </div>

          <div
            className={`my-4 p-4 bg-white rounded-lg shadow-md border-2 border-primary-2 border-opacity-50 ${applyBlur(
              'students'
            )}`}
            onClick={() => handleDivClick('students')}
          >
            <h2 className='text-lg font-semibold mb-2  text-primary-1 text-opacity-80'>
              Students
            </h2>
            <ul>
              {courseInfo &&
                courseInfo.students.map((student, index) => (
                  <li key={index} className='list-disc list-inside mb-1'>
                    {student.student.name}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
      <div className='container relative py-12 px-16 bg-white shadow-lg shadow-slate-400 my-8 rounded-2xl w-2/5 overflow-hidden'>
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
