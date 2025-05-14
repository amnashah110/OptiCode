import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import { Typewriter } from 'react-simple-typewriter';
import Footer from '../components/footer';
import { FaLightbulb } from 'react-icons/fa'; 
import avatarM from '../assets/muhammad.jpeg';
import avatarA from '../assets/amna.jpeg';
import avatarF from '../assets/falah.jpeg';

const About = () => {
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
    const subTextColor = darkMode ? 'text-gray-300' : 'text-black';
    const bgColor = darkMode
    ? 'bg-gradient-to-br from-gray-500 via-gray-950 to-black'
    : 'bg-gradient-to-br from-white via-gray-300 to-gray-400';
  

    return (
        <div className={`h-screen overflow-auto ${bgColor}`}>
            <Navbar />

            {/* Main Heading */}
            <div className="flex flex-col justify-center items-center mt-20 text-4xl font-Poppins">
                <h1 className={textColor}>
                    <Typewriter
                        words={['About OptiCode']}
                        loop={false}
                        cursor
                        cursorStyle="|"
                        typeSpeed={100}
                        deleteSpeed={50}
                        delaySpeed={1000}
                    />
                </h1>
            </div>

            <div className="font-PoppinsRegular max-w-4xl mx-auto py-10 px-4 text-center">
                <p className={`text-lg ${subTextColor} mb-6`}>
                    OptiCode is an innovative platform designed to automate code refactoring suggestions
                    and provide insightful project metrics. Our goal is to simplify the development process
                    by identifying issues such as duplicate code, unused variables, and code smells, while
                    offering actionable recommendations to enhance code quality and maintainability.
                </p>
                <p className={`text-lg ${subTextColor} mb-6`}>
                    Powered by technologies like React.js, Node.js, MongoDB, and Gemini, OptiCode is
                    the ideal tool for developers striving for cleaner, more efficient code.
                </p>

                <h2 className={`text-3xl font-Poppins ${textColor} mt-10 mb-6`}>Meet the Creators</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Creator Cards */}
                    {[{
                        name: 'Muhammad Raza Khan',
                        role: 'Full-Stack Developer',
                        passion: 'building robust web solutions',
                        image: avatarM,
                    },
                    {
                        name: 'Falah Zainab',
                        role: 'Data Analyst',
                        passion: 'deriving meaningful insights from data',
                        image: avatarF,
                    },
                    {
                        name: 'Amna Shah',
                        role: 'Backend Specialist',
                        passion: 'crafting seamless backend integrations',
                        image: avatarA,
                    }].map((creator, index) => (
                        <div
                            key={index}
                            className={`shadow-lg rounded-lg p-6 text-center relative hover:scale-105 transform transition-all duration-300 ${
                                darkMode ? 'bg-gradient-to-br from-gray-500 via-gray-950 to-black text-gray-300' : 'bg-gradient-to-br from-white via-gray-300 to-gray-400 text-black'
                            }`}
                        >
                            <div className="w-28 h-28 mx-auto mb-4 rounded-full bg-gray-200 shadow-inner overflow-hidden">
                                <img
                                    src={creator.image}
                                    alt={creator.name}
                                    className="object-cover w-full h-full rounded-full"
                                    style={{ border: '4px solid black' }}
                                />
                            </div>
                            <h3 className="text-xl font-Poppins">{creator.name}</h3>
                            <p className="font-Poppins mt-2">{creator.role}</p>
                            <p className="text-sm mt-2">Passionate about {creator.passion}</p>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default About;