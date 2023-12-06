"use client";

import React from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import googleButtonImage from "../../public/login/googleB.png";
import Logo from "../../public/login/new logo.png";

const LoginPage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleCourses = () => {
    router.push("/courses");
  };

  const bubbleColor: string = "#1877F2";

  const bubbleStyle = (
    size: string,
    left: string,
    delay: string,
    bottom: string
  ): React.CSSProperties => ({
    width: size,
    height: size,
    backgroundColor: bubbleColor,
    borderRadius: "50%",
    opacity: 0.6,
    position: "absolute",
    bottom: bottom,
    left: left,
    animation: `rise ${Math.random() * (20 - 10) + 10}s ease-in infinite`,
    animationDelay: delay,
  });

  const bubbles = Array.from({ length: 20 }, (_, index) => ({
    size: `${Math.random() * (120 - 20) + 20}px`,
    left: `${Math.random() * 100}%`,
    delay: `0s`,
    bottom: "-150px",
  }));

  const initialBubbles = Array.from({ length: 10 }, (_, index) => ({
    size: `${Math.random() * (120 - 20) + 20}px`,
    left: `${Math.random() * 100}%`,
    delay: `0s`,
    bottom: `${Math.random() * 100}vh`,
  }));

  // In your render method
  {
    bubbles.map((bubble, index) => (
      <div
        key={index}
        style={bubbleStyle(
          bubble.size,
          bubble.left,
          bubble.delay,
          bubble.bottom
        )}
      />
    ));
  }
  {
    initialBubbles.map((bubble, index) => (
      <div
        key={index + bubbles.length}
        style={bubbleStyle(
          bubble.size,
          bubble.left,
          bubble.delay,
          bubble.bottom
        )}
      />
    ));
  }
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen"
      style={{
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
      }}
    >
      <div className="absolute top-0 z-50 w-1/4 mt-4 transform -translate-x-1/2 logo-container left-1/2 md:w-1/6 lg:w-1/8">
        <Image
          src={Logo}
          alt="Logo"
          width={500}
          height={500}
          layout="responsive"
        />
      </div>

      {bubbles.map((bubble, index) => (
        <div
          key={index}
          style={{
            ...bubbleStyle(
              bubble.size,
              bubble.left,
              bubble.delay,
              bubble.bottom
            ),
            zIndex: 10,
          }}
        />
      ))}
      {initialBubbles.map((bubble, index) => (
        <div
          key={index + bubbles.length}
          style={{
            ...bubbleStyle(
              bubble.size,
              bubble.left,
              bubble.delay,
              bubble.bottom
            ),
            zIndex: 10,
          }}
        />
      ))}
      <style jsx>{`
        .gradient-text {
          background: linear-gradient(
            90deg,
            #1e90ff,
            #4169e1,
            #0000ff, 
            #4682b4
          );
          background-size: 400% auto;
          -webkit-background-clip: text;
          color: transparent;
          animation: gradient 10s ease infinite;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes rise {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh);
            opacity: 0;
          }
        }
      `}</style>

      <div className="z-10 my-8 text-center">
        <h1 className="text-5xl font-bold leading-relaxed gradient-text">
          Studying Online is now much easier
        </h1>
        <p className="text-xl gradient-text">
          Courserecord will help you learn, wherever and whenever you want
        </p>
      </div>

      <style jsx>{`
        .gradient-text {
          background: linear-gradient(to right, #000033, #000080);
          -webkit-background-clip: text;
          color: transparent;
        }
      `}</style>

      {session ? (
        <button
          onClick={handleCourses}
          className="z-10 py-3 mt-4 text-lg font-bold text-white rounded-full shadow-md px-7 hover:bg-blue-700"
          style={{ backgroundColor: bubbleColor }}
        >
          Courses
        </button>
      ) : (
        <div
          onClick={() => signIn("google")}
          className="z-10 mt-4 cursor-pointer"
        >
          <Image
            src={googleButtonImage}
            alt="Sign in with Google"
            width={300}
            height={75}
          />
        </div>
      )}

      <div className="z-10 grid w-full max-w-4xl grid-cols-1 gap-4 mt-16 md:grid-cols-3">
        <div
          className="flex flex-col items-center justify-center w-full h-64 p-4 text-white transition duration-500 ease-in-out transform shadow-lg rounded-2xl md:h-48 hover:scale-105"
          style={{ backgroundColor: bubbleColor }}
        >
          <span className="text-2xl font-semibold md:text-3xl">12880+</span>
          <span>STUDENTS</span>
        </div>
        <div
          className="flex flex-col items-center justify-center w-full h-64 p-4 text-white transition duration-500 ease-in-out transform shadow-lg rounded-2xl md:h-48 hover:scale-105"
          style={{ backgroundColor: bubbleColor }}
        >
          <span className="text-2xl font-semibold md:text-3xl">4580%</span>
          <span>HIRE RATE</span>
        </div>
        <div
          className="flex flex-col items-center justify-center w-full h-64 p-4 text-white transition duration-500 ease-in-out transform shadow-lg rounded-2xl md:h-48 hover:scale-105"
          style={{ backgroundColor: bubbleColor }}
        >
          <span className="text-2xl font-semibold md:text-3xl">35</span>
          <span>INSTRUCTORS</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
