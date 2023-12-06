"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { MdWavingHand } from "react-icons/md";
import axios from "axios";
import Image from "next/image";
import Logo from "../../../public/login/new logo.png";
import { Course as CourseType, SessionWithToken } from "@/types";
import { TbLogout2 } from "react-icons/tb";

export default function Courses() {
  const [studentCourses, setStudentCourses] = useState<CourseType[]>([]);
  const [instructorCourses, setInstructorCourses] = useState<CourseType[]>([]);
  const [selectedCourseType, setSelectedCourseType] = useState("student");
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    document.body.style.background = "linear-gradient(1 5deg, #FFFFFF, #C0C0C0)";
    document.body.style.backgroundSize = "100% 100%";
    document.body.style.backgroundRepeat = "no-repeat";

    return () => {
      document.body.style.background = "";
      document.body.style.backgroundSize = "";
    };
  }, []);

  useEffect(() => {
    if (session) {
      const fetchCourses = async () => {
        const sessionWithToken = session as SessionWithToken;
        try {
          const response = await axios.get(
            `http://localhost:5000/user/auth/${sessionWithToken.user.id}/courses`,
            {
              headers: {
                Authorization: sessionWithToken.accessToken,
              },
            }
          );
          const studentCourses = response.data.student_of.map((item: any) => item.course);
          const instructorCourses = response.data.instructor_of.map((item: any) => item.course);
          
          setStudentCourses(studentCourses);
          setInstructorCourses(instructorCourses);
  
          // Set the default selected course type
          if (studentCourses.length > 0 && instructorCourses.length === 0) {
            setSelectedCourseType("student");
          } else if (studentCourses.length === 0 && instructorCourses.length > 0) {
            setSelectedCourseType("instructor");
          } else {
            setSelectedCourseType("student");
          }
        } catch (err) {
          console.error("Error fetching courses:", err);
        }
      };
  
      fetchCourses();
    }
  }, [session]);

  const handleLogout = () => {
    signOut();
  };

  const handleJoinCourse = (id: string) => {
    router.push(`courses/${id}/dashboard`);
  };

  const handleCourseTypeSelection = (type: "student" | "instructor") => {
    setSelectedCourseType(type);
  };
  const CourseComponent = ({ course }: { course: CourseType }) => {
    if (!course || !course.title || !course.id) {
      return null;
    }

    return (
      <div
        onClick={() => handleJoinCourse(course.id)}
        className="relative flex items-center justify-center w-full h-64 p-4 m-4 transition-all duration-200 transform border-2 border-transparent shadow-lg cursor-pointer bg-gradient-to-r from-blue-200 to-blue-300 rounded-xl hover:shadow-lg hover:border-yellow-500 hover:scale-110 sm:w-64 sm:h-64"
      >
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-16 h-16 mx-2 mt-2 text-center bg-opacity-50 bg-myColor3 rounded-xl">
            <h1 className="text-2xl font-bold text-myColor4">
              {course.title && typeof course.title === "string" ? course.title[0].toUpperCase() : ""}
            </h1>
          </div>
          <div className="p-2 text-center">
            <h2 className="text-lg font-bold text-myColor5">{course.title}</h2>
            <h3 className="w-full pb-1 text-sm font-light text-myColor6">
              {course.description}
            </h3>
          </div>
        </div>
      </div>
    );
  };

  const renderNoCoursesAvailable = () => (
    <div className="mt-10 text-xl text-center">
      No courses available.
    </div>
  );

  const renderStudentCourses = () => {
    if (studentCourses.length === 0) {
      return renderNoCoursesAvailable();
    }

    return studentCourses.map((course, index) => (
      <div className="pt-6" key={index}>
        <CourseComponent course={course} />
      </div>
    ));
  };

  const renderInstructorCourses = () => {
    if (instructorCourses.length === 0) {
      return renderNoCoursesAvailable();
    }

    return instructorCourses.map((course, index) => (
      <div className="pt-6" key={index}>
        <CourseComponent course={course} />
      </div>
    ));
  };

  return (
    <div className="relative w-full px-4 pt-10 mx-auto md:w-3/4 lg:w-1/2 md:pt-20 lg:pt-40">
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between p-4">
        <div className="ml-1 rounded-md shadow-lg bg-gradient-to-r from-blue-200 to-blue-300">
          <Image
            src={Logo}
            alt="Company Logo"
            width={200}
            height={200}
            layout="intrinsic"
          />
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 mr-1 text-black transition-all duration-200 transform rounded-md shadow-lg bg-gradient-to-r from-blue-200 to-blue-300 hover:shadow-xl hover:scale-105"
        >
          Logout <TbLogout2 className="ml-2" />
        </button>
      </div>

      <div className="flex justify-center py-6 space-x-4">
        <button
          onClick={() => handleCourseTypeSelection("student")}
          className={`px-4 py-2 rounded-md ${selectedCourseType === "student" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Student Courses
        </button>
        <button
          onClick={() => handleCourseTypeSelection("instructor")}
          className={`px-4 py-2 rounded-md ${selectedCourseType === "instructor" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Instructor Courses
        </button>
      </div>

      <div className="mt-15">
        <div className="flex justify-center py-12 text-4xl font-semibold md:text-5xl lg:text-6xl">
          <div className="pr-6">
            <MdWavingHand className="fill-primary-1" />
          </div>
          <h1>Welcome back</h1>
        </div>
        <div className="flex justify-center overflow-x-scroll hide-scrollbar">
          {selectedCourseType === "student" ? renderStudentCourses() : renderInstructorCourses()}
        </div>
      </div>
    </div>
  );
}
