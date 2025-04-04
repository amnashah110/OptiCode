import React, { useState, useEffect, useRef } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import Navbar from '../components/navbar';
import { docco, dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { CiMicrophoneOn, CiMicrophoneOff } from "react-icons/ci";
import { FaVideo, FaVideoSlash } from "react-icons/fa6";
import unknown from '../assets/unknown.jpg';
import { ImUpload } from "react-icons/im";
import { VscFolderOpened } from "react-icons/vsc";
import { FaRegFileLines } from "react-icons/fa6";
import { VscFolder } from "react-icons/vsc";
import spinnerGIF from '../assets/spinner.gif'
import { CodeMirror } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { css } from "@codemirror/lang-css";

const languageMap = {
    js: javascript(),
    py: python(),
    java: java(),
    css: css(),
};

const allowedExtensions = [
    "js", "jsx", "ts", "tsx", "html", "css", "scss", "json", "xml", "py",
    "java", "c", "cpp", "cs", "php", "rb", "go", "swift", "md", "yaml", "sh", "txt",
    "jpg", "jpeg", "png", "gif", "svg", "bmp", "webp", "hpp", "h", "csv", "gitignore", "env"
];

const getLanguageFromExtension = (fileName) => {
    if (!fileName) return null;
    const extension = fileName.split('.').pop().toLowerCase();

    const extensionMap = {
        js: javascript(),
        jsx: javascript(),
        ts: javascript(),
        tsx: javascript(),
        html: null,
        css: css(),
        py: python(),
        java: java(),
        gitignore: javascript()
    };

    return extensionMap[extension] || null;
};

const Editor = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isMicOn, setIsMicOn] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [stream, setStream] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const videoRef = useRef(null);
    const messageInputRef = useRef(null);
    const chatRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [repoLink, setRepoLink] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [openFolders, setOpenFolders] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedFileContent, setSelectedFileContent] = useState('');
    const [selectedFileName, setSelectedFileName] = useState('');
    const [displayedFileType, setDisplayedFileType] = useState(null);
    const [flatFiles, setFlatFiles] = useState([]);


    const textColor = isDarkMode ? 'text-white' : 'text-black';
    const subTextColor = isDarkMode ? 'text-gray-300' : 'text-black';
    const bgColor = isDarkMode ? 'bg-gray-950' : 'bg-white';
    const mainBarColor = isDarkMode ? 'rgb(14, 17, 22)' : 'rgb(40, 40, 41)';
    const codeBgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-200';
    const codeHeadingColor = isDarkMode ? 'bg-black' : 'bg-gray-700';
    const codeColor = isDarkMode ? 'text-white' : 'text-black';

    const buildFileTree = (files) => {
        const tree = {};
        files.forEach(file => {
            const parts = file.webkitRelativePath.split('/');
            let current = tree;
            parts.forEach((part, index) => {
                if (!current[part]) {
                    current[part] = index === parts.length - 1 ? null : {};
                }
                current = current[part];
            });
        });
        return tree;
    };

    const handleFileUpload = (event) => {
        setLoading(true);

        const files = Array.from(event.target.files);
        if (files.length > 0) {
            const tree = buildFileTree(files);
            setUploadedFiles(tree);
            setFlatFiles(files); // Store the flat list
        }

        setTimeout(() => {
            setLoading(false);
            setShowModal(false);
        }, 1000);
    };

    const handleFileClick = (file) => {
        if (!flatFiles || flatFiles.length === 0) {
            console.error("No files available.");
            return;
        }

        const fileObj = flatFiles.find(f => f.webkitRelativePath.split('/').pop() === file);
        if (!fileObj) {
            console.error("File not found:", file);
            return;
        }

        const fileExtension = file.split('.').pop().toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            setSelectedFileContent("Error: File type not supported.");
            setDisplayedFileType("error");
            return;
        }

        setSelectedFileName(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            setSelectedFileContent(e.target.result);
        };

        setDisplayedFileType(fileExtension);

        if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(fileExtension)) {
            reader.readAsDataURL(fileObj);
        } else {
            reader.readAsText(fileObj);
        }
    };

    const DirectoryTree = ({ tree, openFolders, setOpenFolders, level = 0, files }) => {
        const toggleFolder = (folder) => {
            setOpenFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
        };

        const getFilesFromTree = (tree) => {
            let fileList = [];
            for (const key in tree) {
                if (tree.hasOwnProperty(key)) {
                    if (tree[key] === null) {
                        fileList.push(key);
                    } else {
                        fileList = fileList.concat(getFilesFromTree(tree[key]));
                    }
                }
            }
            return fileList;
        };

        const allFiles = getFilesFromTree(tree);
        return (
            <ul>
                {Object.entries(tree).map(([key, value]) => (
                    <li key={key} className="cursor-pointer" style={{ paddingTop: '10px', paddingLeft: '15px' }}>
                        {value ? (
                            <>
                                <div
                                    className="flex flex-row items-center"
                                    onClick={() => toggleFolder(key)}
                                    style={{ maxWidth: '90%' }}
                                >
                                    {openFolders[key] ? <VscFolderOpened size={20} /> : <VscFolder size={20} />}
                                    &nbsp;&nbsp;
                                    <span
                                        style={{
                                            display: 'block',
                                            flexGrow: 1,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {key}
                                    </span>
                                </div>
                                {openFolders[key] && <DirectoryTree tree={value} openFolders={openFolders} setOpenFolders={setOpenFolders} level={level + 1} />}
                            </>
                        ) : (
                            <div
                                className="flex flex-row items-center text-gray-300"
                                style={{ maxWidth: '90%' }}
                                onClick={() => handleFileClick(key, files)}
                            >
                                <FaRegFileLines size={20} />
                                &nbsp;&nbsp;
                                <span
                                    style={{
                                        display: 'block',
                                        flexGrow: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {key}
                                </span>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chatMessages]);

    useEffect(() => {
        let mediaStream = null;

        const startCamera = async () => {
            try {
                if (!stream) {
                    mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                    setStream(mediaStream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                    }
                }
            } catch (err) {
                console.error("Error accessing camera: ", err);
            }
        };

        if (isVideoOn) {
            startCamera();
        } else if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }

    }, [isVideoOn]);


    const handleSendMessage = () => {
        const message = messageInputRef.current.value;
        if (message) {
            setChatMessages([...chatMessages, message]);
            messageInputRef.current.value = ''; // Clear input field
        }
    };

    return (
        <div className={`h-screen overflow-hidden relative pb-9 ${bgColor}`}>
            <Navbar />
            <div className='flex flex-row'>
                <div
                    className={`overflow-hidden flex flex-col w-1/5 pb-12 font-PoppinsRegular ${Object.keys(uploadedFiles).length > 0 ? 'justify-start pt-6' : 'justify-center items-center'
                        }`}
                    style={{ minHeight: '100vh', backgroundColor: mainBarColor }}
                >
                    {loading ? (
                        <div className="flex flex-col justify-center items-center h-full" style={{ minHeight: '60vh' }}>
                            <div className="flex flex-col justify-center items-center mb-1">
                                <img src={spinnerGIF} alt="Loading Spinner" style={{ width: 50, height: 50, zIndex: 10 }} />
                            </div>
                            Loading...
                        </div>
                    ) : Object.keys(uploadedFiles).length > 0 ? (
                        <>
                            <h3 className={`${textColor} font-Poppins text-center text-lg mb-2`}>View Project Files</h3>
                            <div
                                className={`${subTextColor} w-full`}
                                style={{
                                    maxHeight: '75vh',
                                    overflowY: 'auto',
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: isDarkMode
                                        ? `rgb(160, 160, 160) ${mainBarColor}`
                                        : `rgb(7, 7, 7) ${mainBarColor}`,
                                }}
                            >
                                <DirectoryTree tree={uploadedFiles} openFolders={openFolders} setOpenFolders={setOpenFolders} files={flatFiles} />
                            </div>
                        </>
                    ) : (
                        <>
                            <ImUpload
                                className={`cursor-pointer ${isHovered ? subTextColor : textColor}`}
                                size={60}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                onClick={() => setShowModal(true)}
                            />
                            <h2
                                className={`font-Poppins text-center cursor-pointer p-4 ${isHovered ? subTextColor : textColor}`}
                                style={{ fontSize: '1.1em' }}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                onClick={() => setShowModal(true)}
                            >
                                Upload a Repository
                            </h2>
                        </>
                    )}
                </div>

                <div className={`w-3/5 p-2 overflow-auto ${subTextColor}`}>
                    {selectedFileName && <h2 className="text-lg font-bold mb-2">{selectedFileName}</h2>}
                    {!selectedFileName && <h2 className="text-lg font-bold mb-2">Select a file</h2>}
                    {displayedFileType === "error" ? (
                        <p className="text-red-500 font-bold">{selectedFileContent}</p>
                    ) : displayedFileType === 'png' || displayedFileType === 'jpg' || displayedFileType === 'jpeg' || displayedFileType === 'gif' || displayedFileType === 'bmp' || displayedFileType === 'webp' ? (
                        <div className="flex justify-center" style={{ maxHeight: '78vh', minHeight: '78vh' }}>
                            <img src={selectedFileContent} alt={selectedFileName} className="max-w-full" style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                height: 'auto',
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }} />
                        </div>
                    ) : (
                        <CodeMirror
                            minHeight="78vh"
                            maxHeight="78vh"
                            value={selectedFileContent}
                            extensions={selectedFileName ? (getLanguageFromExtension(selectedFileName) != null ? [getLanguageFromExtension(selectedFileName)] : [javascript()]) : [javascript()]}
                            theme={isDarkMode ? githubDark : githubLight}
                            onChange={(newCode) => setCode(newCode)}
                            style={{
                                fontSize: '1.2em',
                                overflow: 'hidden',
                                scrollbarWidth: 'thin',
                                maxWidth: '100%',
                                maxHeight: '100%',
                                height: 'auto',
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }}

                        />
                    )}
                </div>

                <div className='flex flex-col w-1/4 relative' style={{ minHeight: '100vh', backgroundColor: mainBarColor }}>
                    <div
                        className="absolute top-8 left-1/2 transform -translate-x-1/2 w-64 h-40 bg-black rounded-lg shadow-lg flex items-center justify-center text-white group"
                        style={{ cursor: 'pointer' }}
                    >
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity rounded-lg z-10"></div>

                        {/* Video or Image */}
                        {isVideoOn ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                className="absolute top-0 left-0 w-full h-full object-cover p-1 rounded-lg transition-transform duration-500 ease-in-out group-hover:transform group-hover:scale-105"
                                style={{ transform: 'scaleX(-1)' }}
                            />
                        ) : (
                            <div
                                className="w-16 h-16 rounded-full bg-center bg-cover"
                                style={{
                                    backgroundImage: `url(${unknown})`,
                                    cursor: 'pointer',
                                    opacity: '70%',
                                }}
                            />
                        )}

                        {/* Buttons on top of video/image */}
                        <div className="absolute bottom-4 flex space-x-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <button
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                                style={{ backgroundColor: 'rgba(78, 71, 71, 0.5)' }}
                                onClick={() => setIsMicOn(!isMicOn)}
                            >
                                {isMicOn ? <CiMicrophoneOn size={25} /> : <CiMicrophoneOff size={25} />}
                            </button>

                            <button
                                className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white"
                                style={{ backgroundColor: 'rgba(78, 71, 71, 0.5)' }}
                                onClick={() => setIsVideoOn(!isVideoOn)}
                            >
                                {isVideoOn ? <FaVideo size={23} /> : <FaVideoSlash size={25} />}
                            </button>
                        </div>
                    </div>

                    {/* Chat Box */}
                    <div
                        className={`absolute top-52 left-1/2 transform -translate-x-1/2 w-64 shadow-lg p-4 space-y-4 w-full h-full`}
                    >
                        <div className="text-white font-Poppins text-center mt-3 text-lg">Chat</div>
                        <div
                            className="h-52 overflow-auto space-y-2"
                            ref={chatRef}
                            style={{
                                scrollbarColor: isDarkMode ? `rgb(160, 160, 160) ${mainBarColor}` : `rgb(7, 7, 7) ${mainBarColor}`,
                                scrollbarWidth: 'thin'
                            }}
                        >
                            {chatMessages.map((msg, idx) => (
                                <div key={idx} className="text-white bg-gray-600 p-2 rounded-lg font-PoppinsRegular" style={{ fontSize: '0.9em' }}>
                                    {msg}
                                </div>
                            ))}
                        </div>
                        <div className="flex space-x-2">
                            <input
                                ref={messageInputRef}
                                type="text"
                                className="w-full p-2 pr-3 pl-3 rounded-lg bg-gray-700 text-white font-PoppinsRegular focus:outline-none"
                                placeholder="Type a message..."
                                style={{ fontSize: '0.9em' }}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            />
                            <button
                                onClick={handleSendMessage}
                                className="bg-blue-600 p-2 rounded-lg text-white"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal */}
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 h-full">
                    <div className={`${textColor} p-6 rounded-lg shadow-lg relative`}
                        style={{ backgroundColor: mainBarColor, width: '40%', height: '50%' }}>

                        <button
                            className={`absolute top-2 right-4 text-3xl font-PoppinsRegular ${subTextColor} hover:opacity-80`}
                            onClick={() => setShowModal(false)}
                            disabled={loading} // Disable closing while loading
                        >
                            &times;
                        </button>

                        <h2 className="text-xl font-Poppins text-center mt-4">Upload Repository</h2>

                        <div className='flex flex-col justify-center items-center h-full p-4'>
                            {loading ? (
                                <div className="flex flex-col items-center">
                                    <img src={spinnerGIF} alt="Loading..." className="w-16 h-16" />
                                    <p className="mt-2">Processing...</p>
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        className={`w-full ${codeBgColor} ${codeColor} p-2 rounded mb-2 font-PoppinsRegular pl-4 pr-4 text-black focus:outline-none`}
                                        placeholder="Paste GitHub Repository Link"
                                        value={repoLink}
                                        onChange={(e) => setRepoLink(e.target.value)}
                                    />
                                    <h1 className={`${subTextColor} font-Poppins text-l`}>OR</h1>
                                    <div className="flex flex-col items-center justify-center w-full">
                                        <input
                                            type="file"
                                            webkitdirectory="true"
                                            directory="true"
                                            className="hidden"
                                            id="folderUpload"
                                            onChange={(event) => {
                                                setLoading(true);
                                                handleFileUpload(event);
                                            }}

                                        />
                                        <label htmlFor="folderUpload" className={`${subTextColor} px-4 py-2 rounded cursor-pointer`} >
                                            <ImUpload size={50} />
                                        </label>
                                        <h1 className={`${subTextColor} font-Poppins mb-4`}>Upload from PC</h1>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Editor;
