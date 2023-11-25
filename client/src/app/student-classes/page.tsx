// First line should be the 'use client' directive
'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ClassCard from './components/ClassCard'; // Adjusted import path

interface ClassInfo {
  id: string;
  name: string;
  imageUrl: string;
}

const Page: React.FC = () => {
  const [classes, setClasses] = useState<ClassInfo[]>([]);

  useEffect(() => {
    async function fetchClasses() {
      // Replace 'api-endpoint' with your actual API endpoint
      const response = await fetch('/course');
      const data = await response.json();
      setClasses(data);
    }

    fetchClasses();
  }, []);

  return (
    <>
      <Head>
        <title>Your Classes</title>
      </Head>
      <div className="bg-red-600 text-white text-center py-4">
        <h1 className="text-3xl font-bold">Coursecord</h1>
      </div>
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold mb-4">Your classes:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((classInfo) => (
            <ClassCard key={classInfo.id} name={classInfo.name} imageUrl={classInfo.imageUrl} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
