'use client';
import Link from 'next/link'; // Import Link from Next.js
import { PiStudentFill } from 'react-icons/pi';
import { MdLiveHelp } from 'react-icons/md'; // Updated import
import { VscFeedback } from 'react-icons/vsc';
import { BsHouse } from 'react-icons/bs'; // Import the "Home" icon
import { useParams } from 'next/navigation';

const Header = () => {
  const { courseId } = useParams();

  return (
    <header className='bg-primary p-4 text-white h-24 flex items-center'>
      <div className='flex justify-between items-center container mx-auto max'>
        <div className='flex items-center'>
          <Link href='homepage'>
            <div className='ml-4 text-lg font-bold'>Coursecord</div>
          </Link>
        </div>
        <div className='flex items-center'>
          <Link href='syllabus'>
            <div className='mx-2'>
              <PiStudentFill className='text-3xl cursor-pointer hover:fill-secondary' />
            </div>
          </Link>
          <Link href='helprequest'>
            <div className='mx-2'>
              <MdLiveHelp className='text-3xl cursor-pointer hover:fill-secondary' />
            </div>
          </Link>
          <Link href='student-homepage'>
            <div className='mx-2'>
              <VscFeedback className='text-3xl cursor-pointer hover:fill-secondary' />
            </div>
          </Link>
          <Link href='student-homepage'>
            <div className='mx-2'>
              <BsHouse className='text-3xl cursor-pointer hover:fill-secondary' />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
