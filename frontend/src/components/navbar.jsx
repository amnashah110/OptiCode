import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/opticode.png';
import unknown from '../assets/unknown.jpg';
import { FaLightbulb } from 'react-icons/fa';
import axios from 'axios';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [hoveredLink, setHoveredLink] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const githubHandle = localStorage.getItem('githubHandle')

    useEffect(() => {
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme === 'true') {
            setIsDarkMode(true);
            document.body.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.body.classList.remove('dark');
        }
    }, []);

    const getLinkStyle = (linkName, path) => {
        const isActive = location.pathname === path;
        return {
            color: isActive
                ? 'rgb(211, 211, 211)'
                : hoveredLink === linkName
                    ? 'rgb(211, 211, 211)'
                    : '#ffffff',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)',
            transition: 'color 0.3s ease',
            fontSize: '1.1em',
        };
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleViewProfile = () => {
        setIsSidebarOpen(false);
        navigate('/profile');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('githubHandle');
        navigate('/login');
    };

    const toggleDarkMode = async () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode);
        window.dispatchEvent(new Event("storage"));

        if (newDarkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
        console.log(newDarkMode);
        try {
            await axios.put('http://localhost:3000/pref/updateTheme', {
                darkMode: newDarkMode,
                githubHandle: localStorage.getItem('githubHandle')
            });
        } catch (error) {
            console.error('Failed to update theme preference:', error);
        }
    };

    return (
        <nav
            className="flex items-center justify-between p-5 font-Poppins"
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                width: '100%',
                backgroundColor: 'black',
            }}
        >
            {/* Logo */}
            <div className="flex-1 flex justify-start">
                <Link to="/">
                    <img
                        src={logo}
                        alt="OptiCode Logo"
                        className="h-10 lg:h-12"
                        style={{ cursor: 'pointer' }}
                    />
                </Link>
            </div>

            {/* Centered Navbar Links */}
            <div
                className="flex flex-1 justify-center space-x-10 mr-5"
                style={{ flex: 2, textAlign: 'center' }}
            >
                {['Home', 'Analyze', 'Metrics', 'Repositories', 'Code Editor', 'Challenges', 'About'].map((linkName, index) => {
                    const paths = ['/', '/analyze', '/metrics', '/repositories', '/editor', '/challenges', '/about'];
                    return (
                        <div className="relative" style={{ whiteSpace: 'nowrap', overflow: 'hidden' }} key={index}>
                            <Link
                                to={paths[index]}
                                style={getLinkStyle(linkName, paths[index])}
                                onMouseEnter={() => setHoveredLink(linkName)}
                                onMouseLeave={() => setHoveredLink(null)}
                            >
                                {linkName}
                            </Link>
                            {hoveredLink === linkName && (
                                <div
                                    className="absolute bg-gray-800 text-white text-xs p-1 rounded"
                                    style={{
                                        top: '150%',
                                        left: '0',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {`Navigate to ${linkName}`}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex-1 flex justify-end items-center space-x-4">
                <p style={{ fontSize: '1.1em', color: 'white' }}>
                    Welcome, {firstName ? `${firstName}` : 'Guest'}
                </p>
                <div
                    className="w-8 h-8 rounded-full bg-center bg-cover"
                    style={{
                        backgroundImage: githubHandle
                            ? `url(https://github.com/${githubHandle}.png)`
                            : `url(${unknown})`,
                        cursor: 'pointer',
                    }}
                    onClick={toggleSidebar}
                />
            </div>

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-black shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                    } transition-transform duration-300 ease-in-out`}
                style={{ zIndex: 100 }}
            >
                <button
                    className="text-white text-2xl absolute top-4 right-4"
                    onClick={toggleSidebar}
                >
                    &times;
                </button>
                <div className="flex flex-col items-center mt-16">
                    <div
                        className="w-16 h-16 lg:w-32 lg:h-32 rounded-full bg-center bg-cover mb-4"
                        style={{
                            backgroundImage: githubHandle
                                ? `url(https://github.com/${githubHandle}.png)`
                                : `url(${unknown})`,
                        }}
                    />
                    <p className="text-white text-lg">{firstName && lastName ? `${firstName} ${lastName}` : 'Guest'}</p>
                    <hr className="w-4/5 my-4" style={{ border: '1px solid white' }} />
                    {localStorage.getItem('token') && (
                        <>
                            <button
                                onClick={handleViewProfile}
                                className="text-white text-lg mb-4"
                            >
                                View Profile
                            </button>
                            <button onClick={handleLogout} className="text-white text-lg mb-4">
                                Log Out
                            </button>

                        </>
                    )}
                    {!localStorage.getItem('token') && (
                        <>
                            <Link to="/login" className="text-white text-lg mb-4">
                                Log In
                            </Link>
                        </>
                    )}
                </div>
                {/* Footer */}
                <div className='flex flex-col justify-center items-center'>
                    <p className="flex flex-row text-white absolute bottom-11 text-m">
                        <div
                            onClick={toggleDarkMode}
                            className="cursor-pointer"
                        >
                            <FaLightbulb
                                size={30}
                                className={isDarkMode ? 'text-yellow-400' : 'text-white'}
                                style={{ transition: 'color 0.3s ease', position: 'relative', bottom: '5px' }}
                            />
                        </div>
                        &nbsp;&nbsp;Enable Dark Mode&nbsp;&nbsp;
                    </p>
                    <p
                        className="text-white absolute bottom-4 text-sm"
                    >
                        © Team OptiCode
                    </p>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;