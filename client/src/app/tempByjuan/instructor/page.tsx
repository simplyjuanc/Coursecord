'use client';
import { DbUser, THelpRequest } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import HelpRequestCard from './components/HelpRequestCard';

let socket: Socket;
export default function HelpRequestBoard() {
  const [helpRequests, setHelpRequests] = useState<THelpRequest[]>([]);
  const [instructors, setInstructors] = useState<DbUser[]>();
  const baseUrl = process.env.API_URL || 'http://localhost:5000';
  const courseId = '6565c41df515f6ec9392f30f';
  
  useEffect(() => {  
    axios
      .get<DbUser[]>(`${baseUrl}/${courseId}/instructors`)
      .then((res) => setInstructors(res.data))
      .catch((e) => console.error(e));
    
    socket = io('http://localhost:5001/', {auth: {}});
    socket.emit('join', 'instructor');
    socket.emit('getRequests', { courseId }, (res: THelpRequest[]) => {
      setHelpRequests(res);
    });

    return () => {
      socket.disconnect();
    };
  }, [baseUrl]);


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
            <HelpRequestCard
              key={request.id}
              request={request}
              socket={socket}
              instructors={instructors}
              setInstructors={setInstructors}
            />
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
