import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DbUser, THelpRequest } from '@/types';
import { Socket } from 'socket.io-client';

type HelpRequestCardProps = {
  request: THelpRequest;
  socket: Socket;
  instructors: DbUser[] | undefined;
  setInstructors: React.Dispatch<React.SetStateAction<DbUser[] | undefined>>;
};

export default function HelpRequestCard({
  request,
  socket,
  instructors,
  setInstructors,
}: HelpRequestCardProps) {
  const [status, setStatus] = useState('Waiting');

  const baseUrl = process.env.API_URL || 'http://localhost:5000';
  useEffect(() => {
    console.log('testing card ');
  }, [baseUrl]);

  function handleRequestChange(e: React.FormEvent<HTMLFormElement>) {
    socket.emit('updateRequestStatus', {
      id: request.id,
      status: status,
    });

    console.log(request);
  }

  return (
    <div className='border rounded-lg bg-primary-gray px-2 py-1 my-2'>
      <p className='text-white'> {request.content.substring(0, 20)} </p>

      <form onSubmit={handleRequestChange}>
        <label htmlFor='mdn'></label>
        <select
          name='status'
          id='status'
          onChange={(e) => setStatus(e.target.value)}
          className='mx-2 px-2 bg-primary-light rounded-lg'
        >
          <option value=''>Select status</option>
          <option value='Waiting'>Waiting</option>
          <option value='Assigned'>Assigned</option>
          <option value='Finished'>Finished</option>
        </select>

        <select
          name='instructor'
          id='instructor'
          className='mx-2 px-2 bg-primary-lighter rounded-lg'
        >
          <option value=''>Select instructor</option>
          {instructors &&
            instructors.map((instructor) => (
              <option key={instructor.id}>{instructor.name}</option>
            ))}
        </select>

        <button
          type='submit'
          className='mx-2 px-2 bg-primary rounded-lg text-white'
        >
          Submit changes
        </button>
      </form>
    </div>
  );
}
