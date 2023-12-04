// import React from 'react';

// type RoleSelectProps = {
//   roles: IRole[];
//   setRole: React.Dispatch<React.SetStateAction<IRole | undefined>>;
// };
// export function RoleSelect({ roles, setRole }: RoleSelectProps) {
//   function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
//     setRole(roles.find((role) => role.id === e.target.value));
//   }
  
//   return (
//     <select
//       name='role'
//       placeholder='Student'
//       className='px-5 text-center rounded-md'
//       onChange={handleChange}
//     >
//       <option value=''>Select role</option>
//       {roles.map((role) => (
//         <option key={role.id} value={role.id}>
//           {role.title[0].toUpperCase() + role.title.slice(1)}
//         </option>
//       ))}
//     </select>
//   );
// }
