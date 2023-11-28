// pages/studentHomePage.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { PiStudentFill } from 'react-icons/pi';
import { MdOutlineLiveHelp } from 'react-icons/md';
import { VscFeedback } from 'react-icons/vsc';
import type { NextPage } from 'next';
import { BsHouse } from 'react-icons/bs';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Course } from '@/types';

const defaultCourseName = 'Coursecord'; // Default course name
const defaultIntroText =
  'Welcome to the course! This is your starting point to learn and explore.'; // Default introduction text

const StudentHomePage: NextPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        const response = await axios.get(
          `http://localhost:5000/course/${courseId}`
        );

        setCourse(response.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred');
      }
    }

    fetchCourseData();
  }, []);

  return (
    <>
      <section className='max-w-7xl mx-auto py-12 sm:px-6 lg:px-8'>
        <h2 className='text-2xl md:text-4xl font-bold'>
          {!!course && course.title}
        </h2>
        <h3 className='text-2xl md:text-4xl font-bold'>Intro</h3>
        {!course && <p>Loading...</p>}
        {error && <p>Error fetching course information: {error}</p>}
        {!!course && <p className='text-lg md:text-xl'>{course.description}</p>}
      </section>
    </>
  );
};

export default StudentHomePage;
