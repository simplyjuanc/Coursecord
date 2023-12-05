import { THelpRequestDetails } from '@/types';
import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { BsThreeDots } from 'react-icons/bs';
import BoardItem from './BoardItem';

type BoardComponentProps = {
  status: string;
  helpRequests: THelpRequestDetails[];
};

export default function BoardColumn({
  status,
  helpRequests,
}: BoardComponentProps) {
  return (
    <div className='flex flex-none flex-col max-h-[90%] min-h-[90%]'>
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
            className='bg-white w-full flex flex-col flex-none min-h-full max-h-full rounded-xl p-6 shadow-xl border-2 border-primary-gray border-opacity-40 overflow-auto overscroll-contain scrollbar-hide'
            {...provided.droppableProps}
          >
            {helpRequests.map(
              (item, index) =>
                item.status === status && (
                  <BoardItem key={item.id} item={item} index={index} />
                )
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
