"use client";
import { useEffect, useState } from "react";
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
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    document.body.style.background = "linear-gradient(45deg, #FFFFFF, #C0C0C0)";
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
          setStudentCourses(
            response.data.student_of.map((item: any) => item.course)
          );
          setInstructorCourses(
            response.data.instructor_of.map((item: any) => item.course)
          );
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

  const CourseComponent = ({ course }: { course: CourseType }) => {
    if (!course || !course.title || !course.id) {
      return null;
    }

    const title = course.title;

    return (
      <div
        onClick={() => handleJoinCourse(course.id)}
        className="relative bg-gradient-to-r from-blue-200 to-blue-300 rounded-xl shadow-lg hover:shadow-lg transition-all duration-200 m-4 p-4 border-2 border-transparent hover:border-yellow-500 transform hover:scale-110 cursor-pointer w-full sm:w-64 h-64 sm:h-64 flex items-center justify-center"
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mx-2 mt-2 bg-myColor3 bg-opacity-50 text-center rounded-xl flex items-center justify-center">
            <h1 className="text-2xl font-bold text-myColor4">
              {title && typeof title === "string" ? title[0].toUpperCase() : ""}
            </h1>
          </div>
          <div className="p-2 text-center">
            <h2 className="text-lg font-bold text-myColor5">{title}</h2>
            <h3 className="font-light pb-1 w-full text-sm text-myColor6">
              {course.description}
            </h3>
          </div>
        </div>
      </div>
    );
  };

  const renderStudentCourses = () => {
    if (studentCourses.length === 0) {
      return null;
    }

    return studentCourses.map((course, index) => (
      <div className="pt-6" key={index}>
        <CourseComponent course={course} />
      </div>
    ));
  };

  const renderInstructorCourses = () => {
    if (instructorCourses.length === 0) {
      return null;
    }

    return instructorCourses.map((course, index) => (
      <div className="pt-6" key={index}>
        <CourseComponent course={course} />
      </div>
    ));
  };

  return (
    <div className="relative w-full md:w-3/4 lg:w-1/2 mx-auto pt-10 md:pt-20 lg:pt-40 px-4">
      <div className="fixed top-0 right-0 left-0 p-4 flex justify-between items-center">
        <div className="ml-1 bg-gradient-to-r from-blue-200 to-blue-300 rounded-md shadow-lg">
          {" "}
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
  className="mr-1 bg-gradient-to-r from-blue-200 to-blue-300 text-black rounded-md px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center"
>
  Logout <TbLogout2 className="ml-2" />
</button>
      </div>
      <div className="mt-15">
        <div className="flex text-4xl md:text-5xl lg:text-6xl font-semibold pb-12">
          <div className="pr-6">
            <MdWavingHand className="fill-primary-1" />
          </div>
          <h1>Welcome back</h1>
        </div>
        {studentCourses.length > 0 && (
          <>
            <h2 className="text-3xl font-semibold pb-4">Student Courses:</h2>
            <div className="flex overflow-x-scroll hide-scrollbar">
              {renderStudentCourses()}
            </div>
          </>
        )}
        {instructorCourses.length > 0 && (
          <>
            <h2 className="text-3xl font-semibold pb-4 pt-10">
              Instructor Courses:
            </h2>
            <div className="flex overflow-x-scroll hide-scrollbar">
              {renderInstructorCourses()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
