import { DbUser, SessionWithToken, Role } from '@/types';
import React, { useEffect, useState } from 'react';
import { UserSelect } from './UserSelect';
import { RoleSelect } from './RoleSelect';
import IconButton from '@/components/buttons/iconButton';
import { MdOutlinePersonAddAlt } from 'react-icons/md';
import { useSession } from 'next-auth/react';

type EditUserProps = {
  user: DbUser;
  courseId: string;
  setShowUser: React.Dispatch<React.SetStateAction<boolean>>;
  roles: Role[];
};

export default function EditUser({
  user,
  setShowUser,
  courseId,
  roles,
}: EditUserProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(user.roles);
  const session = useSession().data as SessionWithToken;
  const baseUrl = process.env.API_URL || 'http://localhost:5000';

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setShowUser(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setShowUser]);

  function handleInputs(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, checked } = e.target as HTMLInputElement;
    console.log('value, checked :>> ', value, checked);
    setSelectedRoles((prevRoles) =>
      checked ? 
        [...prevRoles, value] : 
        prevRoles.filter((role) => role !== value)
    );
    console.log('selectedRoles :>> ', selectedRoles);
  }

  async function handleSubmit() {
    if (!selectedRoles) return window.alert('Please select a role!');

    try {
      // TODO write backend route to delete/add all roles for a user, or to toggle them in bulk
      const roleDeletion = roles.map((role) => {
          return fetch(`${baseUrl}/user/${user.id}/${role.id}`, {
            method: 'DELETE',
            headers: { Authorization: session.accessToken },
          })
      });

      const deletedRoles = await Promise.all(roleDeletion);
      const deletionOk = deletedRoles.every((role) => role.ok);
      if (!deletionOk) throw new Error('Not all roles could be deleted.');

      const results = selectedRoles.map(async (role) => {
        return fetch(`${baseUrl}/user/${user.id}/${role}`, {
          method: 'PUT',
          headers: {
            Authorization: session.accessToken,
          },
        });
      });

      const newRoles = await Promise.all(results);
      const additionOk = newRoles.every((role) => role.ok);

      if (additionOk) closeModal();
      else throw new Error('Not all roles could be assigned.');
    } catch (e) {
      console.error(e);
    }
  }

  function closeModal() {
    setShowUser(false);
  }

  return (
    <div className='absolute top-0 left-0 flex items-center justify-center w-full h-full bg-opacity-50 bg-slate-100 z-10'>
      <div className='fixed w-1/3 p-8 bg-white rounded-lg shadow-lg z-20'>
        <div>
          <div
            className='absolute text-xl cursor-pointer right-6 top-4'
            onClick={closeModal}
          >
            X
          </div>
          <h1 className='mx-auto mt-2 mb-6 text-2xl font-semibold text-center'>
            Edit User
          </h1>
          <div className='flex flex-col gap-6 px-6 my-8 justify-evenly'>
            <div className='flex flex-row justify-between mx-12'>
              <p className='text-xl font-semibold'>User</p>
              <p>{user.name}</p>
            </div>
            <div className='flex flex-row justify-between mx-12 gap-8'>
              <div>
                <p className='text-xl font-semibold '>Role</p>
                <p className='text-xs font-thin italic'>
                  Please note that roles with more permissions naturally cover
                  those with less.
                </p>
              </div>
              <div>
                {roles.map((role) => (
                  <div key={role.id} className='flex flex-row gap-3'>
                    <input
                      value={role.id}
                      type='checkbox'
                      onChange={handleInputs}
                      checked={selectedRoles?.includes(role.id)}
                    />
                    <label>
                      {role.title[0].toUpperCase() + role.title.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
              {/* <RoleSelect roles={roles} setRole={setSelectedRole} /> */}
            </div>
          </div>
          <div className='w-1/3 py-3 mx-auto'>
            <IconButton
              icon={<MdOutlinePersonAddAlt />}
              title='Submit'
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
