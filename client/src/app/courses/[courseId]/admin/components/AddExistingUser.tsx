import { DbUser, SessionWithToken, Role } from '@/@types';
import React, { useEffect, useState } from 'react';
import { UserSelect } from './UserSelect';
import { RoleSelect } from './RoleSelect';
import IconButton from '@/components/buttons/iconButton';
import { MdOutlinePersonAddAlt } from 'react-icons/md';
import { useSession } from 'next-auth/react';

type AddUserProps = {
  courseId: string;
  setShowExistingUser: React.Dispatch<React.SetStateAction<boolean>>;
  roles: Role[];
};

export default function AddExistingUser({
  setShowExistingUser,
  courseId,
  roles,
}: AddUserProps) {
  const [potentialUsers, setPotentialUsers] = useState<DbUser[]>();
  const [selectedUser, setSelectedUser] = useState<DbUser>();
  const [selectedRole, setSelectedRole] = useState<Role>();
  const session = useSession().data as SessionWithToken;

  useEffect(() => {
    (async () => {
      try {
        const [totalUsersRes, instructorsRes, studentsRes] = await Promise.all([
          fetch(`http://localhost:5000/6565c3bdf515f6ec9392f30e/users`), // TODO: replace with process.env.API_URL once orgId is dynamic
          fetch(`http://localhost:5000/${courseId}/instructors`),
          fetch(`http://localhost:5000/${courseId}/students`),
        ]);

        const [totalUsers, instructors, students]: [
          DbUser[],
          DbUser[],
          DbUser[]
        ] = await Promise.all([
          totalUsersRes.json(),
          instructorsRes.json(),
          studentsRes.json(),
        ]);

        const existingUsersIds = [...instructors, ...students].map(
          (user) => user.id
        );
        const potentialUsers = totalUsers.filter(
          (user) => !existingUsersIds.includes(user.id)
        );

        setPotentialUsers(potentialUsers);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [courseId]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setShowExistingUser(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setShowExistingUser]);

  function closeModal() {
    setShowExistingUser(false);
  }

  async function handleSubmit() {
    if (selectedUser && selectedRole) {
      try {
        const res = await fetch(
          `${process.env.API_URL || 'http://localhost:5000'}/user/${selectedUser.id}/${selectedRole.id}`,
          {
            method: 'PUT',
            headers: {
              Authorization: session.accessToken,
            },
          }
        );
        if (res.ok) closeModal();
        else throw new Error('Something went wrong!');
      } catch (e) {
        console.error(e);
      }
    } else {
      window.alert('Please select a user and a role!');
    }
  }

  return (
    <div className='absolute top-0 left-0 flex items-center justify-center w-full h-full bg-opacity-50 bg-slate-100'>
      <div className='fixed w-1/3 p-8 bg-white rounded-lg shadow-lg h-1/3'>
        <div>
          <div
            className='absolute text-xl cursor-pointer right-6 top-4'
            onClick={closeModal}
          >
            X
          </div>
          <h1 className='mx-auto mt-2 mb-6 text-2xl font-semibold text-center'>
            Add Existing User
          </h1>
          {!potentialUsers || !potentialUsers.length ? (
            <p>No new users found!</p>
          ) : (
            <>
              <div className='flex flex-col gap-6 px-6 my-8 justify-evenly'>
                <div className='flex flex-row justify-between mx-12'>
                  <p className='text-xl font-semibold'>User</p>
                  <UserSelect
                    users={potentialUsers}
                    setSelectedUser={setSelectedUser}
                  />
                </div>
                <div className='flex flex-row justify-between mx-12'>
                  <p className='text-xl font-semibold '>Role</p>
                  <RoleSelect roles={roles} setRole={setSelectedRole} />
                </div>
              </div>
              <div className='w-1/3 py-3 mx-auto'>
                <IconButton
                  icon={<MdOutlinePersonAddAlt />}
                  title='Submit'
                  onClick={handleSubmit}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
