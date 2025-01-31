import React, { useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import Navbar from '../components/navbar';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FaCopy } from 'react-icons/fa';
import { FaCheck } from "react-icons/fa";

const getLanguageFromExtension = (fileName) => {
    if (!fileName) return 'text';
    const extension = fileName.split('.').pop().toLowerCase();

    const extensionMap = {
        js: 'javascript',
        jsx: 'javascript',
        ts: 'typescript',
        tsx: 'typescript',
        html: 'xml',
        css: 'css',
        scss: 'scss',
        json: 'json',
        xml: 'xml',
        py: 'python',
        java: 'java',
        c: 'c',
        cpp: 'cpp',
        cs: 'csharp',
        php: 'php',
        rb: 'ruby',
        go: 'go',
        swift: 'swift',
        md: 'markdown',
        yaml: 'yaml',
        sh: 'bash',
        txt: 'text'
    };

    return extensionMap[extension] || 'text';
};

const Repositories = () => {
    const [repoNames, setRepoNames] = useState([]);
    const [selectedRepo, setSelectedRepo] = useState(null);
    const [currentPath, setCurrentPath] = useState('');
    const [files, setFiles] = useState([]);
    const [fileContent, setFileContent] = useState('');
    const [language, setLanguage] = useState('');
    const [selectedFileName, setSelectedFileName] = useState('');
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        const code = fileContent || '';
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false); 
            }, 4000);
        });
    };

    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                const response = await fetch('https://api.github.com/users/completelyblank/repos');
                if (!response.ok) {
                    throw new Error('Failed to fetch repositories');
                }
                const data = await response.json();
                const names = data.map((repo) => repo.name);
                setRepoNames(names);
            } catch (error) {
                console.error('Error fetching repositories:', error);
            }
        };

        fetchRepositories();
    }, []);

    const fetchRepoFiles = async (repoName, path = '') => {
        try {
            setSelectedRepo(repoName);
            setCurrentPath(path);
            const response = await fetch(`https://api.github.com/repos/completelyblank/${repoName}/contents/${path}`);
            if (!response.ok) {
                throw new Error('Failed to fetch files');
            }
            const data = await response.json();
            setFiles(data);
            setFileContent('');
        } catch (error) {
            console.error('Error fetching repository files:', error);
        }
    };

    const fetchFileContent = async (fileUrl) => {
        try {
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch file content');
            }
            const data = await response.text();
            setFileContent(data);
        } catch (error) {
            console.error('Error fetching file content:', error);
        }
    };

    // Handle navigation into directories
    const handleFileClick = (file) => {
        if (file.type === 'dir') {
            fetchRepoFiles(selectedRepo, file.path); 
        } else {
            setLanguage(getLanguageFromExtension(file.name));
            fetchFileContent(file.download_url);
            setSelectedFileName(file.name);
        }
    };

    // Handle going back to the parent directory
    const goBack = () => {
        if (currentPath) {
            const parentPath = currentPath.split('/').slice(0, -1).join('/');
            fetchRepoFiles(selectedRepo, parentPath);
        }
    };

    return (
        <div className="h-screen overflow-hidden relative pb-9" style={{ backgroundColor: 'white' }}>
            <Navbar />
            <div className='flex flex-row'>
                <div className='w-1/5' style={{ padding: '20px', color: 'white', backgroundColor: 'rgb(7, 7, 7)' }}>
                    <h2 className='font-Poppins text-center p-4' style={{ fontSize: '1.1em' }}>Repositories</h2>
                    <div
                        style={{
                            maxHeight: '75vh',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgb(7, 7, 7) white',
                            fontFamily: 'PoppinsRegular'
                        }}
                    >
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {repoNames.map((name, index) => (
                                <li
                                    key={index}
                                    onClick={() => fetchRepoFiles(name)}
                                    style={{
                                        cursor: 'pointer',
                                        padding: '10px',
                                        background: selectedRepo === name ? 'rgb(77, 77, 77)' : 'transparent',
                                        borderRadius: '5px',
                                    }}
                                >
                                    {name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className='w-1/5' style={{ padding: '20px', backgroundColor: 'rgb(20, 20, 20)', color: 'white' }}>
                    <h2 className='font-Poppins text-center p-4' 
                    style={{ 
                        fontSize: '1.1em', 
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap' 
                    }}>
                        {selectedRepo
                            ? `Files in ${selectedRepo}${currentPath ? `/${currentPath}` : ''}`
                            : 'Select a repository'}
                    </h2>
                    {currentPath && (
                        <button onClick={goBack} style={{ fontFamily: 'Poppins', marginBottom: '10px', cursor: 'pointer' }}>
                            Go Back
                        </button>
                    )}
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {files.map((file, index) => (
                            <li
                                key={index}
                                onClick={() => handleFileClick(file)}
                                style={{
                                    cursor: 'pointer',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    marginBottom: '5px',
                                }}
                            >
                                {file.type === 'dir' ? '📂 ' : '📄 '}
                                {file.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='w-3/5' style={{ padding: '20px' }}>
                    <h2 className='font-Poppins text-center p-4' style={{ fontSize: '1.1em' }}>{selectedFileName ? selectedFileName : 'Select a file to view its content'}</h2>
                    <div style={{
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgb(7, 7, 7) white',
                        maxHeight: '70vh',
                    }}>
                        <div className='flex justify-end sticky top-0 bg-white p-2 z-10'>
                            <button
                                onClick={copyToClipboard}
                                className="text-black"
                                title="Copy to clipboard"
                            >
                                {copied ? (
                                    <h1 className='flex flex-row font-PoppinsRegular'>
                                        Copied&nbsp;&nbsp;<FaCheck className='mt-1' />
                                    </h1>
                                ) : (
                                    <h1 className='flex flex-row font-PoppinsRegular'>
                                        Copy&nbsp;&nbsp;<FaCopy className='mt-1' />
                                    </h1>
                                )}
                            </button>
                        </div>
                        <SyntaxHighlighter
                            language={language}
                            style={docco}
                            wrapLongLines={true}
                        >
                            {fileContent || 'Select a file to view its content'}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Repositories;
