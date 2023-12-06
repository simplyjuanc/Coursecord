import { DbUser, User } from '@/types';
import React from 'react';

type UserSelectProps = {
  users: User[];
  setSelectedUser: (user: User | undefined) => void;
};
export function UserSelect({ users, setSelectedUser }: UserSelectProps) {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedUser(users.find(user => user.id === e.target.value));
  }

  return (
    <select className='text-center rounded-md ' name="users" id="users" onChange={handleChange}>
      <option value="">Select user</option>
      {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
    </select>
  );
}
