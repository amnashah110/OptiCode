import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import windowImage from '../assets/window.png';
import { Typewriter } from 'react-simple-typewriter';

const Home = () => {
    const { ref: firstColumnRef, inView: isFirstVisible } = useInView({ threshold: 0.1 });
    const { ref: secondColumnRef, inView: isSecondVisible } = useInView({ threshold: 0.1 });
    const { ref: thirdColumnRef, inView: isThirdVisible } = useInView({ threshold: 0.1 });
    const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('darkMode')) || false);
    
        useEffect(() => {
            const handleStorageChange = () => {
                setDarkMode(JSON.parse(localStorage.getItem('darkMode')) || false);
            };
    
            window.addEventListener('storage', handleStorageChange);
    
            return () => {
                window.removeEventListener('storage', handleStorageChange);
            };
        }, []);
    
        const textColor = darkMode ? 'text-white' : 'text-black';
    
    const subTextColor = darkMode ? 'text-gray-300' : 'text-gray-700';
    
    const bgColor = darkMode
      ? 'bg-gradient-to-br from-gray-800 via-gray-950 to-black'
      : 'bg-gradient-to-br from-white via-gray-200 to-gray-400';
    

    return (
        <div className={`h-screen overflow-y-auto overflow-x-hidden relative pb-9 ${bgColor}`}>

            <Navbar />
            <div
                className="flex flex-col justify-center items-center"
                style={{
                    marginTop: '7%',
                    fontSize: '2.5em',
                }}
            >
                <h1 className={`font-Poppins ${textColor}`}>
                    <Typewriter
                        words={['Simplify. Optimize. Transform.']}
                        loop={false}
                        cursor
                        cursorStyle="|"
                        typeSpeed={100}
                        deleteSpeed={50}
                        delaySpeed={1000}
                    />
                </h1>
            </div>
            <div className="flex flex-col">
                {/* First Column */}
                <div
                    className="flex flex-row justify-center items-center text-right space-x-14"
                    style={{
                        paddingLeft: '7%',
                        paddingRight: '7%',
                    }}
                >
                    <div className="w-1/2" style={{ marginTop: '7%' }}>
                        <img
                            src={`${windowImage}`}
                            alt="Window"
                            style={{
                                filter: isFirstVisible ? 'brightness(1)' : 'brightness(0.3)',
                                transition: 'filter 0.5s ease',
                            }}
                        />
                    </div>
                    <div
                        ref={firstColumnRef}
                        className={`w-1/2 transition-transform duration-1000 ease-out ${isFirstVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
                    >
                        <div className="flex flex-col">
                            <div className={`flex flex-row items-center mb-6 ml-auto ${textColor}`} style={{marginTop: '7%'}}>
                                <div
                                    className="flex justify-center items-center font-Poppins"
                                    style={{
                                        fontSize: '1.7em',
                                        marginRight: '20px',
                                    }}
                                >
                                    About Us
                                </div>
                                <Link
                                    to="/about"
                                    className="circle-link font-Poppins"
                                    style={{
                                        width: '130px',
                                        height: '130px',
                                        borderRadius: '50%',
                                        backgroundColor: '#3C4142',
                                        color: 'white',
                                        fontSize: '3.5em',
                                        position: 'relative',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                                        background: 'linear-gradient(145deg, #5A6B6F, #3C4142)',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease-in-out',
                                    }}
                                >
                                    1
                                </Link>
                            </div>
                            <h1 className={`font-PoppinsRegular ${textColor}`} style={{ fontSize: '1.3em' }}>
                           OptiCode is an AI-powered code refactoring and collaboration 
platform that enhances development workflows by providing automated code 
improvement suggestions, real-time collaboration, and GitHub repository insights.</h1>
                        </div>
                    </div>
                </div>
                {/* Second Column */}
                <div
                    className="flex flex-row justify-center items-center text-left space-x-14"
                    style={{
                        paddingLeft: '7%',
                        paddingRight: '7%',
                    }}
                >
                    <div
                        ref={secondColumnRef}
                        className={`w-1/2 transition-transform duration-1000 ease-out ${isSecondVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
                    >
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center mb-6 mr-auto font-Poppins" style={{marginTop: '7%'}}>
                                <Link
                                    to="/repositories"
                                    className="circle-link"
                                    style={{
                                        width: '130px',
                                        height: '130px',
                                        borderRadius: '50%',
                                        backgroundColor: '#3C4142',
                                        color: 'white',
                                        fontSize: '3.5em',
                                        position: 'relative',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                                        background: 'linear-gradient(145deg, #5A6B6F, #3C4142)',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease-in-out',
                                    }}
                                >
                                    2
                                </Link>
                                <div
                                    className={`flex justify-center items-center ${textColor}`}
                                    style={{
                                        fontSize: '1.7em',
                                        marginLeft: '20px',
                                    }}
                                >
                                    How To Use
                                </div>
                            </div>
                            <h1 className={`font-PoppinsRegular ${textColor}`} style={{ fontSize: '1.3em' }}>
                                1. Connect your GitHub account<br/>
                                2. Choose a repository<br/>
                                3. Let the platform analyze your codebase, and start receiving personalized, actionable feedback to enhance code quality. 
                            </h1>
                        </div>
                    </div>
                    <div className="w-1/2" style={{ marginTop: '7%' }}>
                        <img
                            src={`${windowImage}`}
                            alt="Window"
                            style={{
                                filter: isSecondVisible ? 'brightness(1)' : 'brightness(0.3)',
                                transition: 'filter 0.5s ease',
                            }}
                        />
                    </div>
                </div>
                {/* Third Column */}
                <div
                    className="flex flex-row justify-center items-center text-right space-x-14"
                    style={{
                        paddingLeft: '7%',
                        paddingRight: '7%',
                    }}
                >
                    <div className="w-1/2" style={{ marginTop: '7%' }}>
                        <img
                            src={`${windowImage}`}
                            alt="Window"
                            style={{
                                filter: isThirdVisible ? 'brightness(1)' : 'brightness(0.3)',
                                transition: 'filter 0.5s ease',
                            }}
                        />
                    </div>
                    <div
                        ref={thirdColumnRef}
                        className={`w-1/2 transition-transform duration-1000 ease-out ${isThirdVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
                    >
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center mb-6 ml-auto font-Poppins" style={{ marginTop: '7%'}}>
                                <div
                                    className={`flex justify-center items-center ${textColor}`}
                                    style={{
                                        fontSize: '1.7em',
                                        marginRight: '20px',
                                    }}
                                >
                                    Get Started
                                </div>
                                <Link
                                    to="/about"
                                    className="circle-link"
                                    style={{
                                        width: '130px',
                                        height: '130px',
                                        borderRadius: '50%',
                                        backgroundColor: '#3C4142',
                                        color: 'white',
                                        fontSize: '3.5em',
                                        position: 'relative',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                                        background: 'linear-gradient(145deg, #5A6B6F, #3C4142)',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease-in-out',
                                    }}
                                >
                                    3
                                </Link>
                            </div>
                            <h1 className={`flex justify-center items-center ${textColor}`} style={{ fontSize: '1.3em' }}>
                                Our platform helps developers improve code quality by automatically suggesting refactoring improvements, like removing duplicates and unused variables.
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;