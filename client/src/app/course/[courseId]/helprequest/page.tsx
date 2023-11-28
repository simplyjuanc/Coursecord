'use client';
import Header from '../components/Header';
import HelpRequestForm from './components/HelpRequestForm';

const Home = () => {
  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <div className='w-full max-w-md'>
        <HelpRequestForm />
      </div>
    </div>
  );
};

export default Home;
