import React from 'react';


type AddUserProps = {
  courseId: string,
  setShowNewUser:React.Dispatch<React.SetStateAction<boolean>>
}


export default function AddNewUser({setShowNewUser, courseId}:AddUserProps) {
  const [formState, setFormState] = React.useState({ name: '', email: '', role: '' });
  
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
    <div className='w-full h-full bg-slate-100 bg-opacity-50 absolute top-0 left-0 flex items-center justify-center'>
      <div className='w-1/3 h-1/3 bg-white rounded-lg shadow-lg p-8 fixed'>
        <div>
        <div className='cursor-pointer absolute right-6 top-4 text-xl' onClick={closeModal}>X</div>
          <h1 className='mx-auto text-center mt-2 mb-6 font-semibold text-2xl'>Add New User</h1>
          
          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          
            <div className='flex flex-row flex-nowrap justify-around px-4'>
              <label htmlFor='name'>Name</label>
              <input name='name' onChange={handleInputChange} type='text' placeholder='Kynncer Doe' className='ml-auto'/>
            </div>
            
            <div className='flex flex-row flex-nowrap justify-around px-4'>
              <label htmlFor='email'>Email</label>
              <input name='email' onChange={handleInputChange} type='text' placeholder='required.madness@gmail.com' className='ml-auto'/>
            </div>

            <div className='flex flex-row flex-nowrap justify-around px-4'>
              <label htmlFor='role'>Role</label>
              <select name='role' onChange={handleInputChange} placeholder='Student' className='ml-auto'>
                <option value="">Select role</option>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
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
