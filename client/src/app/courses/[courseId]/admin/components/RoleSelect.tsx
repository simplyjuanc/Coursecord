import { TRole } from '@/@types';
import React from 'react';

type RoleSelectProps = {
  roles: TRole[];
  setRole: React.Dispatch<React.SetStateAction<TRole | undefined>>;
};
export function RoleSelect({ roles, setRole }: RoleSelectProps) {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setRole(roles.find((role) => role.id === e.target.value));
  }
  
  return (
    <select
      name='role'
      placeholder='Student'
      className='ml-auto'
      onChange={handleChange}
    >
      <option value=''>Select role</option>
      {roles.map((role) => (
        <option key={role.id} value={role.id}>
          {role.title[0].toUpperCase() + role.title.slice(1)}
        </option>
      ))}
    </select>
  );
}
