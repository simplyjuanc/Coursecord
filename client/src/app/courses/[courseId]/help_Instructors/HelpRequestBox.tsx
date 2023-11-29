
interface HelpRequestBoxProps {
  content: string;
  course: string;
  students: string[];
}

const HelpRequestBox: React.FC<HelpRequestBoxProps> = ({ content, course, students }) => {
  return (
    <div className="border-2 border-gray-300 bg-white rounded-lg shadow p-4 my-2 flex flex-col">
      <div>
        <p className="text-gray-600">{content}</p>
        <p>Course ID: {course}</p>
        <p>Requestors: {students.join(', ')}</p>
      </div>
    </div>
  );
};

export default HelpRequestBox;
