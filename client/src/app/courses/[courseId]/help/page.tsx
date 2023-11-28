'use client';
import { useState } from 'react';
import HelpRequestForm from './HelpRequestForm';
import HelpRequestModal from './HelpRequestConfirmation';
import { Socket } from 'socket.io-client';

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
