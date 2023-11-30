'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store';
import { useSession } from 'next-auth/react';
import { SessionWithToken } from '@/types';
import axios from 'axios';
import { addUnitToSection } from '@/store/slices/courseSlice';

import { RiBook2Line } from 'react-icons/ri';
import { FaPencilRuler } from 'react-icons/fa';
import { IoDocumentTextOutline } from 'react-icons/io5';


const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';

export default function UnitForm({
  closeForm,
  sectionId,
}: {
  closeForm: (sectionId: string) => void;
  sectionId: string;
}) {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<string>('lesson');

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const unitResponse = await axios.post(
      `${baseUrl}/unit/org/6565c3bdf515f6ec9392f30e/${sectionId}`,
      {
        //constant orgId is temporary
        title,
        type,
        markdown_body: '',
      },
      {
        headers: {
          Authorization: (session as SessionWithToken)!.accessToken,
        },
      }
    );
    if (unitResponse.status === 201) {
      const newUnit = unitResponse.data.newUnit;
      dispatch(addUnitToSection({ sectionId, unit: newUnit }));
    }

    setTitle('');
    setType('lesson');
    closeForm(sectionId);
  }

  return (
    <form onSubmit={submitForm} className='flex flex-col py-4 items-center'>
      <label className='self-start'>Name:</label>
      <input
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className='border-solid border-primary-gray border-opacity-50 border-2 rounded-md h-10 max-w-full my-2 px-2'
      />
      <select className='p-2 mb-2 font-semibold border-solid border-primary-gray border-opacity-30 border-2 rounded-lg' value={type} onChange={(e) => setType(e.target.value)}>
        <option value='lesson'><RiBook2Line />Lesson</option>
        <option value='excercise'><FaPencilRuler />Excercse</option>
        <option value='test'><IoDocumentTextOutline />Test</option>
      </select>
      <button
        type='submit'
        className='bg-primary-red bg-opacity-20 rounded-lg text-xl w-3/4 h-10 hover:bg-opacity-50 hover:text-white'
      >
        Submit
      </button>
    </form>
  );
}
