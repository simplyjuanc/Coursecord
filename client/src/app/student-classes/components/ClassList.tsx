// CourseList.tsx
"use client";
import React, { useState, useEffect } from 'react';

interface CourseInfo {
  id: string;
  imageUrl: string;
  name: string;
}

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('/course'); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCourses(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>Error fetching courses: {error}</div>;

  return (
    <div className="flex overflow-x-auto py-4 space-x-4">
      {courses.map((course) => (
        <img key={course.id} src={course.imageUrl} alt="Course" className="h-auto md:h-48" /> // Adjust the height as needed
      ))}
    </div>
  );
};

export default CourseList;
