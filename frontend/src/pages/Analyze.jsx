import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Spinner from '../components/spinner';
import { FaCopy } from 'react-icons/fa';
import { FaCheck } from "react-icons/fa";

const Analyze = () => {
  const [response, setResponse] = useState(''); // State to hold server response
  const [error, setError] = useState(''); // State to hold error messages
  const [prompt, setPrompt] = useState(''); // State to hold user input
  const [loading, setLoading] = useState(false); // State to track loading status
  const [copied, setCopied] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

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
    <div className="h-screen overflow-hidden relative pb-9 bg-gray-100">
      <Navbar />
      <div className="flex h-[calc(100%-4rem)] px-8 py-4 gap-6">
        {/* Left Panel - Code Editor */}
        <div
          className="flex flex-col w-1/2 h-full rounded-lg shadow-lg bg-white border border-gray-300 overflow-hidden"
          style={{ padding: '2%' }}
        >
          <div className="h-12 bg-gray-800 text-white flex items-center px-4 rounded-t-lg">
            <p className="font-Poppins text-sm">Code Editor</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleTab} // Attach the tab handler to the textarea
              placeholder="Enter your code or prompt here..."
              className="flex-grow w-full p-4 bg-black text-green-400 rounded-b-lg resize-none font-mono text-sm border-none focus:outline-none"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'gray lightgray',
                fontSize: '1em'
              }}
            />
            <button
              type="submit"
              className="font-Poppins mt-2 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Right Panel - Response Display */}
        <div className="w-1/2 h-full rounded-lg shadow-lg bg-white border border-gray-300 p-9 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner /> {/* Show the spinner */}
            </div>
          ) : response ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-Poppins">Language:</h4>
                <pre className="font-PoppinsRegular whitespace-pre-wrap bg-gray-100 p-4 rounded-md">{response.language}</pre>
              </div>

              <div>
                <h4 className="font-Poppins">Refactored Code:</h4>
                <div className="relative">
                  <SyntaxHighlighter language={response.language || 'text'} style={docco}>
                    {response.refactored_code || 'No refactored code provided'}
                  </SyntaxHighlighter>
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 text-black"
                    title="Copy to clipboard"
                  >
                    {copied ? <h1 className='flex flex-row font-PoppinsRegular'>Copied&nbsp;&nbsp;<FaCheck className='mt-1'/></h1> : <h1 className='flex flex-row font-PoppinsRegular'>Copy&nbsp;&nbsp;<FaCopy className='mt-1'/></h1>} 
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-Poppins">Reason for Changes:</h4>
                <p className="font-PoppinsRegular bg-gray-100 p-4 rounded-md">{response.reason}</p>
              </div>
            </div>
          ) : error ? (
            <p className="text-center mt-2 text-red-500">{error}</p>
          ) : (
            <p className="text-center text-gray-500 italic">Submit a prompt to see the response</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analyze;
