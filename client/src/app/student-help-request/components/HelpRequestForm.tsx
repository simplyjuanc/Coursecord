import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HelpRequestForm: React.FC = () => {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const maxWords = 80;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    if (inputValue.split(/\s+/).length <= maxWords) {
      setMessage(inputValue);
    }
  };

  return (
    <div className="w-full max-w-md">
      <AnimatePresence>
        {!submitted ? (
          <motion.form
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="p-8 bg-white rounded-lg shadow-xl"
          >
            <h1 className="text-3xl font-semibold text-primary mb-6">New Help Request</h1>
            <textarea
              className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-primary"
              placeholder={`What do you need help with? (Max ${maxWords} words)`}
              value={message}
              onChange={handleInputChange}
              required
            />
            <button
              type="submit"
              className="w-full mt-6 p-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary"
            >
              Send Request
            </button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-center p-4 border border-gray-300 shadow-lg rounded-lg bg-white mt-6"
          >
            <h1 className="text-3xl font-semibold text-secondary">Help is on the way!</h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HelpRequestForm;
