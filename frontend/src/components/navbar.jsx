import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../src/context/userContext';
import logo from '../assets/opticode.png';
import unknown from '../assets/unknown.jpg';

const Navbar = () => {
    const { userData } = useUserContext();
    const location = useLocation();
    const navigate = useNavigate();
    const [hoveredLink, setHoveredLink] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                className="flex flex-1 justify-center space-x-10"
                style={{ flex: 2, textAlign: 'center' }}
            >
                {['Home', 'Analyze', 'Metrics', 'Repositories', 'About'].map((linkName, index) => {
                    const paths = ['/', '/analyze', '/metrics', '/repositories', '/about'];
                    return (
                        <div className="relative" key={index}>
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
                    Welcome, {userData?.firstName || 'Guest'}
                </p>
                <div
                    className="w-8 h-8 rounded-full bg-center bg-cover"
                    style={{
                        backgroundImage: `url(${userData?.image || unknown})`,
                        cursor: 'pointer',
                    }}
                    onClick={toggleSidebar}
                />
            </div>

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-black shadow-lg transform ${
                    isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
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
                            backgroundImage: `url(${userData?.image || unknown})`,
                        }}
                    />
                    <p className="text-white text-lg">{userData?.firstName || 'Guest'}</p>
                    <hr className="w-4/5 my-4" style={{ border: '1px solid white' }} />
                    <button
                        onClick={handleViewProfile}
                        className="text-white text-lg mb-4"
                    >
                        View Profile
                    </button>
                    <Link to="/" className="text-white text-lg">
                        Logout
                    </Link>
                </div>
                {/* F.A.M. Footer */}
                <p
                    className="text-white absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm"
                >
                    © Team OptiCode
                </p>
            </div>
        </nav>
    );
};

export default Navbar;
