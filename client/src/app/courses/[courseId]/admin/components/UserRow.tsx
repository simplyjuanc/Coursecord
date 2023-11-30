'use client';
import React from 'react';
import { MdOutlineModeEdit, MdOutlineRestoreFromTrash } from 'react-icons/md';
import { DbUser, Role, SessionWithToken } from '@/types';
import { useSession } from 'next-auth/react';
import EditUser from './EditUser';

type UserRowProps = {
  user: DbUser;
  roles: Role[];
  courseId: string;
};

export default function UserRow({
  user,
  roles,
  courseId
}: UserRowProps): React.JSX.Element {
  const baseUrl = process.env.API_URL || 'http://localhost:5000';
  const session = useSession().data as SessionWithToken;
  const [showUser, setShowUser] = React.useState(false);

  const userRoles = user.roles
    .map((id) => {
      const userRole = roles.find((role) => role.id === id);
      if (!userRole) return;
      return userRole.title[0].toUpperCase() + userRole.title.slice(1);
    })
    .sort((a, b) => a!.localeCompare(b!) || 0);

  async function handleEdit() {
    setShowUser(true);
  }

  async function handleDelete() {
    try {
      const res = await fetch(`${baseUrl}/user/${user.id}`, {
        method: 'DELETE',
        headers: { Authorization: session.accessToken },
      });
      if (res.ok) console.log(user);
      else window.alert('Something went wrong');
    } catch (error) {
      console.error('handleDelete - error :>> ', error);
    }
  }

  return (
    <>
      <div className='flex flex-row justify-center col-span-1 gap-2 py-2 bg-white border-b border-primary-gray border-opacity-40'>
        <div className='cursor-pointer' onClick={handleEdit}>
          <MdOutlineModeEdit />
        </div>
        <div className='cursor-pointer' onClick={handleDelete}>
          <MdOutlineRestoreFromTrash />
        </div>
      </div>
      <div className='col-span-2 py-2 text-center bg-white border-b border-primary-gray border-opacity-40'>{user.name}</div>
      <div className='col-span-2 py-2 text-center bg-white border-b border-primary-gray border-opacity-40'>{user.email}</div>
      <div className='col-span-2 py-2 text-center bg-white border-b border-primary-gray border-opacity-40'>
        {userRoles && userRoles.join(', ')}
      </div>
      {showUser && (
        <EditUser
          user={user}
          courseId={courseId}
          setShowUser={setShowUser}
          roles={roles}
        />
      )}
    </>
  );
}