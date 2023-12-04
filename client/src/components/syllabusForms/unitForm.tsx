'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store';
import { useSession } from 'next-auth/react';
import { SessionWithToken } from '@/types';
import axios from 'axios';
import { addUnitToSection, updateUnit } from '@/store/slices/courseSlice';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';

type UnitFormProps = {
  closeForm: (sectionId: string) => void;
  sectionId: string;
  setSaving: (saving?: 'saving' | 'done' |'error') => void;
};


export default function UnitForm(props: UnitFormProps) {
  const { closeForm, sectionId, setSaving } = props;

  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<string>('lesson');

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    setSaving('saving');
    let newUnit = {
      id: 'placeholder',
      title,
      type: type as 'lesson' | 'excercise' | 'test',
      markdown_body: '',
      owner: '6565c3bdf515f6ec9392f30e',
    };

    dispatch(addUnitToSection({ sectionId, unit: newUnit }));
    e.preventDefault();
    try {
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
      const newId = unitResponse.data.newUnit.id;
      const unit = {...newUnit, id: newId}
      dispatch(updateUnit({ newUnit: unit }));
      setSaving('done');
      setTimeout(() => {
        setSaving(undefined);
      }, 1000);
    } else {
      setSaving('error');
      setTimeout(() => {
        setSaving(undefined);
      }, 1000);
    }

    setTitle('');
    setType('lesson');
    closeForm(sectionId);
  } catch (error) {
    console.log(error);
    setSaving('error');
    setTimeout(() => {
      setSaving(undefined);
    }, 1000);
  }
  }

  return (
    <form onSubmit={submitForm} className='flex flex-col py-4 items-center'>
      <label className='self-start'>Name:</label>
      <input
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className='border-solid border-primary-2 border-opacity-50 border-2 rounded-md h-10 max-w-full my-2 px-2'
      />
      <select
        className='p-2 mb-2 font-semibold border-solid border-primary-2 border-opacity-30 border-2 rounded-lg'
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value='lesson'>
          Lesson
        </option>
        <option value='excercise'>
          Excercse
        </option>
        <option value='test'>
          Test
        </option>
      </select>
      <button
        type='submit'
        className='bg-primary-1 bg-opacity-20 rounded-lg text-xl w-3/4 h-10 hover:bg-opacity-50 hover:text-white'
      >
        Submit
      </button>
    </form>
  );
}
