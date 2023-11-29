import { MdOutlineSupportAgent } from 'react-icons/md';

export default function Help() {
  return (
    <section className='h-screen w-full flex items-center'>
      <div className='mx-auto min-w-max w-1/3 aspect-square bg-white shadow-lg border-solid border-2 border-grey-600 rounded-lg flex flex-col items-center justify-evenly'>
        <div className='flex items-center text-4xl font-bold text-center drop-shadow-lg'>
          <MdOutlineSupportAgent />
          <h2>
            Help Request
          </h2>
        </div>
        <div className='h-1/3 p-4'>
          <label htmlFor='input-description'>
            Anything else you want us to know?
          </label>
          <textarea
            id='input-description'
            className='p-1 border-2 border-solid border-slate resize-none h-full w-full rounded-md'
          />
        </div>
        <button className='my-5 mx-auto w-1/4 p-2 bg-red-400 border-2 border-solid border-grey rounded-lg shadow-md text-gray-900 font-bold hover:bg-red-500'>
          Send
        </button>
      </div>
    </section>
  );
}
