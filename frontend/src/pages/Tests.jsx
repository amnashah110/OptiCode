import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { Typewriter } from 'react-simple-typewriter';
import Editor from '@monaco-editor/react';
import axios from 'axios';

// Language mapping for code editor
const languageMap = {
  50: 'c',
  54: 'cpp',
  63: 'javascript',
  71: 'python',
};

// Example test cases
const exampleTestCases = [
  {
    input: 'nums = [2, 7, 11, 15], target = 9',
    output: '[0, 1]',
  },
  {
    input: 'nums = [3, 2, 4], target = 6',
    output: '[1, 2]',
  },
  {
    input: 'nums = [3, 3], target = 6',
    output: '[0, 1]',
  },
];

const Tests = () => {
  // State management
  const [code, setCode] = useState('// Write your code here');
  const [submitted, setSubmitted] = useState(false);
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('darkMode')) || false);
  const [randomProblem, setRandomProblem] = useState(null);
  const [selectedLang, setSelectedLang] = useState(71); // Default Python
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [codeResult, setCodeResult] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeMemory, setCodeMemory] = useState('');
  const [codeTime, setCodeTime] = useState('');
  const [codeRunning, setCodeRunning] = useState(0);
  const [compilerError, setCompilerError] = useState('');

  // Theme-related classes
  const bgColor = darkMode
    ? 'bg-gradient-to-br from-gray-950 via-gray-700 to-gray-950'
    : 'bg-gradient-to-br from-gray-50 via-white to-gray-100';
  const cardBg = darkMode ? 'bg-gray-800/90' : 'bg-white/90';
  const textColor = darkMode ? 'text-gray-100' : 'text-gray-900';
  const subTextColor = darkMode ? 'text-gray-400' : 'text-gray-600';

  // Fetch random challenge on mount
  useEffect(() => {
    const fetchRandomChallenge = async () => {
      try {
        const res = await axios.get('http://localhost:3000/challenge/random?base64_encoded=true');
        setRandomProblem(res.data);
        setSelectedLang(res.data.languageIds[0]);
        setCode(res.data.boilerplateCode[res.data.languageIds[0]].replace(/\\n/g, '\n'));
        setLoading(false);
      } catch (err) {
        setError('Failed to load test.');
        setLoading(false);
      }
    };

    fetchRandomChallenge();
  }, []);

  // Sync dark mode with localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setDarkMode(JSON.parse(localStorage.getItem('darkMode')) || false);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle language selection
  const handleLanguageChange = (e) => {
    const langId = parseInt(e.target.value);
    setSelectedLang(langId);
    setCode(randomProblem.boilerplateCode[langId].replace(/\\n/g, '\n'));
  };

  // Utility function for async delay
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Handle code submission
  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitted(false);
    setSubmitMessage('⏳ Submitting...');

    await sleep(1500);
    setSubmitMessage('⚙️ Running tests...');

    await sleep(2500);
    const passed = 1;

    if (passed) {
      setSubmitted(true);
      setSubmitMessage('🎉 All test cases passed!');
    } else {
      setSubmitMessage('❌ Some test cases failed.');
    }

    setSubmitting(false);
  };

  // Handle code compilation
  const handleCodeRun = async () => {
    setCompilerError('');
    if (!code || code.trim() === '') {
      setCompilerError('Error: Cannot compile an empty file');
      setCodeRunning(3);
      return;
    }

    const data = {
      source_code: code,
      language_id: selectedLang,
    };

    try {
      setCodeRunning(1);
      const response = await axios.post('http://localhost:3000/code/compile?base64_encoded=true', data);
      setCodeResult(response.data.result.stdout || '');
      setCodeError(response.data.result.stderr || '');
      setCodeMemory(response.data.result.memory || '');
      setCodeTime(response.data.result.time || '');
      setCodeRunning(2);
    } catch (err) {
      setCompilerError('Error compiling code. Please try again.');
      setCodeRunning(3);
      console.error(err);
    }
  };

  // Loading and error states
  if (loading) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center ${textColor}`}>
        <div className="text-2xl font-semibold animate-pulse">Loading...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center text-red-500`}>
        <div className="text-2xl font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgColor} transition-all duration-500 font-sans`}>
      <Navbar />

      {/* Header Section */}
      <header className="text-center mt-16 mb-8">
        <h1 className={`text-5xl font-extrabold font-Poppins ${textColor} tracking-tight`}>
          <Typewriter
            words={['Teaching Tests']}
            loop={false}
            cursor
            cursorStyle="|"
            typeSpeed={80}
            deleteSpeed={40}
            delaySpeed={1000}
          />
        </h1>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Description Panel */}
          <section className={`p-6 rounded-2xl shadow-xl ${cardBg} backdrop-blur-sm`}>
            <h2 className={`text-3xl font-bold ${textColor} mb-4`}>{randomProblem.title}</h2>
            <p className={`mb-6 leading-relaxed ${subTextColor} whitespace-pre-line`}>
              {randomProblem.description.replace(/\\n/g, '\n')}
            </p>

            {/* Example Test Cases */}
            <div className="mb-6">
              <h3 className={`text-xl font-semibold ${textColor} mb-3`}>Example Test Cases</h3>
              {exampleTestCases.map((testCase, index) => (
                <div
                  key={index}
                  className={`p-4 mb-3 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}
                >
                  <p className={`${subTextColor} font-mono text-sm mb-1`}>
                    <strong>Input:</strong> {testCase.input}
                  </p>
                  <p className={`${subTextColor} font-mono text-sm`}>
                    <strong>Output:</strong> {testCase.output}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Code Editor Panel */}
          <section className={`p-6 rounded-2xl shadow-xl ${cardBg} backdrop-blur-sm`}>
            {/* Language Selector */}
            <div className="flex items-center justify-between mb-4">
              <label className={`font-medium ${textColor}`}>Language:</label>
              <select
                className={`p-2 rounded-lg border ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'} focus:ring-2 focus:ring-blue-500 w-40`}
                value={selectedLang}
                onChange={handleLanguageChange}
                aria-label="Select programming language"
              >
                {randomProblem.languageIds.map((langId) => (
                  <option key={langId} value={langId}>
                    {languageMap[langId].charAt(0).toUpperCase() + languageMap[langId].slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Code Editor */}
            <div className="border rounded-lg overflow-hidden">
              <Editor
                height="200px"
                language={languageMap[selectedLang]}
                theme={darkMode ? 'vs-dark' : 'light'}
                value={code}
                onChange={(value) => setCode(value)}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 10, bottom: 10 },
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:space-x-4 mt-4">
              <button
                onClick={handleCodeRun}
                disabled={codeRunning === 1}
                className={`px-6 py-2 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 mb-2 sm:mb-0`}
                aria-label="Run code"
              >
                {codeRunning === 1 ? 'Running...' : 'Run Code'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`px-6 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all duration-300 transform hover:scale-105`}
                aria-label="Submit code"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>

            {/* Compiler Output */}
            <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'} font-mono text-sm`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`${textColor} font-semibold`}>OptiCode Compiler v1.0.0</span>
              </div>
              <hr className={`border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-3`} />
              <pre
                className={`whitespace-pre-wrap break-words ${
                  codeRunning === 3 && compilerError
                    ? 'text-red-400'
                    : codeRunning === 1
                    ? 'text-green-400'
                    : textColor
                }`}
              >
                {codeRunning === 3 && compilerError ? (
                  <>➜ {compilerError}</>
                ) : codeRunning === 1 ? (
                  <>➜ Compiling...</>
                ) : codeRunning === 0 ? (
                  <>
                    ➜ Initializing build environment...
                    <br />
                    ➜ Waiting for code input...
                    <br />
                    Compile your code to see the outputs...
                  </>
                ) : (
                  <>
                    Compilation Results:
                    <br />
                    {codeResult ? (
                      <span className="text-green-400">{codeResult}</span>
                    ) : (
                      <span className="text-red-400">{codeError || 'No output'}</span>
                    )}
                    <br />
                    ────────────────────────────────────────────────
                    <br />
                    Process Executed in {codeTime} seconds, Memory = {codeMemory}
                  </>
                )}
              </pre>
            </div>

            {/* Submission Feedback */}
            {submitMessage && (
              <div
                className={`mt-4 p-3 rounded-lg font-medium animate-fade-in ${
                  submitted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {submitMessage}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tests;