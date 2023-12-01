"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import type { NextPage } from 'next';
import { useAppSelector } from '@/store';
import { stat } from 'fs';

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
  const courseInfo = useAppSelector(state => state.course.courseInfo);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Course Dashboard</h1>
      {courseInfo && (
        <div className="my-4">
          <h2 className="text-xl font-semibold">{courseInfo.title}</h2>
          <p>{courseInfo.description}</p>
          <p>Organisation: {courseInfo.organisation}</p>
        </div>
      )}

      <div className="my-4">
        <h2 className="text-lg font-semibold">Students</h2>
        <ul>
          {courseInfo.students.map(student => (
            <li key={student.id} className="list-disc list-inside">{student.name}</li>
          ))}
        </ul>
      </div>

      <div className="my-4">
        <h2 className="text-lg font-semibold">Instructors</h2>
        <ul>
          {courseInfo.instructors.map(instructor => (
            <li key={instructor.id} className="list-disc list-inside">{instructor.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;