'use client';
import { THelpRequest } from '@/@types';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

let socket: Socket;
export default function HelpRequestBoard() {
  const baseUrl = process.env.API_URL || 'http://localhost:5000';
  const [helpRequests, setHelpRequests] = useState<THelpRequest[]>([]);

  const courseId = useEffect(() => {
    socket = io('http://localhost:5001/');
    socket.emit('join', 'instructor');
    socket.emit('getRequests', { courseId }, (res: THelpRequest[]) => {
      setHelpRequests(res);
    });

    return () => {
      socket.disconnect();
    };
  }, [baseUrl]);

  function handleCardChange() {}


  /* 
  DISREGARD JSX BELOW
  I was only using it to test the instructor sockets
  */

  return (
    <div className='mt-16 flex flex-row gap-24 justify-center align-middle w-full'>
      <div>
        <h2 className='mb-4 text-center'>Waiting</h2>
        {helpRequests &&
          helpRequests.map((request) => (
            <div key={request.id}>
              <p>{request.content.substring(0, 20)}</p>
            </div>
          ))}
      </div>
      <div>
        <h2 className='mb-4 text-center'>Assigned</h2>
        <p>Lorem ipsum</p>
        <p>Lorem ipsum</p>
      </div>
      <div>
        <h2 className='mb-4 text-center'>Finished</h2>
        <p>Lorem ipsum</p>
        <p>Lorem ipsum</p>
      </div>
    </div>
  );
}
