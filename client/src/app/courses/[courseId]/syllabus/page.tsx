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
import axios from 'axios';
import { useSession } from 'next-auth/react';
import {
  deleteUnit as deleteUnitReducer,
  setCourseInfo,
  setSyllabus,
  updateUnit,
} from '@/store/slices/courseSlice';
import Spinner from '@/components/spinner/spinner';
import { editUnit, getSyllabus, getUnit } from '@/services/apiClientService';
import { getCourseData } from '@/services/apiClientService';
import { useParams } from 'next/navigation';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';

export default function Syllabus() {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { courseId } = useParams() as { courseId: string };

  const isAdmin = useAppSelector((state) =>
    state.user.roles.some((role) => role.title === 'admin')
  );
  const courseInfo = useAppSelector((state) => state.course.courseInfo);
  const syllabus: CompiledSection[] | undefined = useAppSelector(
    (state) => state.course.syllabus
  );
  const cachedUnits = useAppSelector((state) => state.course.cachedUnits);

  const [editMode, setEditMode] = useState(false);
  const [unit, setUnit] = useState<Unit>();
  const [saving, setSaving] = useState<'saving' | 'done' | 'error'>();

  useEffect(() => {
    if (!courseInfo) {
      getCourseData(courseId).then((courseInfo) => {
        dispatch(setCourseInfo({ info: courseInfo }));
      });
    }
    if (!syllabus.length && session) {
      getSyllabus(courseId, session as SessionWithToken).then((syllabus) => {
        dispatch(setSyllabus({ syllabus }));
      });
    }
  }, []);

  async function selectUnit(unitInfo: Unit) {
    setSaving(undefined);
    setEditMode(false);

    if (!cachedUnits[unitInfo.id]) {
      const unit = await getUnit(unitInfo.id, session as SessionWithToken);
      setUnit(unit);
    } else {
      setUnit(cachedUnits[unitInfo.id]);
    }
  }

  async function saveChanges() {
    setEditMode(false);
    setSaving('saving');
    const unitEdited = await editUnit(
      unit!,
      session as SessionWithToken
    );
    if (unitEdited) {
      dispatch(
        updateUnit({
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
    await axios.delete(`${baseUrl}/unit/${unit!.id}`, {
      headers: {
        Authorization: (session as SessionWithToken)!.accessToken,
      },
    });
  }

  if (!unit && editMode) setEditMode(false);

  return (
    <>
      <section className='flex flex-grow h-screen bg-white'>
        <div className='flex flex-col w-[60vw] mx-auto h-[95vh] overflow-y-auto bg-white shadow-lg m-auto rounded-xl px-4 border-2 border-primary-2 border-opacity-50'>
          <div className='flex w-full justify-end'>
            <h2 className='text-4xl pl-4 py-1 my-4 mx-auto border-l-primary-1 border-opacity-30 border-l-[0.5rem] border-l-solid rounded-tl rounded-bl align-middle font-semibold'>
              {unit != null ? (
                editMode ? (
                  <input
                    className='rounded-lg p-1 border-primary-2 border-2 border-opacity-100'
                    onChange={(e) =>
                      setUnit((prev) => ({ ...prev!, title: e.target.value }))
                    }
                    value={unit.title}
                  />
                ) : (
                  <span className='p-1'>{unit.title}</span>
                )
              ) : (
                'Choose a unit to view from the right!'
              )}
            </h2>
            {isAdmin && saving != null && (
              <Spinner active={saving === 'saving'} />
            )}
            {isAdmin && editMode && (
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
            {isAdmin && unit != null && (
              <button
                onClick={() => setEditMode((prev) => !prev)}
                className='mx-4 my-6 max-h-min bg-primary-1 bg-opacity-30 aspect-square rounded-xl text-2xl p-2 hover:bg-primary-1 hover:bg-opacity-50'
              >
                <MdOutlineEdit />
              </button>
            )}
          </div>
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
                  type: type as 'lesson' | 'excercise' | 'test',
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
