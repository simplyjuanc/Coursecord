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
      className="flex flex-col items-center justify-center min-h-screen relative"
      style={{
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
      }}
    >
      <div className="logo-container absolute top-0 left-1/2 transform -translate-x-1/2 mt-4 w-1/4 md:w-1/6 lg:w-1/8 z-50">
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

      <div className="text-center my-8 z-10">
        <h1 className="text-5xl font-bold gradient-text leading-relaxed">
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
          className="rounded-full shadow-md hover:bg-blue-700 font-bold text-white mt-4 px-6 py-2 z-10"
          style={{ backgroundColor: bubbleColor }}
        >
          Courses
        </button>
      ) : (
        <div
          onClick={() => signIn("google")}
          className="cursor-pointer mt-4 z-10"
        >
          <Image
            src={googleButtonImage}
            alt="Sign in with Google"
            width={200}
            height={50}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 w-full max-w-4xl z-10">
        <div
          className="flex flex-col items-center justify-center p-4 rounded-2xl shadow-lg text-white w-full h-64 md:h-48 transform transition duration-500 ease-in-out hover:scale-105"
          style={{ backgroundColor: bubbleColor }}
        >
          <span className="text-2xl md:text-3xl font-semibold">12880+</span>
          <span>STUDENTS</span>
        </div>
        <div
          className="flex flex-col items-center justify-center p-4 rounded-2xl shadow-lg text-white w-full h-64 md:h-48 transform transition duration-500 ease-in-out hover:scale-105"
          style={{ backgroundColor: bubbleColor }}
        >
          <span className="text-2xl md:text-3xl font-semibold">4580%</span>
          <span>HIRE RATE</span>
        </div>
        <div
          className="flex flex-col items-center justify-center p-4 rounded-2xl shadow-lg text-white w-full h-64 md:h-48 transform transition duration-500 ease-in-out hover:scale-105"
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
