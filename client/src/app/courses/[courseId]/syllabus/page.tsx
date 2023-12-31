'use client';
import SyllabusSidebar from '@/components/syllabusSidebar/syllabusSidebar';
import { CompiledSection, Section, SessionWithToken, Unit } from '@/types';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { MdOutlineEdit } from 'react-icons/md';
import { AiOutlineSave } from 'react-icons/ai';
import { RiDeleteBin4Line } from 'react-icons/ri';
import Markdown from '@/components/markdown-render/markdownRenderer';
import MarkdownForm from '@/components/syllabusForms/markdownForm';
import { useSession } from 'next-auth/react';
import {
  deleteUnit as deleteUnitReducer,
  setCourseInfo,
  setSyllabus,
  updateUnit,
} from '@/store/slices/courseSlice';
import Spinner from '@/components/spinner/spinner';
import { getCourseData } from '@/services/apiClientService';
import { useParams } from 'next/navigation';
import * as api from '@/services/apiClientService';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';

export default function Syllabus() {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { courseId } = useParams() as { courseId: string };

  const isAdmin = useAppSelector((state) => state.user.roles.admin);
  const courseInfo = useAppSelector((state) => state.course.courseInfo);
  const syllabus: CompiledSection[] = useAppSelector(
    (state) => state.course.syllabus
  );
  const cachedUnits = useAppSelector((state) => state.course.cachedUnits);

  const [editMode, setEditMode] = useState(false);
  const [unit, setUnit] = useState<Unit>();
  const [saving, setSaving] = useState<'saving' | 'done' | 'error'>();

  useEffect(() => {
    if (!courseInfo) {
      getCourseData(courseId).then((courseInfo) => {
        if (courseInfo) dispatch(setCourseInfo({ info: courseInfo }));
      });
    }
    if (!syllabus.length && session) {
      api.getSyllabus(courseId, session as SessionWithToken).then((syllabus) => {
        console.log('SYLLABUS', syllabus);
        dispatch(setSyllabus({ syllabus }));
      });
    }
  }, []);

  async function selectUnit(unitInfo: Unit) {
    setSaving(undefined);
    setEditMode(false);

    if (!cachedUnits[unitInfo.id]) {
      const unit = await api.getUnit(
        unitInfo.id,
        courseId,
        session as SessionWithToken
      );
      setUnit(unit);
    } else {
      setUnit(cachedUnits[unitInfo.id]);
    }
  }

  async function saveChanges() {
    setEditMode(false);
    setSaving('saving');
    console.log('unit :>> ', unit);
    const unitEdited = await api.editUnit(unit!, session as SessionWithToken);
    if (unitEdited) {
      dispatch(
        updateUnit({
          id: unit!.id,
          newUnit: unit!,
        })
      );
      setSaving('done');
      setTimeout(() => {
        setSaving(undefined);
      }, 1000);
      return;
    }
    setSaving('error');
    setTimeout(() => {
      setSaving(undefined);
    }, 1000);
  }

  async function deleteUnit() {
    dispatch(deleteUnitReducer({ unitId: unit!.id }));
    setUnit(undefined);
    const deleted = await api.deleteUnit(unit!.id, session as SessionWithToken);
  }

  if (!unit && editMode) setEditMode(false);

  return (
    <>
      <section className='flex flex-col flex-grow h-screen bg-white'>
        <div className='flex flex-row flex-nowrap justify-center mx-auto w-[60vw] relative'>
          {unit != null ? (
            editMode ? (
              <input
                className='text-3xl px-6 py-1 my-6 rounded-lg p-1 border-primary-2 border border-opacity-40 font-medium text-center'
                onChange={(e) =>
                  setUnit((prev) => ({ ...prev!, title: e.target.value }))
                }
                value={unit.title}
              />
            ) : (
              <h2 className='text-3xl px-6 py-1 my-6 border-b-primary-1 border-opacity-30 border-b-[0.5rem] border-b-solid rounded-b align-middle font-semibold'>
                {unit.title}
              </h2>
            )
          ) : (
            <h2 className='text-xl px-6 py-1 my-6 border-b-primary-1 border-opacity-30 border-b-4 border-b-solid rounded-b align-middle font-medium'>
              Choose a unit to view from the right!
            </h2>
          )}
          {isAdmin && (
            <div className='flex absolute right-1 top-1'>
              {saving != null && <Spinner active={saving === 'saving'} />}
              {editMode && (
                <>
                  <button
                    onClick={deleteUnit}
                    className='mx-4 my-6 bg-primary-1 bg-opacity-30 aspect-square rounded-xl text-2xl p-2 hover:bg-primary-1 hover:bg-opacity-50'
                  >
                    <RiDeleteBin4Line />
                  </button>
                  <button
                    onClick={saveChanges}
                    className='mx-4 my-6 bg-primary-1 bg-opacity-30 aspect-square rounded-xl text-2xl p-2 hover:bg-primary-1 hover:bg-opacity-50'
                  >
                    <AiOutlineSave />
                  </button>
                </>
              )}
              {unit != null && (
                <button
                  onClick={() => setEditMode((prev) => !prev)}
                  className='mx-4 my-6 max-h-min bg-primary-1 bg-opacity-30 aspect-square rounded-xl text-2xl p-2 hover:bg-primary-1 hover:bg-opacity-50'
                >
                  <MdOutlineEdit />
                </button>
              )}
            </div>
          )}
        </div>
        <div className='flex flex-col w-[60vw] mx-auto min-h-[85vh] overflow-y-auto bg-white shadow-md rounded-xl px-4 border border-primary-2 border-opacity-10'>
          {unit != null && editMode ? (
            <MarkdownForm
              text={unit.markdown_body}
              type={unit.type}
              setText={(text) =>
                setUnit((prev) => ({ ...prev!, markdown_body: text }))
              }
              setType={(type) =>
                setUnit((prev) => ({
                  ...prev!,
                  type: type as 'lesson' | 'exercise' | 'test',
                }))
              }
              saveChanges={saveChanges}
            />
          ) : (
            unit && <Markdown markdown={unit.markdown_body} />
          )}
        </div>
      </section>
      <div className='self-end'>
        <SyllabusSidebar
          setSaving={setSaving}
          isAdmin={isAdmin}
          activeId={''}
          sections={syllabus || []}
          courseName={courseInfo?.title || ''}
          selectUnit={selectUnit}
          selectedUnit={unit?.id}
        />
      </div>
    </>
  );
}
