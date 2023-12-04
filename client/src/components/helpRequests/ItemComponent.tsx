import React from 'react';
import Image from 'next/image';
import { THelpRequestDetails } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Draggable } from 'react-beautiful-dnd';

export default function ItemComponent({
  item,
  idx,
}: {
  item: THelpRequestDetails;
  idx: number;
}) {
  return (
    <Draggable draggableId={item.id} index={idx}>
      {(provided) => (
        <div
          className='border-primary-red border-2 rounded-xl select-none p-2 my-4'
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
            <div>
              <p className='font-semibold my-auto'>Students: </p>
              <p>
                {item.students
                  .map((student) => student.student.name)
                  .join(', ')}
              </p>
            </div>
            <h2 className='py-2 font-medium'>{item.content}</h2>
            {item.instructor && (
              <div className='flex'>
                <Image
                  src={item.instructor.image || ''}
                  alt={'Instructor profile picture'}
                  width={25}
                  height={25}
                  className='object-contain rounded-full mr-1 my-auto'
                />
                <h1 className='my-auto text-lg font-medium'>
                  {item.instructor.name}
                </h1>
              </div>
            )}
            <div>
              <h3 className=''>
                {!item.finished_at
                  ? 'Created ' +
                    formatDistanceToNow(new Date(item.created_at), {
                      addSuffix: true,
                    })
                  : 'Finished ' +
                    formatDistanceToNow(new Date(item.finished_at), {
                      addSuffix: true,
                    })}
              </h3>
            </div>
        </div>
      )}
    </Draggable>
  );
}
