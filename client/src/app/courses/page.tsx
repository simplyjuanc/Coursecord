"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import { useSession } from "next-auth/react";
import { MdWavingHand } from "react-icons/md";
import axios from "axios";
import { Course as CourseType, SessionWithToken } from "@/types";

export default function Courses() {
  const [courses, setCourses] = useState<CourseType | CourseType[]>([]);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      const fetchCourses = async () => {
        const sessionWithToken = session as SessionWithToken;
        try {
          const response = await axios.get(
            `http://localhost:5000/user/auth/${sessionWithToken.user.id}/courses`,
            {
              headers: {
                Authorization: sessionWithToken.accessToken
              },
            }
          );
          setCourses(response.data); // {student_of: [course: {title}]}
        } catch (err) {
          console.error("Error fetching courses:", err);
        }
      };

      fetchCourses();
    }
  }, [session]);

  const handleJoinCourse = (id: string) => {
    router.push(`courses/${id}/dashboard`);
  };

  const CourseComponent = ({ course }: { course: CourseType }) => {
    const title = course.title || "Untitled Course";
    const studentCount = Array.isArray(course.students) ? course.students.length : 0;

    return (
      <div className="relative bg-white rounded-xl shadow-md hover:bg-gray-50 transition duration-200 ease-in-out">
        <div className="flex">
          <div className="w-20 h-15 mx-2 mt-2 bg-primary-1 bg-opacity-50 text-center rounded-xl">
            <h1 className="my-auto pt-5 text-2xl font-bold text-primary-1">
              {title[0].toUpperCase()}
            </h1>
          </div>
          <div className="p-2">
            <h2 className="text-2xl">{title}</h2>
            <h3 className="truncate font-light pb-1 w-1/2">
              {course.description}
            </h3>
            <h3>{studentCount} members</h3>
          </div>
        </div>
        <div className="absolute right-0 top-0">
          <button
            onClick={() => handleJoinCourse(course.id)}
            className="bg-primary-1 bg-opacity-50 mt-4 mr-3 rounded-xl text-primary-1 px-4 py-2 text-xl font-semibold transition duration-200 ease-in-out transform hover:scale-105"
          >
            Join
          </button>
        </div>
      </div>
    );
  };

  const renderCourses = () => {
    if (!courses || (Array.isArray(courses) && courses.length === 0)) {
      return <p>No courses available</p>;
    }

    if (!Array.isArray(courses)) {
      return <CourseComponent course={courses} />;
    }

    return courses.map((course, index) => (
      <li className="pt-6" key={index}>
        <CourseComponent course={course} />
      </li>
    ));
  };

  return (
    <div className="w-full md:w-3/4 lg:w-1/2 mx-auto pt-10 md:pt-20 lg:pt-40 px-4">
      <div className="flex text-4xl md:text-5xl lg:text-6xl font-semibold pb-12">
        <div className="pr-6">
          <MdWavingHand />
        </div>
        <h1>Welcome back</h1>
      </div>
      <ul>
        {renderCourses()}
      </ul>
    </div>
  );
}