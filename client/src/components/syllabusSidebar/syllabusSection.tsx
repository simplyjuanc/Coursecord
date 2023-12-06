import { CgAddR, CgAlbum } from 'react-icons/cg';
import IconButton from '../buttons/iconButton';
import UnitForm from '../syllabusForms/unitForm';
import { useState } from 'react';
import { RiBook2Line } from 'react-icons/ri';
import { FaPencilRuler } from 'react-icons/fa';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { CompiledSection, SessionWithToken, Unit } from '@/types';
import { MdOutlineEdit } from 'react-icons/md';
import { IoIosClose } from 'react-icons/io';
import { useAppDispatch } from '@/store';
import { updateSection } from '@/store/slices/courseSlice';
import * as api from '@/services/apiClientService';
import { useSession } from 'next-auth/react';

type SyllabusSectionProps = {
  isAdmin: boolean;
  section: CompiledSection;
  selectedUnit?: string;
  selectUnit: (unit: Unit) => void;
  deleteSection: (sectionId: string) => void;
  setSaving: (saving?: 'saving' | 'done' | 'error') => void;
};

export default function SyllabusSection(props: SyllabusSectionProps) {
  const {
    isAdmin,
    section,
    selectedUnit,
    selectUnit,
    deleteSection,
    setSaving,
  } = props;

  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const [unitFormOpen, setUnitFormOpen] = useState(false);
  const [mode, setMode] = useState<'edit' | 'active'>();
  const [editTitle, setEditTitle] = useState(section.title);

  const unitIcons = {
    lesson: <RiBook2Line />,
    exercise: <FaPencilRuler />,
    test: <IoDocumentTextOutline />,
  };

  function closeUnitForm() {
    setUnitFormOpen(false);
  }

  async function editSection() {
    if (!editTitle) return;

    dispatch(updateSection({ newSection: { ...section, title: editTitle } }));
    await api.editSection(
      section.id,
      { title: editTitle },
      session as SessionWithToken
    );
  }

  return (
    <>
      <div className='flex flex-row-reverse'>
        <div
          className={`w-1.5 rounded-tl-2xl rounded-bl-2xl bg-primary-1 bg-opacity-${mode != null ? '50' : '10'}`}
        ></div>

        <div className='w-full px-4'>
          <div
            className={
              `flex text-xl p-2 min-w-full rounded-xl` +
              (mode != null
                ? ' bg-primary-1 bg-opacity-10 text-primary-1'
                : ' hover:bg-primary-1 hover:bg-opacity-5')
            }
          >
            <button
              className='flex flex-grow'
              onClick={() =>
                setMode((prev) => (prev === undefined ? 'active' : undefined))
              }
            >
              <div className='my-auto'>
                <CgAlbum />
              </div>
              <h2 className='font-semibold pl-3'>{section.title}</h2>
            </button>
            {isAdmin && (
              <div className='ml-auto flex'>
                <div
                  onClick={() =>
                    setMode((prev) => (prev === undefined ? 'edit' : undefined))
                  }
                  className={` hover:${
                    mode === 'active' ? 'text-primary-black' : 'text-primary-1'
                  }`}
                >
                  <MdOutlineEdit />
                </div>
                <div
                  onClick={() => {
                    deleteSection(section.id);
                  }}
                  className={` hover:${
                    mode === 'active' ? 'text-primary-black' : 'text-primary-1'
                  }`}
                >
                  <IoIosClose />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {mode === 'edit' && (
        <div className='flex flex-col px-5 my-2'>
          <label>Name:</label>
          <input
            type='text'
            className='border-solid border-primary-2 border-opacity-50 border-2 rounded-md h-10 max-w-full my-2 px-2'
            required
            onChange={(e) => {
              setEditTitle(e.target.value);
            }}
            value={editTitle}
          />
          <button
            onClick={() => editSection()}
            className='bg-primary-1 bg-opacity-30 rounded-lg w-3/4 mx-auto hover:bg-opacity-50 hover:text-white'
          >
            Submit Change
          </button>
        </div>
      )}
      {mode === 'active' && (
        <div className='w-full pr-4 pl-4'>
          <ol className='border-solid border-2 border-primary-2 border-opacity-20 mt-2 rounded-lg p-2'>
            {section.course_units.map((unit, index) => {
              return (
                <li key={index}>
                  <button
                    onClick={() => selectUnit(unit)}
                    className={`flex items-center text-xl p-2 min-w-full rounded-xl mt-2 ${
                      selectedUnit === unit.id
                        ? 'bg-primary-1 bg-opacity-10 text-primary-1'
                        : 'hover:bg-primary-1 hover:bg-opacity-5 rounded-xl p-2 w-full'
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
                    setUnitFormOpen((prev) => !prev);
                  }}
                />
              </div>
            )}
            {unitFormOpen && (
              <UnitForm
                setSaving={setSaving}
                sectionId={section.id}
                closeForm={closeUnitForm}
              />
            )}
          </ol>
        </div>
      )}
    </>
  );
}
