"use client";

import { Course } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdWavingHand } from "react-icons/md";
import Image from "next/image";
import Spinner from "/public/spinner.svg";
export default function Courses() {
  const [courses, setCourses] = useState<Array<Course> | undefined>(undefined);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`http://localhost:5000/course`);
      setCourses(response.data);
      console.log(response.data);
    };
    fetchData().catch((err) => {
      console.log(err);
    });
  }, []);
  const handleJoinCourse = (id: string) => {
    router.push(`courses/${id}/dashboard`);
  };
  const CourseComponent = (props: { course: Course }) => {
    return (
      <div className="relative bg-white rounded-xl shadow-md hover:bg-gray-50">
        <div className="flex">
          <div className="w-20 h-20 mx-2 mt-2 bg-primary-red bg-opacity-50 text-center rounded-xl">
            <h1 className="my-auto pt-5 text-3xl font-bold text-primary-red">
              {props.course.title[0].toUpperCase()}
            </h1>
          </div>
          <div className="p-2">
            <h2 className="text-2xl">{props.course.title}</h2>
            <h3 className="truncate font-light pb-1">
              {props.course.description}
            </h3>
            <h3>{props.course.students.length} members</h3>
          </div>
        </div>
        <div className="absolute right-0 top-0">
          <button
            onClick={(e) => handleJoinCourse(props.course.id)}
            className="bg-primary-red bg-opacity-50 mt-4 mr-3 rounded-xl text-primary-red px-4 py-2 text-xl font-semibold"
          >
            Join
          </button>
        </div>
      </div>
    );
  };
  return (
    <div className="w-screen">
      <div className="mx-auto w-1/3 pt-40">
        <div className="flex text-6xl font-semibold pb-12">
          <div className="pr-6">
            <MdWavingHand />
          </div>
          <h1 className="">Welcome back</h1>
        </div>
        {courses === undefined ? (
          <div className="text-center mx-auto justify-center pt-32 flex">
            <Image src={Spinner} alt="Spinner" width={75} height={75} />
          </div>
        ) : (
          <ul>
            {courses.map((course, index) => (
              <li className="pt-6" key={index}>
                <CourseComponent course={course} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
