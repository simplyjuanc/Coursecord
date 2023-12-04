import React from 'react';
import Image from 'next/image';
import { THelpRequestDetails } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Draggable } from '@hello-pangea/dnd';
 
export default function ItemComponent({
  item,
  index,
}: {
  item: THelpRequestDetails;
  index: number;
}) {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <div
          className='border-primary-red border-2 rounded-xl select-none p-2 my-4 bg-white '
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
            {item.instructor && (
              <div className='flex justify-end mr-1'>
                <Image
                  src={item.instructor.image || ''}
                  alt={'Instructor profile picture'}
                  width={25}
                  height={25}
                  className='object-contain rounded-full mr-1 my-auto'
                />
                <p className='my-auto text-lg font-medium'>
                  {item.instructor.name}
                </p>
              </div>
            )}
            <div>
              <p className='font-semibold my-auto'>Students: </p>
              <p>
                {item.students
                  .map((student) => student.student.name)
                  .join(', ')}
              </p>
            </div>
            <p className='py-3'>{item.content}</p>
            <div>
              <p className='italic text-sm'>
                {!item.finished_at
                  ? 'Created ' +
                    formatDistanceToNow(new Date(item.created_at), {
                      addSuffix: true,
                    })
                  : 'Finished ' +
                    formatDistanceToNow(new Date(item.finished_at), {
                      addSuffix: true,
                    })}
              </p>
            </div>
        </div>
      )}
    </Draggable>
  );
}
