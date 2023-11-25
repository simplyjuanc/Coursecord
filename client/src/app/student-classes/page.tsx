// Page.tsx
import React from 'react';
import Head from 'next/head';
import CourseList from './components/ClassList'; // Ensure this is the correct path to your CourseList component

const Page: React.FC = () => {
  return (
    <>
      <Head>
        <title>Your Classes</title>
      </Head>
      <div className="bg-primary text-white text-center py-6">
        <h1 className="text-3xl font-bold">Coursecord</h1>
      </div>
      <div className="container mx-auto px-10 py-12">
        <h2 className="text-5xl font-semibold mb-6">Your classes:</h2>
        <CourseList />
      </div>
    </>
  );
};

export default Page;
