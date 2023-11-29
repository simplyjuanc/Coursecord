"use client";

import React from 'react';

interface HelpRequestBoxProps {
  id: string;
  studentName: string;
  question: string;
}

const HelpRequestBox: React.FC<HelpRequestBoxProps> = ({ id, studentName, question }) => {
  return (
    <div className="border-2 border-gray-300 bg-white rounded-lg shadow p-4 my-2 flex flex-col">
      <div>
        <h4 className="text-lg font-bold text-gray-900">{studentName}</h4>
        <p className="text-gray-600">{question}</p>
      </div>
    </div>
  );
};

export default HelpRequestBox