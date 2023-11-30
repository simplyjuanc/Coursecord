'use client';
import SyllabusSidebar from '@/components/syllabusSidebar/syllabusSidebar';
import { CompiledSection, Section, Unit } from '@/types';
import { useState } from 'react';
import Markdown from 'react-markdown';
import MarkdownStyle from './syllabus.module.css';
import { useAppSelector } from '@/store';

export default function Syllabus() {
  const [activeUnit, setActiveUnit] = useState<Unit>();

  const course = useAppSelector((state) => state.course.courseInfo);
  const syllabus: CompiledSection[] | undefined = useAppSelector(
    (state) => state.course.syllabus
  );

  const user = useAppSelector((state) => state.user);
  const isAdmin = user && user.roles.map((role) => role.title).includes('admin');  

  function selectUnit(unit: Unit) {
    setActiveUnit(unit.id !== activeUnit?.id ? unit : undefined);
  }


  return (
    <>
      <section className='flex flex-grow flex-row border-solid border-black h-screen'>
        <div className='w-[60vw] h-screen overflow-y-auto'>
          <div className='react-markdown px-32 mx-auto'>
            <Markdown className={MarkdownStyle.markdown}>
              {activeUnit != null ? activeUnit.markdown_body : '# Choose a unit to view from the right!'}
            </Markdown>
          </div>
        </div>
      </section>
      <div className='self-end'>
        <SyllabusSidebar
          isAdmin={isAdmin}
          activeId={''}
          sections={syllabus || []}
          courseName={course?.title || ''}
          selectUnit={selectUnit}
          selectedUnit={activeUnit?.id}
        />
      </div>
    </>
  );
}
