'use client';
import React, { useEffect, useState, ReactNode } from 'react';
import Header from './components/Header';

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
