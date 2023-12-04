'use client';
import { addSection } from '@/services/apiClientService';
import { useAppSelector } from '@/store';
import {
  addSection as addSectionReducer,
  updateSection,
} from '@/store/slices/courseSlice';
import { SessionWithToken } from '@/types';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

type SectionFormProps = {
  closeForm: () => void;
  setSaving(saving?: 'saving' | 'done' | 'error'): void;
};

export default function SectionForm(props: SectionFormProps) {
  const { closeForm, setSaving } = props;
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const course = useAppSelector((state) => state.course.courseInfo);
  const [title, setTitle] = useState<string>('');

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    setSaving('saving');
    e.preventDefault();
    const newSection = {
      id: 'placeholder',
      title,
      course_id: course!.id,
    };

    dispatch(addSectionReducer({ section: { ...newSection, course_units: [] } }));
    const addedSection = await addSection(
      { title }, course!.id,
      session as SessionWithToken
    );
    if (addedSection) {
      const newId = addedSection.id;
      const section = { ...newSection, id: newId, course_units: [] };
      dispatch(updateSection({ newSection: section }));
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
    closeForm();
  }

  return (
    <form onSubmit={submitForm} className='flex flex-col py-4 items-center'>
      <label className='self-start'>Name:</label>
      <input
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className='border-solid border-primary-2 border-opacity-50 border-2 rounded-md h-10 w-full my-2 px-2'
      />
      <button
        type='submit'
        className='bg-primary-1 bg-opacity-20 rounded-lg text-xl w-3/4 h-10 hover:bg-opacity-50 hover:text-white'
      >
        Submit
      </button>
    </form>
  );
}
