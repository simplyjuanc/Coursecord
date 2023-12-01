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
import axios from 'axios';
import { useSession } from 'next-auth/react';

type SyllabusSectionProps = {
  isAdmin: boolean;
  section: CompiledSection;
  selectedUnit?: string;
  selectUnit: (unit: Unit) => void;
  deleteSection: (sectionId: string) => void;
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';

export default function SyllabusSection(props: SyllabusSectionProps) {
  const dispatch = useAppDispatch();
  const { isAdmin, section, selectedUnit, selectUnit, deleteSection } = props;
  const { data: session } = useSession();
  const [unitFormOpen, setUnitFormOpen] = useState(false);
  const [mode, setMode] = useState<'edit' | 'active'>();
  const [editTitle, setEditTitle] = useState(section.title);

  const unitIcons = {
    lesson: <RiBook2Line />,
    excercise: <FaPencilRuler />,
    test: <IoDocumentTextOutline />,
  };

  function closeUnitForm() {
    setUnitFormOpen(false);
  }

  async function editSection() {
    if (!editTitle) return;

    dispatch(updateSection({ newSection: { ...section, title: editTitle } }));
    await axios.put(
      `${baseUrl}/section/${section.id}`,
      { title: editTitle },
      {
        headers: {
          Authorization: (session as SessionWithToken)!.accessToken,
        },
      }
    );
  }

  return (
    <>
      <div className='flex flex-row-reverse'>
        {mode != null && (
          <div
            className={`w-1.5 rounded-tl-2xl rounded-bl-2xl bg-primary-red bg-opacity-50`}
          ></div>
        )}
        <div className='w-full pr-4 pl-4'>
          <div
            className={
              `flex text-2xl p-2 min-w-full rounded-xl` +
              (mode != null
                ? ' bg-primary-red bg-opacity-10 text-primary-red'
                : ' hover:bg-primary-red hover:bg-opacity-5')
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
            <div className='ml-auto flex'>
              <div
                onClick={() =>
                  setMode((prev) => (prev === undefined ? 'edit' : undefined))
                }
                className={` hover:${
                  mode === 'active' ? 'text-primary-black' : 'text-primary-red'
                }`}
              >
                <MdOutlineEdit />
              </div>
              <div
                onClick={() => {
                  deleteSection(section.id);
                }}
                className={` hover:${
                  mode === 'active' ? 'text-primary-black' : 'text-primary-red'
                }`}
              >
                <IoIosClose />
              </div>
            </div>
          </div>
        </div>
      </div>
      {mode === 'edit' && (
        <div className='flex flex-col px-5 my-2'>
          <label>Name:</label>
          <input
            type='text'
            className='border-solid border-primary-gray border-opacity-50 border-2 rounded-md h-10 max-w-full my-2 px-2'
            required
            onChange={(e) => {
              setEditTitle(e.target.value);
            }}
            value={editTitle}
          />
          <button
            onClick={() => editSection()}
            className='bg-primary-red bg-opacity-30 rounded-lg w-3/4 mx-auto hover:bg-opacity-50 hover:text-white'
          >
            Submit Change
          </button>
        </div>
      )}
      {mode === 'active' && (
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
                    setUnitFormOpen((prev) => !prev);
                  }}
                />
              </div>
            )}
            {unitFormOpen && (
              <UnitForm sectionId={section.id} closeForm={closeUnitForm} />
            )}
          </ol>
        </div>
      )}
    </>
  );
}
