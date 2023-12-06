'use client';
import React from 'react';
import { MdOutlineRestoreFromTrash } from 'react-icons/md';

type UserRowProps = {
  user: { name: string; email: string; id: string };
  role: string;
  removeUser: (role: string, userId: string) => void;
};

export default function UserRow({
  user,
  role,
  removeUser,
}: UserRowProps): React.JSX.Element {
  const isAdmin = !(role === 'student' || role === 'instructor');

  return (
    <>
      <div className={`flex flex-row justify-center col-span-1 gap-2 py-2 bg-white border-b border-primary-2 border-opacity-40`}>
        <div
          className='cursor-pointer'
          onClick={() => {
            console.log('role, user.id :>> ', role, user.id);
            removeUser(role, user.id)
          }}
        >
          <MdOutlineRestoreFromTrash />
        </div>
      </div>
      <div className={`col-span-2 py-2 text-${isAdmin ? 'center' : 'left'} pl-4 text-${isAdmin ? 'sm' : 'xs'} bg-white border-b border-primary-2 border-opacity-40 overflow-hidden`}>
        {user.name}
      </div>
      <div className={`col-span-2 py-2 text-${isAdmin ? 'center' : 'left'} pl-4 text-${isAdmin ? 'sm' : 'xs'} bg-white border-b border-primary-2 border-opacity-40 overflow-hidden`}>
        {user.email}
      </div>
    </>
  );
}
