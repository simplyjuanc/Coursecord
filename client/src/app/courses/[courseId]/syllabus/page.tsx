'use client';
import SyllabusSidebar from '@/components/syllabusSidebar/syllabusSidebar';
import { CompiledSection, Section, SessionWithToken, Unit } from '@/types';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { MdOutlineEdit } from 'react-icons/md';
import { AiOutlineSave } from 'react-icons/ai';
import { RiDeleteBin4Line } from 'react-icons/ri';
import Markdown from '@/components/markdown-render/markdownRenderer';
import MarkdownForm from '@/components/syllabusForms/markdownForm';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { deleteUnit as deleteUnitReducer, updateUnit } from '@/store/slices/courseSlice';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';

export default function Syllabus() {
  const dispatch = useAppDispatch();

  const [activeUnit, setActiveUnit] = useState<Unit>();
  const [editMode, setEditMode] = useState(false);
  const course = useAppSelector((state) => state.course.courseInfo);
  const syllabus: CompiledSection[] | undefined = useAppSelector(
    (state) => state.course.syllabus
  );
  const [editText, setEditText] = useState<string>('');
  const [saving, setSaving] = useState<'saving' | 'done'>();
  const { data: session } = useSession();

  const user = useAppSelector((state) => state.user);
  const isAdmin =
    user && user.roles.map((role) => role.title).includes('admin');

  function selectUnit(unit: Unit) {
    setActiveUnit(unit.id !== activeUnit?.id ? unit : undefined);
    setEditText(unit.markdown_body);
    setSaving(undefined);
  }

  if (!activeUnit && editMode) setEditMode(false);

  async function saveChanges() {
    setActiveUnit((prev) => ({ ...prev!, markdown_body: editText }));
    setEditMode(false);
    setSaving('saving');
    await axios.put(
      `${baseUrl}/unit/${activeUnit!.id}`,
      {
        markdown_body: editText,
      },
      {
        headers: {
          Authorization: (session as SessionWithToken)!.accessToken,
        },
      }
    );
    dispatch(
      updateUnit({ newUnit: { ...activeUnit!, markdown_body: editText } })
    );
    setSaving('done');
  }

  async function deleteUnit() {
    dispatch(deleteUnitReducer({ unitId: activeUnit!.id }));
    setActiveUnit(undefined);
    await axios.delete(`${baseUrl}/unit/${activeUnit!.id}`, {
      headers: {
        Authorization: (session as SessionWithToken)!.accessToken,
      },
    });
  }

  return (
    <>
      <section className='flex flex-grow h-screen'>
        <div className='flex flex-col w-[60vw] mx-auto h-screen overflow-y-auto'>
          <div className='flex w-full justify-end'>
            <h2 className='text-4xl pl-4 py-1 my-4 mx-auto border-l-primary-red border-opacity-30 border-l-[0.5rem] border-l-solid rounded-tl rounded-bl align-middle font-semibold'>
              {activeUnit != null
                ? activeUnit.title
                : 'Choose a unit to view from the right!'}
            </h2>
            {isAdmin && editMode && (
              <>
                <button
                  onClick={deleteUnit}
                  className='mx-4 my-4 bg-primary-red bg-opacity-30 aspect-square rounded-xl text-2xl p-2 hover:bg-primary-red hover:bg-opacity-50'
                >
                  <RiDeleteBin4Line />
                </button>
                <button
                  onClick={saveChanges}
                  className='mx-4 my-4 bg-primary-red bg-opacity-30 aspect-square rounded-xl text-2xl p-2 hover:bg-primary-red hover:bg-opacity-50'
                >
                  <AiOutlineSave />
                </button>
              </>
            )}
            {isAdmin && activeUnit != null && (
              <button
                onClick={() => setEditMode((prev) => !prev)}
                className='mx-4 my-4 bg-primary-red bg-opacity-30 aspect-square rounded-xl text-2xl p-2 hover:bg-primary-red hover:bg-opacity-50'
              >
                <MdOutlineEdit />
              </button>
            )}
          </div>
          {activeUnit != null && editMode ? (
            <MarkdownForm text={editText} setText={setEditText} />
          ) : (
            activeUnit && <Markdown markdown={activeUnit.markdown_body} />
          )}
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
