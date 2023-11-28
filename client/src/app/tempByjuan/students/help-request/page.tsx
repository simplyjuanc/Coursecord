'use client';
import { useState } from 'react';
import HelpRequestForm from './components/HelpRequestForm';
import HelpRequestModal from './components/HelpRequestConfirmation';


const HelpRequest = () => {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div>

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