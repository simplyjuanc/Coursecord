import { DbUser } from '@/@types';
import React, { useEffect, useState } from 'react';



type AddUserProps = {
  courseId: string,
  setShowExistingUser:React.Dispatch<React.SetStateAction<boolean>>
}

export default function AddExistingUser({setShowExistingUser, courseId}:AddUserProps) {
  const [potentialUsers, setPotentialUsers] = useState<DbUser[]>();

  useEffect(() => {
    (async () => {
      try {
        console.log('courseId :>> ', courseId);
        const totalUsersRes = await fetch(`http://localhost:5000/6565c3bdf515f6ec9392f30e/users`); // TODO: replace with process.env.API_URL once orgId is dynamic
        const totalUsers:DbUser[] = await totalUsersRes.json();

        const instructorsRes = await fetch(`http://localhost:5000/${courseId}/instructors`); 
        const instructors:DbUser[] = await instructorsRes.json();
        const studentsRes = await fetch(`http://localhost:5000/${courseId}/students`); 
        const students:DbUser[] = await studentsRes.json();
        
        const existingUsersIds = [...instructors, ...students].map(user => user.id);
        const potentialUsers = totalUsers.filter(user => !existingUsersIds.includes(user.id));

        setPotentialUsers(potentialUsers);
      } catch (e) {
        console.error(e);
      }
    })();
    
  }, [courseId]);

  function closeModal() {
    setShowExistingUser(false);
  }
  
  return (
    <div className='w-full h-full bg-slate-100 bg-opacity-50 absolute top-0 left-0 flex items-center justify-center'>
      <div className='w-1/3 h-1/3 bg-white rounded-lg shadow-lg p-8 fixed'>
        <div>
        <div className='cursor-pointer absolute right-6 top-4 text-xl' onClick={closeModal}>X</div>
          <h1 className='mx-auto text-center mt-2 mb-6 font-semibold text-2xl'>Add Existing User</h1>
          { !potentialUsers ? 
            <p>No users found!</p> : 
            <div>
              {UserOptions(potentialUsers) }
              <select name='role' placeholder='Student' className='ml-auto'>
                <option value="">Select role</option>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            }
        </div>
      </div> 
    </div>
  );
}


function UserOptions(users: DbUser[]): React.ReactNode {
  return (
    <>
    <select name="users" id="users">
      <option value="">Select user</option>
      {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
    </select>
    </>
  );
}

