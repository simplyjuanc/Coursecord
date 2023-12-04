import { THelpRequestDetails } from '@/types';
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { BsThreeDots } from 'react-icons/bs';
import ItemComponent from './ItemComponent';

type BoardComponentProps = {
  status: string;
  helpRequests: THelpRequestDetails[];
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
        {(provided) => (
          <div
            className='bg-white w-full max-h-min min-h-[50%] rounded-xl p-6 shadow-xl border-2 border-primary-gray border-opacity-40'
            ref={provided.innerRef}
            // innerRef={provided.innerRef}
            {...provided.droppableProps}
          >
            {helpRequests.map(
              (item, idx) =>
                item.status === status && (
                  <ItemComponent key={item.id} item={item} idx={idx} />
                )
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
