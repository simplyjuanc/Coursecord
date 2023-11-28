import { UserInfo } from '@/types';
import axios from 'axios';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

type HelpRequestFormProps = {
  setSubmitted: Dispatch<SetStateAction<boolean>>;
};

const HelpRequestForm = ({ setSubmitted }: HelpRequestFormProps) => {
  const [message, setMessage] = useState('');
  const [students, setStudents] = useState<Partial<UserInfo>[]>([]);

  // TODO get course id
  const baseUrl = process.env.API_URL || 'http://localhost:5000';
  const courseId = '6564f0ade4eabf777c376253';

  useEffect(() => {
    axios
      .get<UserInfo[]>(baseUrl + `/${courseId}/students`)
      .then((res) => setStudents(res.data))
      .catch((e) => console.error(e));
  }, [baseUrl])


  const handleMessage = (e:ChangeEvent) => {
    const target = e.target as HTMLTextAreaElement;
    setMessage(target.value);
  }

  // TODO get student requestor id
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    
    const target = e.target as HTMLFormElement
    const socket = io('http://localhost:5001/');
    
    socket.emit('join', 'student');
    socket.emit('createRequest', {
      content: message,
      course: courseId,
      students: [target.students.value],
    });
    
    console.log('request created');
    setSubmitted(true);
  };

  return (
    <div className='flex justify-center items-center h-full'>
      <form
        onSubmit={handleSubmit}
        className='space-y-4 p-6 border border-gray-200 shadow-lg rounded-lg bg-white'
      >
        <textarea
          className='w-full p-2 border rounded'
          placeholder='What do you need help with?'
          value={message}
          onChange={handleMessage}
          maxLength={140}
          required
        />
        {students && (
          <>
            <label htmlFor="students">Are there other students working with you?</label>
            <select name='students' id='students'>
              <option value="">Student dropdown</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
          </>
        )}
        <button
          type='submit'
          className='w-full p-2 bg-secondary text-white rounded hover:bg-primary'
        >
          Send Request
        </button>
      </form>
    </div>
  );
};

export default HelpRequestForm;
