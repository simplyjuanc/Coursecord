import { THelpRequestDetails } from '@/types';
import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
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
            ref={provided.innerRef}
            className='bg-white w-full max-h-min min-h-[50%] rounded-xl p-6 shadow-xl border-2 border-primary-gray border-opacity-40 grow'
            {...provided.droppableProps}
          >
            {helpRequests.map(
              (item, index) =>
                item.status === status && (
                  <ItemComponent key={item.id} item={item} index={index} />
                )
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
