'use client';
import { DbUser, SessionWithToken, THelpRequest, THelpRequestDetails } from '@/types';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { MdSupportAgent } from 'react-icons/md';
import { Socket, io } from 'socket.io-client';
import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Image from 'next/image';
import Spinner from '/public/spinner.svg';
import BoardComponent from './BoardComponent';
import { getInstructorsByCourse } from '@/services/apiClientService';


let socket: Socket;
export default function HelpRequestBoard() {
  const [helpRequests, setHelpRequests] = useState<THelpRequestDetails[]>([]);
  const [instructors, setInstructors] = useState<DbUser[]>([]);
  const baseUrl = process.env.API_URL || 'http://localhost:5000';

  // TODO: get courseId from session
  const courseId = '656b40a56c0ea5f66060c947';
  const { data: session } = useSession();
  
  useEffect(() => {
    console.log('Loading HelpBoard');
    console.log('session :>> ', session);
    // What is this for? Including useState hook above
    getInstructorsByCourse(courseId, session as SessionWithToken)
      .then(instructors => {
        if (!instructors) throw new Error('No instructors found')
        setInstructors(instructors)
      })
      .catch((e) => console.error(e));

    socket = io(baseUrl, {
      auth: {
        accessToken: (session as SessionWithToken).accessToken,
      },
    });

    socket.emit('getRequests', courseId, (res: THelpRequestDetails[]) => {
      setHelpRequests(res);
      console.log('getRequests - res :>> ', res);
    });

    socket.on('requestsUpdated', (res: THelpRequestDetails[]) => {
      setHelpRequests(res);
    });

    return () => {
      socket.disconnect();
    };
  }, [baseUrl, session]);


  async function updateRequestStatus(coordinates: DropResult) {
    const { source, destination } = coordinates;
    if (!destination) return;

    const updatedHelpRequests = helpRequests.map((request) => {
      if (request.id === source.droppableId) {
        return {
          ...request,
          status: destination.droppableId as THelpRequest['status'],
        };
      }
      return request;
    });

    setHelpRequests(updatedHelpRequests);

    socket.emit('updateStatus', {
      course: courseId,
      request: source.droppableId,
      destination: destination.droppableId,
    });
  }

  return (
    <div className='flex-grow flex flex-col h-screen px-20 pt-10'>
      <div className='bg-white flex text-3xl font-semibold px-8 py-4 mx-auto rounded-xl shadow-xl border-2 border-primary-gray border-opacity-40'>
        <div className='my-auto mr-4 text-primary-red text-4xl'>
          <MdSupportAgent />
        </div>
        <h1 className='my-auto'>Help Requests</h1>
      </div>
      <div className='flex-grow max-h-screen grid pt-12 grid-cols-3 gap-x-12 overflow-y-auto'>
        {!socket ? (
          <div className='text-center mx-auto justify-center pt-40 left-1/2 flex absolute'>
            <Image src={Spinner} alt='Spinner' width={75} height={75} />
          </div>
        ) : (
          <DragDropContext onDragEnd={updateRequestStatus}>
            {['WAITING', 'ASSIGNED', 'FINISHED'].map((status) => (
              <BoardComponent
                key={status}
                status={status}
                helpRequests={helpRequests}
              />
            ))}
          </DragDropContext>
        )}
      </div>
    </div>
  );
}
