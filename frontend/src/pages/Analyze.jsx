import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco, dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Spinner from '../components/spinner';
import { FaCopy } from 'react-icons/fa';
import { FaCheck } from "react-icons/fa";
import { FaLightbulb } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Analyze = () => {
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const subTextColor = isDarkMode ? 'text-gray-300' : 'text-black';
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const codeBgColor = isDarkMode ? 'bg-gray-700' : 'bg-gray-200';
  const codeHeadingColor = isDarkMode ? 'bg-black' : 'bg-gray-700';
  const codeColor = isDarkMode ? 'text-white' : 'text-black';

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!prompt.trim()) {
      return;
    }

    setLoading(true); // Set loading to true when request starts

    try {
      const res = await axios.post('http://localhost:3000/generate', {
        prompt: prompt, // Send the prompt in the request body
      });
      const parsedResponse = JSON.parse(res.data.response);
      setResponse(parsedResponse);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('An error occurred while fetching the response');
      setResponse(''); // Clear previous response on error
    } finally {
      setLoading(false); // Set loading to false once request is finished
    }
  };

  // Function to handle tab key press for indentation inside the textarea
  const handleTab = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault(); // Prevent the default tab behavior
      const cursorPosition = e.target.selectionStart;
      const newText = prompt.substring(0, cursorPosition) + '\t' + prompt.substring(cursorPosition);
      setPrompt(newText); // Insert tab character
      setTimeout(() => (e.target.selectionStart = e.target.selectionEnd = cursorPosition + 1), 0);
    }
  };

  // Function to handle Ctrl + Enter for form submission
  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSubmit(e); // Trigger form submission when Ctrl+Enter is pressed
    }
  };

  // Function to copy the refactored code to clipboard
  const copyToClipboard = () => {
    const code = response.refactored_code || '';
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false); // Reset copied state after 4 seconds
      }, 4000);
    });
  };

  return (
    <div className={`h-screen overflow-hidden relative pb-9 ${bgColor}`}>
      <Navbar />
      <div className="flex h-[calc(100%-4rem)]">
        {/* Left Panel - Code Editor */}
        <div
          className="flex flex-col w-1/2 h-full overflow-hidden"
          style={{ padding: '2%', }}
        >
          <div className={`h-12 ${codeHeadingColor} text-white flex items-center px-4 rounded-t-lg`}>
            <p className="font-Poppins text-sm">Code Editor</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                handleTab(e); // Handle tab behavior
                handleKeyDown(e); // Handle Ctrl+Enter for submit
              }}
              placeholder="Enter your code or prompt here..."
              className={`flex-grow w-full p-4 ${codeBgColor} ${codeColor} rounded-b-lg resize-none font-Fira text-sm border-none focus:outline-none ${isDarkMode ? 'placeholder-gray-300' : 'placeholder-gray-700'}`}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: isDarkMode ? 'rgb(160, 160, 160) rgb(45, 55, 72)' : 'rgb(7, 7, 7) rgb(229, 231, 235)',
                fontSize: '1em',
              }}
            />
            <motion.button
              whileTap={{ scale: 0.7 }}
              type="submit"
              className={`font-Poppins mt-2 py-3 ${codeHeadingColor} text-white rounded-md hover:bg-gray-800 hover:duration-300`}
              style={{
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)'
              }}
            >
              Refactor Code (Ctrl + Enter)
            </motion.button>
          </form>
        </div>

        {/* Right Panel - Response Display */}
        <div className="w-1/2 h-full p-9 overflow-auto" style={{ paddingTop: '2%', paddingBottom: '2%' }}>
          {loading ? (
            <div className="flex flex-col justify-center items-center h-full">
              <Spinner />
              <h1 className={`font-Poppins text-xl ${subTextColor}`}>Refactoring...</h1>
            </div>
          ) : response ? (
            <div className="space-y-4">
              <div>
                <h4 className={`font-Poppins mb-2 ${textColor}`}>Language</h4>
                <pre className={`font-PoppinsRegular whitespace-pre-wrap ${codeBgColor} p-4 rounded-md ${textColor}`}>
                  {response.language}
                </pre>
              </div>

              <div>
                <h4 className={`font-Poppins mb-2 ${textColor}`}>Refactored Code</h4>
                <div
                  className="relative"
                  style={{
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                  }}
                >
                  <SyntaxHighlighter
                    language={response.language || 'text'}
                    style={isDarkMode ? dark : docco}
                    wrapLongLines
                    showLineNumbers
                    customStyle={{
                      backgroundColor: isDarkMode ? '#2d3748' : '#e5e7eb',
                      borderRadius: '0.375rem',
                      padding: '1rem',
                      fontSize: '1.05em'
                    }}
                  >
                    {response.refactored_code || 'No refactored code provided'}
                  </SyntaxHighlighter>
                  <button
                    onClick={copyToClipboard}
                    className={`absolute top-2 right-2 ${textColor}`}
                    title="Copy to clipboard"
                  >
                    {copied ? <h1 className='flex flex-row font-PoppinsRegular'>Copied&nbsp;&nbsp;<FaCheck className='mt-1' /></h1> : <h1 className='flex flex-row font-PoppinsRegular'>Copy&nbsp;&nbsp;<FaCopy className='mt-1' /></h1>}
                  </button>
                </div>
              </div>

              <div>
                <h4 className={`font-Poppins mb-2 ${textColor}`}>Reason for Changes</h4>
                <p className={`font-PoppinsRegular ${codeBgColor} p-4 rounded-md ${textColor}`}>
                  {response.reason}
                </p>
              </div>
            </div>
          ) : error ? (
            <p className="text-center mt-2 text-red-500">{error}</p>
          ) : (
            <p className={`text-center mt-9 ${subTextColor} italic font-Poppins`}>Submit a prompt to see the response</p>
          )}

        </div>
      </div>
    </div>
  );
};

export default Analyze;
