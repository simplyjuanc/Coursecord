import { DbUser, SessionWithToken, User } from '@/types';
import React, { useEffect, useState } from 'react';
import { UserSelect } from './UserSelect';
import IconButton from '@/components/buttons/iconButton';
import { MdOutlinePersonAddAlt } from 'react-icons/md';
import { useSession } from 'next-auth/react';
import { addUserToCourse, getUsers } from '@/services/apiClientService';
import { useAppDispatch } from '@/store';
import { addUserToCourse as addUserToCourseReducer } from '@/store/slices/managementSlice';

type AddUserProps = {
  courseId: string;
  setShowExistingUser: React.Dispatch<React.SetStateAction<boolean>>;
  role: string;
  existingUsers: User[];
};

export default function AddExistingUser({
  setShowExistingUser,
  courseId,
  role,
  existingUsers,
}: AddUserProps) {
  const [potentialUsers, setPotentialUsers] = useState<User[]>();
  const [selectedUser, setSelectedUser] = useState<User>();
  const session = useSession().data as SessionWithToken;
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      try {
        const users = await getUsers();
        const existingUserIds = existingUsers.map((user) => user.id);
        if (users) {
          const potentialUsers = users.filter(
            (user) => !existingUserIds.includes(user.id)
          );
          console.log(users, potentialUsers);
          setPotentialUsers(potentialUsers);
        }
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
    if (selectedUser) {
      try {
        const userAdded = await addUserToCourse(
          courseId,
          role,
          selectedUser.id,
          session
        );
        dispatch(
          addUserToCourseReducer({ courseId, role, user: selectedUser })
        );
        if (userAdded) closeModal();
        else throw new Error('Something went wrong!');
      } catch (e) {
        console.error(e);
      }
    } else {
      window.alert('Please select a user and a role!');
    }
  }

  return (
    <div className='absolute top-0 left-0 flex items-center justify-center w-full h-full bg-opacity-50 bg-slate-100 z-10'>
      <div className='fixed w-1/3 p-8 bg-white rounded-lg shadow-lg h-1/3 z-20'>
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
