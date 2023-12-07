'use client';
import { RiBook2Line } from 'react-icons/ri';
import Markdown from '../markdown-render/markdownRenderer';
import { useState } from 'react';
import { FaPencilRuler } from 'react-icons/fa';
import { IoDocumentTextOutline } from 'react-icons/io5';

type MarkdownFormProps = {
  type: string;
  text: string;
  setText: (text: string) => void;
  setType: (type: string) => void;
  saveChanges: () => void;
};

export default function MarkdownForm(props: MarkdownFormProps) {
  const { type, text, setText, setType, saveChanges } = props;

  const [preview, setPreview] = useState<boolean>(false);

  const unitIcons = {
    lesson: <RiBook2Line />,
    exercise: <FaPencilRuler />,
    test: <IoDocumentTextOutline />,
  };

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;

      e.currentTarget.value =
        e.currentTarget.value.substring(0, start) +
        '\t' +
        e.currentTarget.value.substring(end);

      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 1;
    }

    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveChanges();
    }
  }

  return (
    <div className='w-full flex-grow flex flex-col px-6 py-10'>
      <div className='flex gap-[1rem]'>
        <div className='flex flex-col w-[50%] items-center'>
          <div className='flex w-full items-center justify-between px-4 mb-2'>
          <h2 className='text-3xl font-semibold border-b-4 rounded-bl-md rounded-br-md border-b-primary-1 border-opacity-30'>Edit</h2>
          <div className='flex items-center'>

          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
            }}
            className='rounded-lg mx-4 p-1 text-2xl'
            >
            <option value='lesson'>Lesson</option>
            <option value='exercise'>Exercise</option>
            <option value='test'>Test</option>
          </select>
          {unitIcons[type as 'lesson' | 'exercise' | 'test']}
            </div>
        </div>
        <textarea
          className='flex-grow w-full p-6 rounded-xl resize-none border-solid border-2 border-primary-2 border-opacity-70'
          onKeyDown={handleKeyDown}
          value={text}
          onChange={(e) => setText(e.target.value)}
          />
          </div>
        <div className='flex flex-col w-[50%] items-center'>
          <div className='pl-4 self-start'>

          <h2 className='text-3xl font-semibold border-b-4 rounded-bl-md rounded-br-md border-b-primary-1 border-opacity-30 mb-2'>Preview</h2>
          </div>
        <div className='border-2 border-primary-2 border-opacity-70 rounded-xl w-full'>
          <Markdown markdown={text} />
        </div>
        </div>
      </div>
    </div>
  );
}
