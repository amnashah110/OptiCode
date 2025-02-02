import React, { useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import Navbar from '../components/navbar';
import { docco, dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FaCopy } from 'react-icons/fa';
import { FaCheck } from "react-icons/fa";
import { FcOpenedFolder } from "react-icons/fc";
import { FcFile } from "react-icons/fc";
import spinnerGIF from '../assets/spinner.gif'
import { RiDownload2Fill } from "react-icons/ri";
import { MdArrowBack } from "react-icons/md";

const username = 'completelyblank';
const PAT = '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';

const allowedExtensions = [
    "js", "jsx", "ts", "tsx", "html", "css", "scss", "json", "xml", "py",
    "java", "c", "cpp", "cs", "php", "rb", "go", "swift", "md", "yaml", "sh", "txt",
    "jpg", "jpeg", "png", "gif", "svg", "bmp", "webp", "hpp", "h", "csv"
];

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
    const [listLoaded, setListLoaded] = useState(false);
    const [filesLoaded, setFilesLoaded] = useState(true);
    const [codeLoaded, setCodeLoaded] = useState(true);
    const [imageUrl, setImageUrl] = useState(null);
    const [error, setError] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(true);

    const textColor = isDarkMode ? 'text-white' : 'text-black';
    const subTextColor = isDarkMode ? 'text-gray-300' : 'text-black';
    const bgColor = isDarkMode ? '#1f2937' : 'rgb(255, 255, 255)';
    const sideBarColor = isDarkMode ? 'rgb(23, 30, 43)' : 'rgb(65, 65, 66)';
    const mainBarColor = isDarkMode ? 'rgb(14, 17, 22)' : 'rgb(40, 40, 41)';


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
                const response = await fetch(`https://api.github.com/users/${username}/repos`,
                    { headers: { Authorization: `token ${PAT}` } }
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch repositories');
                }
                const data = await response.json();
                const names = data.map((repo) => repo.name);
                setRepoNames(names);
                setListLoaded(true);
            } catch (error) {
                console.error('Error fetching repositories:', error);
            }
        };

        fetchRepositories();
    }, []);

    const fetchRepoFiles = async (repoName, path = '') => {
        setFilesLoaded(false);
        try {
            setSelectedRepo(repoName);
            setCurrentPath(path);
            const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/${path}`,
                { headers: { Authorization: `token ${PAT}` } }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch files');
            }
            const data = await response.json();
            setFiles(data);
            setFilesLoaded(true);
        } catch (error) {
            console.error('Error fetching repository files:', error);
        }
    };

    const fetchFileContent = async (fileUrl) => {
        setCodeLoaded(false);
        try {
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch file content');
            }
            const data = await response.text();
            setFileContent(data);
            setCodeLoaded(true);
        } catch (error) {
            console.error('Error fetching file content:', error);
        }
    };

    const handleFileClick = (file) => {
        if (file.type === 'dir') {
            setFilesLoaded(false);
            fetchRepoFiles(selectedRepo, file.path);
        } else {
            setCodeLoaded(false);
            const extension = file.name.split('.').pop().toLowerCase();
            if (allowedExtensions.includes(extension)) {
                if (["jpg", "jpeg", "png", "gif", "svg", "bmp", "webp"].includes(extension)) {
                    setCodeLoaded(false);
                    setImageUrl(null); // Reset previous image
                    setTimeout(() => {
                        setImageUrl(file.download_url);
                        setCodeLoaded(true);
                    }, 500);
                } else {
                    setImageUrl(null);
                    setCodeLoaded(false);
                    setLanguage(getLanguageFromExtension(file.name));
                    fetchFileContent(file.download_url);
                }
                setError(null);
            } else {
                setError("Cannot render. This file type is not supported.");
                setCodeLoaded(true);
            }
            setSelectedFileName(file.name);
        }
    };

    // Handle going back to the parent directory
    const goBack = () => {
        setFilesLoaded(false);
        if (currentPath) {
            const parentPath = currentPath.split('/').slice(0, -1).join('/');
            fetchRepoFiles(selectedRepo, parentPath);
        }
    };

    // Download file
    const downloadFile = (fileUrl, fileName) => {
        fetch(fileUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.click();
                URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Error downloading file:', error));
    };

    return (
        <div className={`h-screen overflow-hidden relative pb-9`} style={{ backgroundColor: bgColor }}>
            <Navbar />
            <div className='flex flex-row'>
                <div className={`w-1/5`} style={{ padding: '20px', color: 'white', minHeight: '100vh', backgroundColor: mainBarColor }}>
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
                        {listLoaded ? (
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
                        ) : (
                            <div
                                className="font-PoppinsRegular flex flex-col justify-center items-center h-full"
                                style={{ minHeight: '60vh' }}
                            >
                                <div className='flex flex-col justify-center items-center mb-1'>
                                    <img src={spinnerGIF} alt="Loading Spinner" style={{ width: 50, height: 50, zIndex: 10 }} />
                                </div>
                                Loading...
                            </div>
                        )}

                    </div>
                </div>

                <div className={`w-1/5`} style={{ padding: '20px', color: 'white', backgroundColor: sideBarColor }}>
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
                        <button className='flex flex-row' onClick={goBack} style={{ fontFamily: 'Poppins', marginBottom: '10px', cursor: 'pointer' }}>
                            <MdArrowBack size={22}/>&nbsp;Go Back
                        </button>
                    )}
                    <div
                        style={{
                            maxHeight: '75vh',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgb(7, 7, 7) white',
                        }}
                    >
                        {filesLoaded ? (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {files.map((file, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleFileClick(file)}
                                        style={{
                                            cursor: 'pointer',
                                            padding: '10px',
                                            borderRadius: '5px',
                                            fontFamily: 'PoppinsRegular'
                                        }}
                                    >
                                        <div className='flex flex-row'>
                                            <div>
                                                {file.type === 'dir' ? <FcOpenedFolder size={22} /> : <FcFile size={22} />}
                                            </div>
                                            <div
                                                style={{
                                                    flex: 1,
                                                    maxWidth: '90%',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                &nbsp;&nbsp;{file.name}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div
                                className="font-PoppinsRegular flex flex-col justify-center items-center h-full"
                                style={{ minHeight: '60vh' }}
                            >
                                <div className='flex flex-col justify-center items-center mb-1'>
                                    <img src={spinnerGIF} alt="Loading Spinner" style={{ width: 50, height: 50, zIndex: 10 }} />
                                </div>
                                Loading...
                            </div>
                        )}
                    </div>
                </div>
                <div className='w-3/5' style={{ padding: '20px' }}>
                    {selectedFileName ? (
                        <button className={`font-Poppins flex justify-end top-0 ${subTextColor}`} onClick={() => downloadFile(files.find(f => f.name === selectedFileName).download_url, selectedFileName)}>
                            Download {selectedFileName}&nbsp;&nbsp;&nbsp;<RiDownload2Fill size={25} style={{ marginTop: '-2%' }} />
                        </button>
                    ) :
                        (
                            <></>
                        )}
                    <h2 className={`font-Poppins text-center p-4 ${textColor}`} style={{ fontSize: '1.1em' }}>{selectedFileName ? selectedFileName : 'Select a file to view its content'}</h2>
                    {error ? (
                        <div className='flex justify-center items-center font-Poppins' style={{ color: 'red' }}>
                            {error}
                        </div>) : (
                        imageUrl && codeLoaded ? (
                            <div className="flex justify-center" style={{ maxHeight: '65vh', minHeight: '65vh' }}>
                                <img
                                    src={imageUrl}
                                    alt={selectedFileName}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        borderRadius: '8px'
                                    }}
                                />
                            </div>
                        ) : (
                            codeLoaded ? (
                                <div className='rounded-md' style={{
                                    wordBreak: 'break-word',
                                    whiteSpace: 'pre-wrap',
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: 'rgb(7, 7, 7) white',
                                    maxHeight: '70vh',
                                }}>
                                    <div className='flex justify-end sticky top-2 z-10'>
                                        <button
                                            onClick={copyToClipboard}
                                            className="text-black"
                                            title="Copy to clipboard"
                                        >
                                            {copied ? (
                                                <h1 className={`font-Poppins absolute top-2 right-2 ${subTextColor} p-1 rounded inline-flex items-center`}>
                                                    Copied&nbsp;&nbsp;<FaCheck className="mt-0" />
                                                </h1>
                                            ) : (
                                                <h1 className={`font-Poppins absolute top-2 right-2 ${subTextColor} p-1 rounded inline-flex items-center`}>
                                                    Copy&nbsp;&nbsp;<FaCopy className="mt-0" />
                                                </h1>
                                            )}
                                        </button>
                                    </div>
                                    <SyntaxHighlighter
                                        language={language}
                                        style={isDarkMode ? dark : docco}
                                        wrapLongLines={true}
                                        showLineNumbers
                                        customStyle={{
                                            backgroundColor: isDarkMode ? '#2d3748' : '#e5e7eb',
                                            borderRadius: '10px',
                                            paddingTop: '3%',
                                            paddingBottom: '3%'
                                        }}
                                    >
                                        {fileContent || 'Select a file to view its content'}
                                    </SyntaxHighlighter>
                                </div>
                            ) : (
                                <div
                                    className="font-PoppinsRegular flex flex-col justify-center items-center h-full"
                                    style={{ maxHeight: '60vh' }}
                                >
                                    <div className='flex flex-col justify-center items-center mb-1'>
                                        <img src={spinnerGIF} alt="Loading Spinner" style={{ width: 50, height: 50, zIndex: 10 }} />
                                    </div>
                                    Loading...
                                </div>
                            )
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Repositories;
