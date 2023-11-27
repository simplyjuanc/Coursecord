// pages/studentHomePage.tsx
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

const defaultCourseName = 'Coursecord'; // Default course name
const defaultIntroText = 'Welcome to the course! This is your starting point to learn and explore.'; // Default introduction text

const StudentHomePage: NextPage = () => {
  const [courseData, setCourseData] = useState<CourseData>({ name: defaultCourseName, introText: defaultIntroText });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        const responseName = await fetch('/api/courseName'); // Replace with your actual API endpoint
        const nameData = responseName.ok ? await responseName.json() : { name: defaultCourseName };

        const responseIntro = await fetch('/api/courseIntro'); // Replace with your actual API endpoint
        const introData = responseIntro.ok ? await responseIntro.json() : { introText: defaultIntroText };

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
        <title>{courseData.name}</title>
      </Head>
      <header className="bg-primary text-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">{courseData.name}</h1>
          <div className="flex space-x-4">
            <Link href="/student-syllabus">
              <PiStudentFill className="text-3xl cursor-pointer hover:fill-secondary" />
            </Link>
            <Link href="/student-helprequest">
              <MdOutlineLiveHelp className="text-3xl cursor-pointer hover:fill-secondary" />
            </Link>
            <Link href="/student-feedback">
              <VscFeedback className="text-3xl cursor-pointer hover:fill-secondary" />
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-4xl font-bold">Intro</h1>
        {loading && <p>Loading...</p>}
        {error && <p>Error fetching course information: {error}</p>}
        {!loading && !error && (
          <p className="text-lg md:text-xl">{courseData.introText}</p>
        )}
      </main>
    </>
  );
};

export default StudentHomePage;