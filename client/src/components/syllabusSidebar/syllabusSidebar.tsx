'use client';
import { Section, Unit } from '@/types';
import Sidebar from '../sidebar/sidebar';
import { CgAlbum } from 'react-icons/cg';
import { useParams } from 'next/navigation';
import { useState } from 'react';

interface SyllabusSidebarProps {
  sections: Section[];
  courseName: string;
  activeId: string;
  selectUnit: (unit: Unit) => void;
  selectedUnit?: string;
}

export default function SyllabusSidebar({
  sections,
  courseName,
  selectUnit,
  selectedUnit,
}: SyllabusSidebarProps) {
  const defaultActiveSections: Record<string, boolean> = {};
  sections.forEach((section) => {
    defaultActiveSections[section.id] = false;
  });

  const [activeSections, setActiveSections] = useState<Record<string, boolean>>(
    defaultActiveSections
  );

  function SyllabusSection({ section }: { section: Section }) {
    return (
      <>
        <div className='flex flex-row-reverse'>
          {activeSections[section.id] && (
            <div
              className={`w-1.5 rounded-tl-2xl rounded-bl-2xl bg-primary-red bg-opacity-50`}
            ></div>
          )}
          <div className='w-full pr-4 pl-4'>
            <button
              onClick={() =>
                setActiveSections({
                  ...activeSections,
                  [section.id]: !activeSections[section.id],
                })
              }
              className={
                `flex text-3xl p-2 min-w-full rounded-xl` +
                (activeSections[section.id]
                  ? ' bg-primary-red bg-opacity-10 text-primary-red'
                  : ' hover:bg-primary-red hover:bg-opacity-5')
              }
            >
              <div className='my-auto'>
                <CgAlbum />
              </div>
              <h2 className='font-semibold pl-3'>{section.title}</h2>
            </button>
          </div>
        </div>

        {activeSections[section.id] && (
          <div className='w-full pr-4 pl-4'>
            <ol>
              {section.units.map((unit, index) => {
                console.log(selectedUnit, unit.id);
                return (
                  <li key={index}>
                    <button
                      onClick={() => selectUnit(unit)}
                      className={`flex text-3xl p-2 min-w-full rounded-xl mt-2 ${
                        selectedUnit === unit.id
                          ? 'bg-primary-red bg-opacity-10 text-primary-red'
                          : 'hover:bg-primary-red hover:bg-opacity-5 rounded-xl p-2 w-full'
                      }`}
                    >
                      {unit.title}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </>
    );
  }

  return (
    <div className='h-screen min-h-full min-w-max bg-white shadow-lg relative box-border flex flex-col'>
      <div className='flex p-4'>
        <h2 className='my-auto text-3xl text-primary-gray font-semibold'>
          {courseName}
        </h2>
        <div className='w-10 h-10 rounded-full bg-primary-red bg-opacity-50 ml-4'></div>
      </div>
      <div className='py-12 overflow-y-auto'>
        <ul>
          {sections.map((section, index) => (
            <li key={index} className='pt-4'>
              <SyllabusSection section={section} />
            </li>
          ))}
        </ul>
      </div>
      <div
        onClick={() => {}}
        className='absolute bottom-0 mx-auto w-full p-3'
      ></div>
    </div>
  );
}
