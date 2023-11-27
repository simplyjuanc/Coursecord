"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import Header from './components/Header';
import { IUnit, IContentItem } from './interfaces/types';

const Home: React.FC = () => {
  const [units, setUnits] = useState<IUnit[]>([]);
  const [activeContent, setActiveContent] = useState<IContentItem[]>([]);

  useEffect(() => {
    fetch('/api/units')
      .then((response) => response.json())
      .then((data) => setUnits(data))
      .catch((error) => console.error('Error fetching units:', error));
  }, []);

  const handleSubunitClick = (subunitContent: IContentItem[]) => {
    setActiveContent(subunitContent);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-grow">
        <Sidebar units={units} onSubunitClick={handleSubunitClick} />
        <ContentArea content={activeContent} />
      </div>
    </div>
  );
};

export default Home;
