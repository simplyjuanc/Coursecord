"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import wave from "./login/imgs/Vector 1.png";
import four from "./login/imgs/+4.png";
import hire from "./login/imgs/110.png";
import instructors from "./login/imgs/0 instruc.png";
import wave2 from "./login/imgs/Vector 2.png";
import googleL from "./login/imgs/googleB.png";

export default function Login() {
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);

   let router = useRouter();
  

  useEffect(() => {
      (async function () {
        if (session) {
          try {
            const response = await axios.get(`${process.env.API_URL}/course`);
            const courseId = response.data[0].id;
            router.push(`/course/${courseId}/homepage`);
          } catch (error) {
            console.error(error);
          }
        }
      })();
    // }
  }, [session]);

  return (
    <div className='flex flex-col flex-nowrap min-h-screen justify-around'>
      <div className='relative'>
        <Image
          src={wave}
          alt='Wave Image'
          width={1700}
          height={400}
        />
        <div className='absolute top-1/2 left-0 transform -translate-y-1/2 pl-10'>
          <h1 className='text-white font-bold text-7xl'>
            <span>Studying Online is now</span>
            <br />                   
            much easier
          </h1>
          <p className='text-white text-xl'>
            Coursecord will help you learn, <br />
            wherever and whenever you want
          </p>
          <Image
            src={googleL}
            alt='Google Login'
            width={400}
            height={600}
            onClick={() => signIn('google')}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>
      <div className='flex flex-row flex-nowrap p-20 gap-12 mb-10 -mt-5'>
        <div className='text-center'>
          <Image src={four} alt='+4' width={200} height={200} />
        </div>
        <div className='text-center'>
          <Image src={hire} alt='hire rate' width={200} height={200} />
        </div>
        <div className='text-center'>
          <Image src={instructors} alt='instructor' width={200} height={200} />
        </div>
        <Image
          src='/girl-homepage.png'
          alt='Home Image'  
          width={(774 * 2) / 3}
          height={(1000 * 2) / 3}
          className='absolute bottom-0 right-9'
        />
      </div>
      <div style={{ position: 'relative', bottom: '50px' }}>
        <Image src={wave2} alt='Wave Image' width={1700} height={400} className='mb-5' />
      </div>
    </div>
  );
}