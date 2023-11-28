'use client';
import { useState } from 'react';
import Header from '../syllabus/components/Header';
import HelpRequestForm from './components/HelpRequestForm';
import HelpRequestModal from './components/HelpRequestModal';

const HelpRequest = () => {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div>
      <Header />
      <div className='flex justify-center items-center h-screen bg-gray-100'>
        <div className='w-full max-w-md'>
          {submitted ? 
            <HelpRequestModal /> : 
            <HelpRequestForm setSubmitted={setSubmitted} />
          }
        </div>
      </div>
    </div>
  );
};

export default HelpRequest;
