"use client";

// HelpRequestBox

import React from 'react';

interface HelpRequestBoxProps {
  id: string;
  studentName: string;
  question: string;
}

const HelpRequestBox: React.FC<HelpRequestBoxProps> = ({ id, studentName, question }) => {
  return (
    <div className="border p-4 rounded shadow-sm bg-white my-2">
      <h4 className="font-bold">{studentName}</h4>
      <p>{question}</p>
    </div>
  );
};

export default HelpRequestBox;
