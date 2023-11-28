'use client';
import { useState } from 'react';
import HelpRequestForm from './HelpRequestForm';
import HelpRequestModal from './HelpRequestConfirmation';

const HelpRequest = () => {
  const [submitted, setSubmitted] = useState(false);
  return (
    <>
      {submitted ? (
        <HelpRequestModal />
      ) : (
        <HelpRequestForm setSubmitted={setSubmitted} />
      )}
    </>
  );
};

export default HelpRequest;
