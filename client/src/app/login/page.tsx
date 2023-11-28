'use client';
import React from 'react';
import Image from 'next/image';
// import bg from 'client/public/login-bg.svg';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Login() {
  const { data: session, status } = useSession();
  console.log(session);
  return (
    <div className='flex flex-col flex-nowrap h-screen justify-around'>
      <div className='bg-primary rounded-b-full h-1/2 p-8 mb-auto'>
        <h1 className='text-white'>
          <span className='text-secondary font-bold text-4xl'>
            Studying Online
          </span>
          is now much easier
        </h1>
        <p className='text-white'>
          Coursecord will help you learn, <br />
          wherever and whenever you want
        </p>
        <div
          className='g-signin2 m-8 p-2 text-white'
          data-onsuccess='onSignIn'
          onClick={() => {
            session ? signOut() : signIn();
          }}
        >
          {session ? 'Logout' : 'Login'}
        </div>
      </div>
      <div className='flex flex-row flex-nowrap p-16 gap-12'>
        <div className='text-center'>
          <p className='bg-gradient-to-r from-primary-lighter to-primary bg-clip-text text-transparent text-8xl'>
            4+
          </p>
          <p className='text-slate-950 text-opacity-80'>Students</p>
        </div>
        <div className='text-center'>
          <p className='bg-gradient-to-r from-primary-lighter to-primary bg-clip-text text-transparent text-8xl'>
            110%
          </p>
          <p className='text-slate-950 text-opacity-80'>success rate</p>
        </div>
        <div className='text-center'>
          <p className='bg-gradient-to-r from-primary-lighter to-primary bg-clip-text text-transparent text-8xl'>
            1
          </p>
          <p className='text-slate-950 text-opacity-80'>instructor</p>
        </div>
        <Image
          src='/girl-homepage.png'
          alt='Home Image'
          width={(774 * 2) / 3} //TODO: how to improve this?
          height={(1000 * 2) / 3}
          className='absolute bottom-0 right-9'
        ></Image>
      </div>
    </div>
  );
}
