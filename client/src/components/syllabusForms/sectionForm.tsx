'use client';
import { useAppSelector } from '@/store';
import { addSection } from '@/store/slices/courseSlice';
import { SessionWithToken } from '@/types';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

const baseUr = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';

export default function SectionForm({ closeForm }: { closeForm: () => void }) {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const course = useAppSelector((state) => state.course.courseInfo);
  const [title, setTitle] = useState<string>('');

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await axios.post(
      `${baseUr}/${course?.id}/section`,
      {
        title,
      },
      {
        headers: {
          Authorization: (session as SessionWithToken)!.accessToken,
        },
      }
    );
    dispatch(
      addSection({
        section: {
          id: response.data.id,
          title: response.data.title,
          units: [],
        },
      })
    );
    setTitle('');
    closeForm()
  }


  return (
    <form onSubmit={submitForm} className='flex flex-col py-4 items-center'>
      <label className='self-start'>Name:</label>
      <input
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='border-solid border-gray-500 border-2 rounded-md h-10 max-w-full my-2 px-2'
      />
      <button
        type='submit'
        className='bg-primary-red bg-opacity-20 rounded-lg text-xl w-3/4 h-10 hover:bg-opacity-50 hover:text-white'
      >
        Submit
      </button>
    </form>
  );
}
