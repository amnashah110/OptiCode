import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/navbar';
import { CiMicrophoneOn, CiMicrophoneOff } from "react-icons/ci";
import { FaVideo, FaVideoSlash } from "react-icons/fa6";
import unknown from '../assets/unknown.jpg';
import { ImUpload } from "react-icons/im";
import { VscFolderOpened } from "react-icons/vsc";
import { FaRegFileLines } from "react-icons/fa6";
import { VscFolder } from "react-icons/vsc";
import spinnerGIF from '../assets/spinner.gif';
import CodeEditor from '../components/codespace';
import { FaFileContract } from 'react-icons/fa';
import axios from 'axios';

const allowedExtensions = [
    "js", "jsx", "ts", "tsx", "html", "css", "scss", "json", "xml", "py",
    "java", "c", "cpp", "cs", "php", "rb", "go", "swift", "md", "yaml", "sh", "txt",
    "jpg", "jpeg", "png", "gif", "svg", "bmp", "webp", "hpp", "h", "csv", "gitignore", "env"
];

const MAX_FILES = 50;

const Editor = () => {
    const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('darkMode')) || false);
    const [isMicOn, setIsMicOn] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('Select Language');
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const messageInputRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [repoLink, setRepoLink] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [openFolders, setOpenFolders] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedFileContent, setSelectedFileContent] = useState('');
    const [languages] = useState(['Select Language', 'Python', 'JavaScript', 'C/C++', 'C#', 'Ruby']);
    const [languageCodes] = useState([
        ['Python', 71],
        ['JavaScript', 63],
        ['C/C++', 54],
        ['C#', 51],
        ['Ruby', 72]
    ]);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [runningFileName, setRunningFileName] = useState('');
    const [displayedFileType, setDisplayedFileType] = useState(null);
    const [flatFiles, setFlatFiles] = useState([]);
    const [paneHeight, setPaneHeight] = useState(230);
    const [isResizing, setIsResizing] = useState(false);
    const bottomPaneRef = useRef(null);
    const [openTabs, setOpenTabs] = useState([]);
    const [activeTab, setActiveTab] = useState(null);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [navbarHeight, setNavbarHeight] = useState(0);
    const [tabBarHeight, setTabBarHeight] = useState(0);
    const navbarRef = useRef(null);
    const tabBarRef = useRef(null);
    const [codeResult, setCodeResult] = useState('');
    const [codeError, setCodeError] = useState('');
    const [codeMemory, setCodeMemory] = useState('');
    const [codeTime, setCodeTime] = useState('');
    const [codeRunning, setCodeRunning] = useState(0);
    const [error, setError] = useState('')

    useEffect(() => {
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Measure navbar and tab bar heights
    useEffect(() => {
        if (navbarRef.current) {
            setNavbarHeight(navbarRef.current.offsetHeight);
        }
        if (tabBarRef.current) {
            setTabBarHeight(tabBarRef.current.offsetHeight);
        }
    }, [openTabs]); // Re-measure tab bar height when tabs change

    const textColor = darkMode ? 'text-white' : 'text-black';
    const subTextColor = darkMode ? 'text-gray-300' : 'text-black';
    const bgColor = darkMode
    ? 'bg-gradient-to-br from-gray-500 via-gray-950 to-black'
    : 'bg-gradient-to-br from-white via-gray-300 to-gray-400';
  
  const mainBarColor = darkMode
    ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black'
    : 'bg-gradient-to-br from-gray-100 via-white to-gray-300';
    const paneColor = darkMode ? 'rgb(6, 9, 15)' : 'rgb(30, 30, 36)';
    const paneTopColor = darkMode ? 'rgb(9, 12, 17)' : 'rgb(38, 38, 44)';
    const codeBgColor = darkMode ? 'bg-gray-900' : 'bg-gray-200';
    const codeHeadingColor = darkMode ? 'text-blue-900' : 'bg-gray-700';
    const codeColor = darkMode ? 'text-blue-900' : 'text-green-400';

    useEffect(() => {
        const handleStorageChange = () => {
            setDarkMode(JSON.parse(localStorage.getItem('darkMode')) || false);
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsResizing(true);
    };

    const handleMouseMove = (e) => {
        if (isResizing) {
            let newHeight = window.innerHeight - e.clientY;
            if (newHeight > 300) newHeight = 300;
            setPaneHeight(Math.max(100, Math.min(newHeight, window.innerHeight * 0.8)));
        }
    };

    const handleCodeSubmit = async (fileContent, language) => {
        setError("");
        if (!fileContent || fileContent == "") {
            setError("Error: Cannot compile an empty file")
            setCodeRunning(3)
            return
        }
        if (language == "Select Language" || !language) {
            setError("Error: You must select a language before compilation")
            setCodeRunning(3)
            return
        }
        const langCode = languageCodes.find(([name, id]) => name === language)[1];
        const data = {
            source_code: fileContent,
            language_id: langCode
        };

        try {
            setCodeRunning(1);
            const response = await axios.post('http://localhost:3000/code/compile', data)
            setCodeResult(response.data.result.stdout);
            setCodeError(response.data.result.stderr);
            setCodeMemory(response.data.result.memory);
            setCodeTime(response.data.result.time);
            setRunningFileName(selectedFileName);
            console.log(response.data.result)
        } catch (error) {
            console.log(error)
        } finally {
            setCodeRunning(2);
        }
    }

    const handleLanguageSelect = async (languageName) => {
        setSelectedLanguage(languageName);
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

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
        if (files.length > MAX_FILES) {
            alert(`You can only upload up to ${MAX_FILES} files.`);
            setLoading(false);
            return;
        }
        if (files.length > 0) {
            const tree = buildFileTree(files);
            setUploadedFiles(tree);
            setFlatFiles(files);
        }
        setTimeout(() => {
            setLoading(false);
            setShowModal(false);
        }, 1000);
    };

    const handleFileClick = (file) => {
        setSelectedFileName(file)
        console.log(file)
        const fileObj = flatFiles.find(f => f.webkitRelativePath.split('/').pop() === file);
        if (!fileObj) return;
        const fileExtension = file.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            const errorTab = { name: file, content: "Error: File type not supported.", type: "error" };
            setOpenTabs(prev => [...prev, errorTab]);
            setActiveTab(file);
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const newTab = { name: file, content, type: fileExtension };
            setOpenTabs(prev => {
                const alreadyOpen = prev.find(tab => tab.name === file);
                return alreadyOpen ? prev : [...prev, newTab];
            });
            setActiveTab(file);
        };
        if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(fileExtension)) {
            reader.readAsDataURL(fileObj);
        } else {
            reader.readAsText(fileObj);
        }
    };

    const DirectoryTree = ({ tree, openFolders, setOpenFolders, level = 0 }) => {
        const toggleFolder = (folder) => {
            setOpenFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
        };
        const getFilesFromTree = (tree) => {
            let fileList = [];
            for (const key in tree) {
                if (tree.hasOwnProperty(key)) {
                    if (tree[key] === null) fileList.push(key);
                    else fileList = fileList.concat(getFilesFromTree(tree[key]));
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

                                    <span style={{ display: 'block', flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        &nbsp;{key}
                                    </span>
                                </div>
                                {openFolders[key] && <DirectoryTree tree={value} openFolders={openFolders} setOpenFolders={setOpenFolders} level={level + 1} />}
                            </>
                        ) : (
                            <div
                                className="flex flex-row items-center text-gray-300"
                                style={{ maxWidth: '90%' }}
                                onClick={() => handleFileClick(key)}
                            >
                                <FaRegFileLines size={20} />

                                <span style={{ display: 'block', flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    &nbsp;{key}
                                </span>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    useEffect(() => {
        let mediaStream = null;
        const startCamera = async () => {
            try {
                if (!stream) {
                    mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                    setStream(mediaStream);
                    if (videoRef.current) videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Error accessing camera: ", err);
            }
        };
        if (isVideoOn) startCamera();
        else if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [isVideoOn]);

    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    return (
        <div className={`h-screen overflow-hidden relative ${bgColor}`}>
            <div ref={navbarRef}>
                <Navbar />
            </div>
            <div className="flex flex-row" style={{ height: `calc(100vh - ${navbarHeight}px)` }}>
                <div
                    className={`overflow-hidden flex flex-col w-1/5 pb-12 font-PoppinsRegular ${Object.keys(uploadedFiles).length > 0 ? 'justify-start pt-6' : 'justify-center items-center'}`}
                    style={{ minHeight: `calc(100vh - ${navbarHeight}px)`, backgroundColor: mainBarColor }}
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
                                    scrollbarColor: darkMode ? `rgb(160, 160, 160) ${mainBarColor}` : `rgb(7, 7, 7) ${mainBarColor}`,
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

                <div className={`w-3/5 flex flex-col ${subTextColor}`}>
                    <div ref={tabBarRef} className="flex space-x-2 px-4 py-2 bg-gray-800 text-white">
                        {openTabs.map((tab, index) => (
                            <div
                                key={tab.name}
                                className={`flex items-center px-3 py-1 cursor-pointer ${activeTab === tab.name ? 'bg-gray-900' : 'bg-gray-700'}`}
                                onClick={() => setActiveTab(tab.name)}
                            >
                                <span className="truncate max-w-[160px]">{tab.name}</span>
                                <button
                                    className="text-gray-400 hover:text-white"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenTabs(prevTabs => prevTabs.filter((_, i) => i !== index));
                                        if (activeTab === tab.name) {
                                            const nextTab = openTabs[index + 1] || openTabs[index - 1];
                                            setActiveTab(nextTab?.name || null);
                                        }
                                    }}
                                >
                                    &nbsp;&nbsp;&nbsp;x
                                </button>
                            </div>
                        ))}
                    </div>

                    {displayedFileType === "error" ? (
                        <div>
                            <p className="text-red-500 font-bold">{selectedFileContent}</p>
                        </div>
                    ) : displayedFileType === 'png' || displayedFileType === 'jpg' || displayedFileType === 'jpeg' || displayedFileType === 'gif' || displayedFileType === 'bmp' || displayedFileType === 'webp' ? (
                        <div
                            className="flex justify-center"
                            style={{
                                height: `calc(100vh - ${navbarHeight + tabBarHeight + paneHeight}px)`,
                                overflow: 'auto',
                            }}
                        >
                            <img
                                src={selectedFileContent}
                                alt={selectedFileName}
                                className="max-w-full"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    height: 'auto',
                                    objectFit: 'contain',
                                    borderRadius: '8px',
                                }}
                            />
                        </div>
                    ) : (
                        <div
                            style={{
                                height: `calc(100vh - ${navbarHeight + tabBarHeight + paneHeight}px)`,
                                overflow: 'hidden', // Clip any overflow
                            }}
                        >
                            <CodeEditor
                                givenCode={openTabs.find(tab => tab.name === activeTab)?.content || ''}
                                style={{
                                    height: '100%',
                                    overflowY: 'auto', // Allow scrolling within CodeEditor
                                    scrollbarWidth: 'thin', // Customize scrollbar
                                    scrollbarColor: darkMode ? 'rgb(160, 160, 160) rgb(30, 30, 36)' : 'rgb(7, 7, 7) rgb(200, 200, 200)',
                                }}
                            />
                        </div>
                    )}
                    <div
                        className="w-5/6"
                        style={{
                            zIndex: 10,
                            height: `${paneHeight}px`,
                            position: 'absolute',
                            bottom: 0,
                            backgroundColor: paneColor,
                        }}
                    >
                        <div
                            className="w-full h-2 cursor-ns-resize"
                            style={{ backgroundColor: paneTopColor }}
                            onMouseDown={handleMouseDown}
                        />
                        {/* Pane Content */}
                        <div
                            className="p-4 flex flex-row overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words text-white"
                            style={{
                                height: '100%',
                                maxHeight: `${paneHeight}px`,
                                scrollbarColor: darkMode ? 'rgb(160, 160, 160) rgb(45, 55, 72)' : 'rgb(7, 7, 7) rgb(229, 231, 235)',
                            }}
                        >
                            <pre className={`font-mono text-sm whitespace-pre-wrap break-words overflow-x-hidden ${codeRunning === 3 && error ? 'text-red-400' : codeRunning === 1 ? 'text-green-400' : 'text-white'}`}>
                                <div className='flex flex-row'>
                                    {`OptiCode Compiler v1.0.0 
----------------------------------------`}
                                    {/* Run Button */}
                                    <div className="mr-7 z-20 ml-auto">
                                        <button
                                            className="font-Poppins bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-md text-sm"
                                            onClick={() => handleCodeSubmit(openTabs.find(tab => tab.name === activeTab)?.content, selectedLanguage)}
                                        >
                                            ▶&nbsp;&nbsp;Compile
                                        </button>
                                    </div>
                                </div>
                                {codeRunning === 3 && error ? (
                                    <>
                                        ➜&nbsp;{error}
                                    </>
                                ) : codeRunning === 1 ? (
                                    <>
                                        ➜&nbsp;Compiling {runningFileName}...
                                    </>
                                ) : codeRunning === 0 ? (
                                    <>
                                        ➜&nbsp;Initializing build environment...
                                        <br />
                                        ➜&nbsp;Waiting for code input...
                                        <br />
                                        Compile your code to see the outputs...
                                    </>
                                ) : (
                                    <>
                                        Compilation Results:
                                        <br />
                                        {codeResult == null ? (
                                            <span className="text-red-400">{codeError}</span>
                                        ) : (
                                            <span className="text-green-400">{codeResult}</span>
                                        )}
                                        <br />
                                        ------------------------------------------------
                                        <br />
                                        Process Executed in {codeTime} seconds, Memory = {codeMemory}
                                    </>
                                )}
                            </pre>
                        </div>

                    </div>
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

                    <div className='flex justify-center items-center flex-col space-y-5' style={{ marginTop: '65%' }}>
                        <div className="z-20">
                            <button
                                className="font-Poppins bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-md text-sm"
                                onClick={() => handleCodeSubmit(openTabs.find(tab => tab.name === activeTab)?.content, selectedLanguage)}
                            >
                                Connect with Dev
                            </button>
                        </div>
                        <select
                            className={`w-3/4 p-2 text-center rounded border font-Poppins hover: cursor-pointer ${subTextColor}`}
                            style={{
                                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
                                backgroundColor: paneColor,
                                borderColor: 'transparent',
                                textAlign: 'center',

                            }}
                            value={selectedLanguage}
                            onChange={(e) => handleLanguageSelect(e.target.value)}
                        >
                            {languages.map((language) => (
                                <option key={language} value={language}>
                                    {language}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 h-full" style={{ zIndex: 150 }}>
                    <div className={`${textColor} p-6 rounded-lg shadow-lg relative ${mainBarColor}`}
                        style={{ width: '40%', height: '50%' }}>

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