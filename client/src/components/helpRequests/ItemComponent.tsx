import React from 'react';
import Image from 'next/image';
import { THelpRequestDetails } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export default function ItemComponent({ item }: { item: THelpRequestDetails }) {
  return (
    <div className='border-primary-red border-2 rounded-xl select-none'>
      <div className='p-2'>
        <div className=''>
            <p className='font-semibold my-auto'>Students: </p>
            {/* <Image
              src={item.students[0].student.image || ''}
              alt={'Student profile picture'}
              width={30}
              height={30}
              className='object-contain rounded-full mr-1'
            />
          */}
          <p className='my-auto'>
            {item.students.map((student) => student.student.name).join(', ')}
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
              ? 'Created ' + formatDistanceToNow(new Date(item.created_at), {
                  addSuffix: true,
                })
              : 'Finished ' +
                formatDistanceToNow(new Date(item.finished_at), {
                  addSuffix: true,
                })}
          </h3>
        </div>
      </div>
    </div>
  );
}
