"use client";
import Header from "../syllabus/components/Header";
import HelpRequestForm from './components/HelpRequestForm';

const Home = () => {
  return (
    <div>
        <Header />
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <HelpRequestForm />
      </div>
    </div>
    </div>
  );
};

export default Home;

