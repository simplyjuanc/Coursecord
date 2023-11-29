import React, {useState} from 'react';
import { RoleSelect } from './RoleSelect';
import {  Role } from '@/@types';


type AddUserProps = {
  courseId: string,
  setShowNewUser:React.Dispatch<React.SetStateAction<boolean>>,
  roles: Role[]
}


export default function AddNewUser({setShowNewUser, courseId, roles}:AddUserProps) {
  const [formState, setFormState] = useState({ name: '', email: '', role: '' });
  const [selectedRole, setSelectedRole] = useState<Role>();

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  }


  // TODO: Fetch request to add new user to course, looking for their email or their name
  // TODO: Add new user to the course (need to create addUser route and controller in backend)



  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    console.log(formState)
    
    // setShowNewUser(false);
  }

  function closeModal() {
    setShowNewUser(false);
  }
  
  return (
    <div className='absolute top-0 left-0 flex items-center justify-center w-full h-full bg-opacity-50 bg-slate-100'>
      <div className='fixed w-1/3 p-8 bg-white rounded-lg shadow-lg h-1/3'>
        <div>
        <div className='absolute text-xl cursor-pointer right-6 top-4' onClick={closeModal}>X</div>
          <h1 className='mx-auto mt-2 mb-6 text-2xl font-semibold text-center'>Add New User</h1>
          
          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          
            <div className='flex flex-row justify-around px-4 flex-nowrap'>
              <label htmlFor='name'>Name</label>
              <input name='name' onChange={handleInputChange} type='text' placeholder='Kynncer Doe' className='ml-auto'/>
            </div>
            
            <div className='flex flex-row justify-around px-4 flex-nowrap'>
              <label htmlFor='email'>Email</label>
              <input name='email' onChange={handleInputChange} type='text' placeholder='required.madness@gmail.com' className='ml-auto'/>
            </div>

            <div className='flex flex-row justify-around px-4 flex-nowrap'>
              <label htmlFor='role'>Role</label>
              <RoleSelect roles={roles} setRole={setSelectedRole} />
            </div>

            <button type='submit' className='cursor-pointer'>
              Add
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
