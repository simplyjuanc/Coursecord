import React, { useEffect, useState } from 'react';
import { RoleSelect } from './RoleSelect';
import { IRole } from '@/types';
import IconButton from '@/components/buttons/iconButton';
import { MdOutlinePersonAddAlt } from 'react-icons/md';

type AddUserProps = {
  courseId: string;
  setShowNewUser: React.Dispatch<React.SetStateAction<boolean>>;
  roles: IRole[];
};

export default function AddNewUser({
  setShowNewUser,
  courseId, // see TODO below
  roles,
}: AddUserProps) {
  const [partialFormState, setPartialFormState] = useState({
    name: '',
    email: '',
  });
  const [selectedRole, setSelectedRole] = useState<IRole>();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setShowNewUser(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setShowNewUser]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPartialFormState({
      ...partialFormState,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!partialFormState.name || !partialFormState.email || !selectedRole) {
      window.alert('Please fill out all fields');
    } else {
      // TODO: Fetch request to add new user to course, looking for their email or their name
      // TODO: Add new user to the course (need to create addUser route and controller in backend)
      closeModal();
    }
  }

  function closeModal() {
    setShowNewUser(false);
  }

  return (
    <div className='absolute top-0 left-0 flex items-center justify-center w-full h-full bg-opacity-50 bg-slate-100 z-10'>
      <div className='fixed w-1/3 p-8 bg-white rounded-lg shadow-lg z-20'>
        <div
          className='absolute text-xl cursor-pointer right-6 top-4'
          onClick={closeModal}
        >
          X
        </div>
        <h1 className='mx-auto mt-2 mb-6 text-2xl font-semibold text-center'>
          Add New User
        </h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div className='flex flex-row justify-between mx-12'>
            <label htmlFor='name' className='text-xl font-semibold'>
              Name
            </label>
            <input
              name='name'
              onChange={handleInputChange}
              type='text'
              placeholder='Kynncer Doe'
              className='px-5 ml-auto text-right border rounded-md'
            />
          </div>

          <div className='flex flex-row justify-between mx-12'>
            <label htmlFor='email' className='text-xl font-semibold'>
              Email
            </label>
            <input
              name='email'
              onChange={handleInputChange}
              type='email'
              placeholder='required.madness@gmail.com'
              className='px-5 ml-auto text-right border rounded-md'
            />
          </div>

          <div className='flex flex-row justify-between mx-12'>
            <label htmlFor='role' className='text-xl font-semibold'>
              Role
            </label>
            <RoleSelect roles={roles} setRole={setSelectedRole} />
          </div>
          <div className='w-1/3 py-3 mx-auto'>
            <IconButton
              icon={<MdOutlinePersonAddAlt />}
              title='Submit'
              onClick={handleSubmit}
            ></IconButton>
          </div>
        </form>
      </div>
    </div>
  );
}
