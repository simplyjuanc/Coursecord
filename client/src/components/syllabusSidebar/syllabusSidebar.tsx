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
import { MdOutlineEdit } from 'react-icons/md';
import SyllabusSection from './syllabusSection';

interface SyllabusSidebarProps {
  sections: CompiledSection[];
  courseName: string;
  activeId: string;
  selectUnit: (unit: Unit) => void;
  selectedUnit?: string;
  isAdmin: boolean;
  setSaving: (saving?: 'saving' | 'done' | 'error') => void;
}

const baseUrl = process.env.API_URL || 'http://localhost:5000';

export default function SyllabusSidebar(props: SyllabusSidebarProps) {
  const { isAdmin, sections, courseName, selectUnit, selectedUnit, setSaving } =
    props;
  const { data: session } = useSession();

  const dispatch = useAppDispatch();

  const [sectionFormOpen, setSectionFormOpen] = useState(false);

  function closeSectionForm() {
    setSectionFormOpen(false);
  }

  async function deleteSection(sectionId: string) {
    dispatch(deleteSectionReducer({ sectionId }));
    await axios.delete(`${baseUrl}/section/${sectionId}`, {
      headers: {
        Authorization: (session as SessionWithToken)!.accessToken,
      },
    });
  }

  return (
    <div className='h-screen min-h-full min-w-max bg-white shadow-xl relative box-border flex flex-col'>
      <div className='flex p-4'>
        <h2 className='my-auto text-2xl text-primary-gray font-semibold w-[12vw]'>
          {courseName}
        </h2>
        <div className='w-10 h-10 rounded-full bg-primary-red bg-opacity-50 ml-4'></div>
      </div>
      <div className='py-12 overflow-y-auto'>
        <ul>
          {sections.map((section, index) => (
            <li key={index} className='pt-4'>
              <SyllabusSection
                setSaving={setSaving}
                isAdmin={isAdmin}
                deleteSection={deleteSection}
                selectedUnit={selectedUnit}
                selectUnit={selectUnit}
                section={section}
              />
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
          {sectionFormOpen && <SectionForm setSaving={setSaving} closeForm={closeSectionForm} />}
        </div>
      </div>
    </div>
  );
}
