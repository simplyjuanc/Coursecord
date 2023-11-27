"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { PiStudentFill } from "react-icons/pi";
import { MdOutlineLiveHelp } from "react-icons/md";
import { VscFeedback } from "react-icons/vsc";
import type { NextPage } from 'next';

interface CourseData {
  name: string;
  introText: string;
}
const StudentHomePage: NextPage = () => {
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        // Fetch the course name
        const responseName = await fetch('/api/courseName'); // Replace with your actual API endpoint
        if (!responseName.ok) {
          throw new Error(`HTTP error! status: ${responseName.status}`);
        }
        const nameData = await responseName.json();

        // Fetch the introduction text
        const responseIntro = await fetch('/api/courseIntro'); // Replace with your actual API endpoint
        if (!responseIntro.ok) {
          throw new Error(`HTTP error! status: ${responseIntro.status}`);
        }
        const introData = await responseIntro.json();

        setCourseData({
          name: nameData.name,
          introText: introData.introText
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCourseData();
  }, []);

  return (
    <>
      <Head>
        <title>{courseData?.name || 'Loading...'}</title>
      </Head>
      <header className="bg-primary text-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">{courseData?.name || 'Coursecord'}</h1>
          <div className="flex space-x-4">
            <Link href="/student-syllabus" passHref>
              <PiStudentFill className="text-3xl cursor-pointer" />
            </Link>
            <Link href="/student-helprequest" passHref>
              <MdOutlineLiveHelp className="text-3xl cursor-pointer" />
            </Link>
            <Link href="/student-feedback" passHref>
              <VscFeedback className="text-3xl cursor-pointer" />
            </Link>
          </div>
        </div>
      </header>
      {/* Main content section */}
      <main>
        {/* ... main content ... */}
      </main>
    </>
  );
};

export default StudentHomePage;