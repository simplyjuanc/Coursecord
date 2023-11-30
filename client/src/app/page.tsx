"use client";

import React from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Corrected 'next/navigation' to 'next/router'

import wave from "/public/login/Vector 1.png";
import googleL from "/public/login/googleB.png";
import logo from "/public/login/logo.png";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleCourses = () => {
    router.push("/courses");
  };

  return (
    <div className="flex flex-col flex-nowrap min-h-screen justify-around">
      <div className="relative">
        {/* Logo positioned at the top left */}
        <div className="absolute top-0 left-0 z-10">
          <Image src={logo} alt="Logo" width={300} height={200} />
        </div>

        <Image src={wave} alt="Wave Image" width={1700} height={400} />
        
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 pl-10">
          <h1 className="text-white font-bold text-7xl">
            <span>Studying Online is now</span>
            <br />
            much easier
          </h1>
          <p className="text-white text-xl">
            Coursecord will help you learn, <br />
            wherever and whenever you want
          </p>
          {session ? (
            <div className="pt-6">
              <button
                onClick={handleCourses}
                className="bg-white hover:bg-gray-100 rounded-xl text-2xl text-primary-red px-6 py-3"
              >
                Courses
              </button>
            </div>
          ) : (
            <Image
              src={googleL}
              alt="Google Login"
              width={400}
              height={600}
              onClick={() => signIn("google")}
              style={{ cursor: "pointer" }}
            />
          )}
        </div>
      </div>
      <div className="flex flex-row flex-nowrap p-20 gap-12 mb-10 -mt-5">
        <Image
          src="/girl-homepage.png"
          alt="Home Image"
          width={(774 * 2) / 3}
          height={(1000 * 2) / 3}
          className="absolute bottom-0 right-9"
        />
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-5">
        <div className="bg-white rounded-lg shadow-lg p-8" style={{ width: '300px', height: '150px' }}>
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-red-600 font-bold text-4xl">4+</span>
            <p className="text-gray-800 text-lg">STUDENTS</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8" style={{ width: '300px', height: '150px' }}>
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-red-600 font-bold text-4xl">110%</span>
            <p className="text-gray-800 text-lg">HIRE RATE</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8" style={{ width: '300px', height: '150px' }}>
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-red-600 font-bold text-4xl">0</span>
            <p className="text-gray-800 text-lg">INSTRUCTORS</p>
          </div>
        </div>
      </div>
    </div>
  );
}
