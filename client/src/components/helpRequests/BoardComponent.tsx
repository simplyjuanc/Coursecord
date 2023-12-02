import { THelpRequest } from '@/types';
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { BsThreeDots } from 'react-icons/bs';
import ItemComponent from './ItemComponent';

type BoardComponentProps = {
  status: string;
  helpRequests: THelpRequest[];
};

export default function BoardComponent({
  status,
  helpRequests,
}: BoardComponentProps) {
  return (
    <div className='flex-grow flex flex-col '>
      <div className='flex font-bold text-3xl'>
        <div className='my-auto text-primary-red text-4xl pr-4 pb-6'>
          <BsThreeDots />
        </div>
        <h1 className='drop-shadow-lg'>
          {status.slice(0, 1)}
          {status.slice(1).toLocaleLowerCase()}
        </h1>
      </div>
      <Droppable droppableId={status}>
        {(droppableProvided, snapshot) => (
          <div
            className='bg-white w-full max-h-min rounded-xl p-6 shadow-xl border-2 border-primary-gray border-opacity-40'
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            <div className=''>
              {helpRequests.map(
                (item, index) =>
                  item.status === status && (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div style={{ height: '1rem' }} />
                          <ItemComponent item={item} />
                        </div>
                      )}
                    </Draggable>
                  )
              )}
            </div>
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
