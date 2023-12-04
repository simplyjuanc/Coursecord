"use client";

import React from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import googleButtonImage from "../../public/login/googleB.png";

const LoginPage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleCourses = () => {
    router.push("/courses");
  };

  const bubbleColor: string = "#1877F2";

  const bubbleStyle = (size: string, left: string, delay: string): React.CSSProperties => ({
    width: size,
    height: size,
    backgroundColor: bubbleColor,
    borderRadius: '50%',
    opacity: 0.6,
    position: 'absolute' as 'absolute',
    bottom: '-150px',
    left: left,
    animation: `rise ${Math.random() * (30 - 15) + 15}s ease-in infinite`,
    animationDelay: delay,
  });

  const bubbles = Array.from({ length: 20 }, (_, index) => ({
    size: `${Math.random() * (120 - 20) + 20}px`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
  }));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative" style={{ backgroundColor: "white" }}>
      {bubbles.map((bubble, index) => (
        <div key={index} style={bubbleStyle(bubble.size, bubble.left, bubble.delay)} />
      ))}

      <style jsx global>{`
        @keyframes rise {
          0% { transform: translateY(100%); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
      `}</style>

      <div className="text-center my-8 z-10">
        <h1 className="text-5xl font-bold" style={{ color: "#58A6FF" }}>Studying Online is now much easier</h1>
        <p className="text-xl" style={{ color: "#C9D1D9" }}>Courserecord will help you learn, wherever and whenever you want</p>
      </div>

      {session ? (
        <button
          onClick={handleCourses}
          className="rounded-full shadow-md hover:bg-blue-700 font-bold text-white mt-4 px-6 py-2 z-10"
          style={{ backgroundColor: bubbleColor }}
        >
          Courses
        </button>
      ) : (
        <div onClick={() => signIn("google")} className="cursor-pointer mt-4 z-10">
          <Image
            src={googleButtonImage}
            alt="Sign in with Google"
            width={200}
            height={50}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 w-full max-w-4xl z-10">
        <div
          className="flex flex-col items-center justify-center p-4 rounded-2xl shadow-lg text-white w-full h-64 md:h-48"
          style={{ backgroundColor: bubbleColor }}
        >
          <span className="text-2xl md:text-3xl font-semibold">12880+</span>
          <span>STUDENTS</span>
        </div>
        <div
          className="flex flex-col items-center justify-center p-4 rounded-2xl shadow-lg text-white w-full h-64 md:h-48"
          style={{ backgroundColor: bubbleColor }}
        >
          <span className="text-2xl md:text-3xl font-semibold">4580%</span>
          <span>HIRE RATE</span>
        </div>
        <div
          className="flex flex-col items-center justify-center p-4 rounded-2xl shadow-lg text-white w-full h-64 md:h-48"
          style={{ backgroundColor: bubbleColor }}
        >
          <span className="text-2xl md:text-3xl font-semibold">35</span>
          <span>INSTRUCTORS</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;