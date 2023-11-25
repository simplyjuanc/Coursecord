import React from 'react';

interface ClassCardProps {
  name: string;
  imageUrl: string;
}

const ClassCard: React.FC<ClassCardProps> = ({ name, imageUrl }) => {
  return (
    <div className="border p-4 flex flex-col items-center shadow-lg">
      <img src={imageUrl} alt={name} className="max-w-full h-auto rounded-lg" />
      <p className="mt-2 text-center text-lg font-medium">{name}</p>
    </div>
  );
};

export default ClassCard;
