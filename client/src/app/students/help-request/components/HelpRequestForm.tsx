import { Dispatch, SetStateAction, useState } from 'react';
import { io } from 'socket.io-client';

type HelpRequestFormProps = {
  setSubmitted: Dispatch<SetStateAction<boolean>>
}

const HelpRequestForm = ({setSubmitted}:HelpRequestFormProps) => {
  const [message, setMessage] = useState('');
  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!message) return;
    
    // TODO course id and student ids


    const socket = io('http://localhost:5001/');
    socket.emit('join','student');
    socket.emit('createRequest', {
      content: message,
      course: '6564f0ade4eabf777c376253',
      students: ['juan', 'arthur', 'bruno', 'alex'],
    });
    console.log('request created');
    
    // Here you would open the WebSocket connection and send the message
    // For demonstration, we'll just simulate a successful submission
    setSubmitted(true);
    // WebSocket sending logic would go here
  };

  return (
    <div className="flex justify-center items-center h-full">
      <form onSubmit={handleSubmit} className="space-y-4 p-6 border border-gray-200 shadow-lg rounded-lg bg-white">
        <textarea
          className="w-full p-2 border rounded"
          placeholder="What do you need help with?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full p-2 bg-secondary text-white rounded hover:bg-primary"
        >
          Send Request
        </button>
      </form>
    </div>
  );
};

export default HelpRequestForm;