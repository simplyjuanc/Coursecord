'use client';
import { DbUser, SessionWithToken, THelpRequest, THelpRequestDetails } from '@/types';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { MdSupportAgent } from 'react-icons/md';
import { Socket, io } from 'socket.io-client';
import React from 'react';
import { DragDropContext, DragStart, DropResult } from '@hello-pangea/dnd';
import Image from 'next/image';
import Spinner from '/public/spinner.svg';
import BoardColumn from './BoardColumn';
import { set } from 'date-fns';



let socket: Socket;
export default function HelpRequestBoard() {
  const baseUrl = process.env.API_URL || 'http://localhost:5000';
  const statusList = ['WAITING', 'ASSIGNED', 'FINISHED']
  // TODO: get courseId from session
  const courseId = '656b40a56c0ea5f66060c947';
  
  const [helpRequests, setHelpRequests] = useState<THelpRequestDetails[]>([]);
  const { data: session } = useSession();
  
  useEffect(() => {
    console.log('Loading HelpBoard');
    socket = io(baseUrl, {
      auth: {
        accessToken: (session as SessionWithToken).accessToken,
      },
    });

    socket.emit('getRequests', courseId, (res: THelpRequestDetails[]) => {
      setHelpRequests(res);
    });
    
    socket.on('requestsUpdated', (requests: THelpRequestDetails[]) => {
      console.log('updatedRequests :>> ', requests);
      setHelpRequests(requests);
    });
    
    return () => {
      socket.disconnect();
    };
  }, [baseUrl, session]);
  

  const onDragStart = (result:DragStart) => {

  }

  const onDragEnd = (result:DropResult) => {
    const { draggableId, destination } = result;
    if (!destination) return;

    const updatedHelpRequests = helpRequests.map((request) => {
      if (request.id === draggableId) {
        return {
          ...request,
          status: destination.droppableId as THelpRequest['status'],
        };
      }
      return request;
    });

    setHelpRequests(updatedHelpRequests);


    socket.emit('updateStatus', {
      id: draggableId,
      course_id: courseId,
      status: destination.droppableId,
    }, 
    (requests: THelpRequestDetails[]) => { setHelpRequests(requests) });
  }

  return (
    <div className='flex-grow flex flex-col px-20 pt-10 max-h-[100vh]'>
      <div className='bg-white flex text-3xl font-semibold px-8 py-4 mx-auto rounded-xl shadow-xl border-2 border-primary-gray border-opacity-40'>
        <div className='my-auto mr-4 text-primary-red text-4xl'>
          <MdSupportAgent />
        </div>
        <h1 className='my-auto'>Help Requests</h1>
      </div>
      <div className='grid my-8 grid-cols-3 gap-x-12 max-h-[85%] min-h-[85%]'>
        {!socket ? (
          <div className='text-center mx-auto justify-center pt-40 left-1/2 flex flex-none absolute'>
            <Image src={Spinner} alt='Spinner' width={75} height={75} />
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
            {['WAITING', 'ASSIGNED', 'FINISHED'].map((status) => (
              <BoardColumn
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
