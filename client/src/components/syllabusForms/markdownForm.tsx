'use client';
import Markdown from '../markdown-render/markdownRenderer';
import { useState } from 'react';

export default function MarkdownForm({
  text,
  setText,
}: {
  text: string;
  setText: (text: string) => void;
}) {
  const [preview, setPreview] = useState<boolean>(false);

  return (
    <div className='w-full flex-grow flex flex-col  p-6'>
      <div className='w-full flex justify-center my-4'>
        <button className={`mx-4 border-b-4 rounded-bl-md rounded-br-md border-b-primary-red ${!preview ? 'border-opacity-30' : 'border-opacity-0'}`} onClick={() => setPreview(false)}>Edit</button>
        <button className={`mx-4 border-b-4 rounded-bl-md rounded-br-md border-b-primary-red ${preview ? 'border-opacity-30' : 'border-opacity-0'}`} onClick={() => setPreview(true)}>Preview</button>
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
