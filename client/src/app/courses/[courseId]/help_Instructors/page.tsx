"use client";

// InstructorHelpRequestPage.tsx

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import io from 'socket.io-client';
import HelpRequestBox from './HelpRequestBox';

interface HelpRequest {
  id: string;
  studentName: string;
  question: string;
}

const InstructorHelpRequestPage = () => {
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001');

  useEffect(() => {
    // The event name here should match the one used by the server when a new help request is created
    socket.on('requestCreated', (newRequest: HelpRequest) => {
      // Update the state to include the new help request
      setHelpRequests((prevRequests) => [...prevRequests, newRequest]);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('requestCreated');
      socket.disconnect();
    };
  }, []);

  // Handler for drag and drop events
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(helpRequests);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setHelpRequests(items);
  };

  // Render the help requests within a draggable context
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="helpRequests">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
            {helpRequests.map((request, index) => (
              <Draggable key={request.id} draggableId={request.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-2"
                  >
                    <HelpRequestBox
                      id={request.id}
                      studentName={request.studentName}
                      question={request.question}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default InstructorHelpRequestPage;
