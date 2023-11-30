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
};

export default function MarkdownForm(props: MarkdownFormProps) {
  const { type, text, setText, setType } = props;

  const [preview, setPreview] = useState<boolean>(false);

  const unitIcons = {
    lesson: <RiBook2Line />,
    excercise: <FaPencilRuler />,
    test: <IoDocumentTextOutline />,
  };

  return (
    <div className='w-full flex-grow flex flex-col  p-6'>
      <div className='w-full flex justify-center my-4 text-xl'>
        <button
          className={`mx-4 border-b-4 rounded-bl-md rounded-br-md border-b-primary-red ${
            !preview ? 'border-opacity-30' : 'border-opacity-0'
          }`}
          onClick={() => setPreview(false)}
        >
          Edit
        </button>
        <button
          className={`mx-4 border-b-4 rounded-bl-md rounded-br-md border-b-primary-red ${
            preview ? 'border-opacity-30' : 'border-opacity-0'
          }`}
          onClick={() => setPreview(true)}
        >
          Preview
        </button>
        <div className='flex items-center'>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
            }}
            className='rounded-lg mr-4 p-1'
          >
            <option value='lesson'>Lesson</option>
            <option value='excercise'>Excercise</option>
            <option value='test'>Test</option>
          </select>
          {unitIcons[type as 'lesson' | 'excercise' | 'test']}
        </div>
      </div>
      {preview ? (
        <Markdown markdown={text} />
      ) : (
        <textarea
          className='w-full flex-grow p-6 rounded-xl resize-none'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      )}
    </div>
  );
}
