"use client";

import React from 'react';
import Image from 'next/image';
import wave from "./imgs/Vector 1.png"
import four from "./imgs/+4.png"
import hire from "./imgs/110.png"
import instructors from "./imgs/0 instruc.png"
import wave2 from "./imgs/Vector 2.png"
import googleL from "./imgs/googleB.png" 
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Login() {
  const { data: session, status } = useSession();
  console.log(session);
  return (
    <div className='flex flex-col flex-nowrap min-h-screen justify-around'>
      <div className='relative'>
        <Image
          src={wave}
          alt='Wave Image'
          width={1700}
          height={400}
        ></Image>
        <div className='absolute top-1/2 left-0 transform -translate-y-1/2 pl-10'>
          <h1 className='text-white font-bold text-7xl'>
            <span>
              Studying Online is now
            </span>
            <br />
            much easier
          </h1> 
          <p className='text-white text-xl'>
            Coursecord will help you learn, <br />
            wherever and whenever you want
          </p>
          <Image src={googleL} alt='Google Login' width={400} height={600}  /> {/* Added Google Login Image */}
        </div>
      </div>
      <div
        className='g-signin2 m-8 p-2 text-white'
        data-onsuccess='onSignIn'
        onClick={() => {
          session ? signOut() : signIn();
        }}
      >
        {session ? 'Logout' : 'Login'}
      </div>
      <div className='flex flex-row flex-nowrap p-20 gap-12 mb-10 -mt-5'>
        <div className='text-center'>
          <Image src={four} alt='+4' width={200} height={200} ></Image>
        </div>
        <div className='text-center'>
          <Image src={hire} alt='hire rate' width={200} height={200} ></Image>
        </div>
        <div className='text-center'>
          <Image src={instructors} alt='hire rate' width={200} height={200} ></Image>
        </div>
        <Image
          src='/girl-homepage.png'
          alt='Home Image'  
          width={(774 * 2) / 3} //TODO: how to improve this?
          height={(1000 * 2) / 3}
          className='absolute bottom-0 right-9'
        ></Image>
      </div>
      <div style={{ position: 'relative', bottom: '50px' }}>
        <Image src={wave2} alt='Wave Image' width={1700} height={400} className='mb-5'></Image>
      </div>
    </div>
  );
}