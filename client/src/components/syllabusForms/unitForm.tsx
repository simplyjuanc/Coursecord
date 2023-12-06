'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store';
import { useSession } from 'next-auth/react';
import { SessionWithToken } from '@/types';
import { addUnitToSection, updateUnit } from '@/store/slices/courseSlice';
import { addUnit } from '@/services/apiClientService';

type UnitFormProps = {
  closeForm: (sectionId: string) => void;
  sectionId: string;
  setSaving: (saving?: 'saving' | 'done' | 'error') => void;
};

export default function UnitForm(props: UnitFormProps) {
  const { closeForm, sectionId, setSaving } = props;

  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<string>('lesson');

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving('saving');
    let newUnit = {
      id: 'placeholder',
      title,
      type: type as 'lesson' | 'exercise' | 'test',
      markdown_body: '',
      owner: '656b40666c0ea5f66060c942',
    };

    try {
      const newUnit = await addUnit(
        { title, type: type as 'lesson' | 'exercise' | 'test' },
        sectionId,
        session as SessionWithToken
      );

      if (!newUnit) throw new Error('Could not add unit');
      console.log('addUnit - newUnit :>> ', newUnit);

      const unit = { ...newUnit, id: newUnit.id };
      
      dispatch(updateUnit({ newUnit: unit }));
      setSaving('done');
      setTimeout(() => setSaving(undefined), 1000);
        
      dispatch(addUnitToSection({ sectionId, course_unit: { unit: newUnit } }));
      setTitle('');
      setType('lesson');
      closeForm(sectionId);
    } catch (error) {
      console.error(error);
      setSaving('error');
      setTimeout(() => setSaving(undefined), 1000);
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
        <option value='lesson'>Lesson</option>
        <option value='excercise'>Excercse</option>
        <option value='test'>Test</option>
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
