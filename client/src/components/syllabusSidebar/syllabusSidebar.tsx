'use client';
import { CompiledSection, SessionWithToken, Unit } from '../../types';
import { CgAlbum } from 'react-icons/cg';
import { CgAddR } from 'react-icons/cg';
import { useState } from 'react';
import IconButton from '../buttons/iconButton';
import SectionForm from '../syllabusForms/sectionForm';
import UnitForm from '../syllabusForms/unitForm';
import { RiBook2Line } from 'react-icons/ri';
import { FaPencilRuler } from 'react-icons/fa';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { IoIosClose } from 'react-icons/io';
import { useAppDispatch } from '@/store';
import { deleteSection as deleteSectionReducer } from '@/store/slices/courseSlice';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface SyllabusSidebarProps {
  sections: CompiledSection[];
  courseName: string;
  activeId: string;
  selectUnit: (unit: Unit) => void;
  selectedUnit?: string;
  isAdmin: boolean;
}

const baseUrl = process.env.API_URL || 'http://localhost:5000';

export default function SyllabusSidebar(props: SyllabusSidebarProps) {
  const { isAdmin, sections, courseName, selectUnit, selectedUnit } = props;
  const {data: session} = useSession()

  const dispatch = useAppDispatch();

  const defaultActiveSections: Record<string, boolean> = {};
  sections.forEach((section) => {
    defaultActiveSections[section.id] = false;
  });

  const [sectionFormOpen, setSectionFormOpen] = useState(false);
  const [unitFormsOpen, setUnitFormsOpen] = useState<Record<string, boolean>>(
    defaultActiveSections
  );
  const [activeSections, setActiveSections] = useState<Record<string, boolean>>(
    defaultActiveSections
  );

  function closeSectionForm() {
    setSectionFormOpen(false);
  }
  function closeUnitForm(sectionId: string) {
    setUnitFormsOpen((prev) => ({ ...prev, [sectionId]: false }));
  }

  async function deleteSection(sectionId: string) {
    dispatch(deleteSectionReducer({sectionId}))
    await axios.delete(`${baseUrl}/section/${sectionId}`, {
      headers: {
        Authorization: (session as SessionWithToken)!.accessToken,
      }
    })
  }

  function SyllabusSection({ section }: { section: CompiledSection }) {
    const unitIcons = {
      lesson: <RiBook2Line />,
      excercise: <FaPencilRuler />,
      test: <IoDocumentTextOutline />,
    };
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
                setActiveSections((prev) => ({
                  ...prev,
                  [section.id]: !prev[section.id],
                }))
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
              <div
                onClick={() => {deleteSection(section.id)}}
                className={`ml-auto hover:${
                  activeSections[section.id]
                    ? 'text-primary-black'
                    : 'text-primary-red'
                }`}
              >
                <IoIosClose />
              </div>
            </button>
          </div>
        </div>

        {activeSections[section.id] && (
          <div className='w-full pr-4 pl-4'>
            <ol className='border-solid border-2 border-primary-gray border-opacity-20 mt-2 rounded-lg p-2'>
              {section.units.map((unit, index) => {
                return (
                  <li key={index}>
                    <button
                      onClick={() => selectUnit(unit)}
                      className={`flex items-center text-3xl p-2 min-w-full rounded-xl mt-2 ${
                        selectedUnit === unit.id
                          ? 'bg-primary-red bg-opacity-10 text-primary-red'
                          : 'hover:bg-primary-red hover:bg-opacity-5 rounded-xl p-2 w-full'
                      }`}
                    >
                      {unitIcons[unit.type]}
                      <div className='ml-2'>{unit.title}</div>
                    </button>
                  </li>
                );
              })}
              {isAdmin && (
                <div className='mt-2'>
                  <IconButton
                    title={'Unit'}
                    icon={<CgAddR />}
                    onClick={() => {
                      setUnitFormsOpen((prev) => ({
                        ...prev,
                        [section.id]: !prev[section.id],
                      }));
                    }}
                  />
                </div>
              )}
              {unitFormsOpen[section.id] && (
                <UnitForm sectionId={section.id} closeForm={closeUnitForm} />
              )}
            </ol>
          </div>
        )}
      </>
    );
  }

  return (
    <div className='h-screen min-h-full min-w-max bg-white shadow-lg relative box-border flex flex-col'>
      <div className='flex p-4'>
        <h2 className='my-auto text-3xl text-primary-gray font-semibold w-[12vw]'>
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
        <div className='px-4'>
          {isAdmin && (
            <div className='mt-4'>
              <IconButton
                title={'Section'}
                icon={<CgAddR />}
                onClick={() => {
                  setSectionFormOpen((prev) => !prev);
                }}
              />
            </div>
          )}
          {sectionFormOpen && <SectionForm closeForm={closeSectionForm} />}
        </div>
      </div>
    </div>
  );
}
