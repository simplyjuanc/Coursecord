"use client";

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import io from 'socket.io-client';
import HelpRequestBox from './HelpRequestBox';
import HelpRequestHeader from "./imgs/headerHelp.png";
import Image from 'next/image';

interface HelpRequest {
  id: string;
  content: string;  // The message from the form
  course: string;   // Course ID from the form
  students: string[]; // Requestors from the form
  status: 'waiting' | 'assigned' | 'completed';
}

// Define the array of status types
const helpRequestStatuses: ('waiting' | 'assigned' | 'completed')[] = ['waiting', 'assigned', 'completed'];

const InstructorHelpRequestPage = () => {
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001');

  useEffect(() => {
    socket.emit('join', 'instructor');

    socket.emit('getRequests', { courseId: 'YOUR_COURSE_ID' }, (requests: HelpRequest[]) => {
      setHelpRequests(requests);
    });

    
    socket.on('createRequest', (newRequest) => {
      setHelpRequests((prevRequests) => [
        ...prevRequests,
        {
          id: newRequest.id, 
          content: newRequest.content,
          course: newRequest.course,
          students: newRequest.students,
          status: 'waiting', 
        }
      ]);
    });

    return () => {
      socket.off('createRequest');
      socket.disconnect();
    };
  }, []);

  // Function to handle drag end event
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(helpRequests);
    const [reorderedItem] = items.splice(result.source.index, 1);
    reorderedItem.status = result.destination.droppableId as 'waiting' | 'assigned' | 'completed';
    items.splice(result.destination.index, 0, reorderedItem);

    setHelpRequests(items);
  };

  // Function to render help requests based on their status
  const renderHelpRequests = (status: 'waiting' | 'assigned' | 'completed') => {
    return helpRequests
    .filter((req) => req.status === status)
    .map((request, index) => (
      <Draggable key={request.id} draggableId={request.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="mb-2"
          >
            <HelpRequestBox
              content={request.content}
              course={request.course}
              students={request.students}
            />
          </div>
        )}
      </Draggable>
    )); 
  };

  return (
    <>
      <div className="flex justify-center my-4">
        <div className="w-80">
          <Image 
            src={HelpRequestHeader}
            alt="Help Request Header"
            width={256} 
            height={80} 
            layout="responsive" 
          />
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex justify-around p-4 bg-gray-100" style={{ height: 'calc(100vh - 4rem)' }}>
          {helpRequestStatuses.map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`w-1/4 mx-2 mt-7 p-4 rounded-lg border shadow-sm ${
                    snapshot.isDraggingOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
                  }`}
                  style={{ minHeight: '50vh' }}
                >
                  <h3 className="text-xl font-bold capitalize mb-4">{status}</h3>
                  <div className="flex flex-col space-y-4 overflow-auto">
                    {renderHelpRequests(status)}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </>
  );
};

export default InstructorHelpRequestPage;
