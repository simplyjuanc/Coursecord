import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link from Next.js
import { PiStudentFill } from 'react-icons/pi';
import { MdLiveHelp } from 'react-icons/md'; // Updated import
import { VscFeedback } from 'react-icons/vsc';
import { BsHouse } from 'react-icons/bs'; // Import the "Home" icon

const Header: React.FC = () => {
  const [courseName, setCourseName] = useState<string>('');

  useEffect(() => {
    // Fetch the course name from the backend
    fetch('/api/courseName') // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => setCourseName(data.courseName))
      .catch((error) => console.error('Error fetching course name:', error));
  }, []);

  return (
    <div className="bg-primary p-4 text-white">
      <div className="flex justify-between items-center container mx-auto">
        <div className="flex items-center">
          {/* Assuming you have the logo in your public directory */}
          <img src="/logo.png" alt="Logo" className="h-10" />
          <Link href="/">
            <div className="ml-4 text-lg font-bold">{courseName}</div>
          </Link>
        </div>
        <div className="flex items-center">
          <Link href="/student-syllabus">
            <div className="mx-2">
              <PiStudentFill className="text-3xl cursor-pointer hover:fill-secondary" />
            </div>
          </Link>
          <Link href="/student-help-request">
            <div className="mx-2">
              <MdLiveHelp className="text-3xl cursor-pointer hover:fill-secondary" />
            </div>
          </Link>
          <Link href="/student-feedback">
            <div className="mx-2">
              <VscFeedback className="text-3xl cursor-pointer hover:fill-secondary" />
            </div>
          </Link>
          {/* Add a Link for the Home button */}
          <Link href="/student-classes">
            <div className="mx-2">
              <BsHouse className="text-3xl cursor-pointer hover:fill-secondary" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
