import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';

const Profile = () => {
    const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('darkMode')) ?? true);
    const [userData, setUserData] = useState(null);
    const [devData, setDevData] = useState(null);
    const username = localStorage.getItem('githubHandle');
    const dev = localStorage.getItem('dev');

    useEffect(() => {
        const handleStorageChange = () => {
            setDarkMode(JSON.parse(localStorage.getItem('darkMode')) || false);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        fetch(`https://api.github.com/users/${username}`)
            .then(res => res.json())
            .then(data => setUserData(data))
            .catch(err => console.error('GitHub API error (user):', err));

        if (dev) {
            fetch(`https://api.github.com/users/${dev}`)
                .then(res => res.json())
                .then(data => setDevData(data))
                .catch(err => console.error('GitHub API error (dev):', err));
        }
    }, [username, dev]);

    const textColor = darkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = darkMode ? 'text-gray-400' : 'text-gray-600';
    const bgColor = darkMode ? 'bg-gradient-to-br from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-100 to-white';
    const cardBg = darkMode ? 'bg-white/5 backdrop-blur-lg' : 'bg-white/80 backdrop-blur-md';
    const bobBg = darkMode ? 'bg-green-900/30' : 'bg-green-100/50';
    const buttonBase = 'w-full py-2 rounded-xl font-semibold transition duration-300';
    const borderColor = darkMode ? 'border-white' : 'border-black';

    if (!userData) {
        return (
            <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
                <p className="text-gray-400 text-lg animate-pulse">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className={`${bgColor} min-h-screen transition-all duration-500 font-Poppins`}>
            <Navbar />
            <div className="flex flex-col md:flex-row justify-center items-start gap-10 py-12 max-w-6xl mx-auto">

                {/* Main Profile Card */}
                <div className={`w-full md:w-full ${cardBg} rounded-4xl p-10 shadow-2xl text-center relative overflow-hidden`}>
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-700 via-indigo-500 to-indigo-400 rounded-t-3xl opacity-80" />

                    <div className="relative mt-16">
                        <img
                            src={userData?.avatar_url}
                            alt="Avatar"
                            className={`w-32 h-32 rounded-full mx-auto border-4 ${borderColor} shadow-lg`}
                        />
                    </div>

                    <h2 className={`text-3xl font-bold mt-4 mb-1 ${textColor}`}>{userData?.name || 'Unknown'}</h2>
                    <a
                        href={userData.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:underline block mb-2"
                    >
                        @{userData?.login}
                    </a>
                    <p className={`${subTextColor} italic mb-4`}>{userData?.bio}</p>

                    <div className="flex justify-around text-sm mb-6 text-gray-300 dark:text-gray-400">
                        <p>Repos: <span className="font-bold">{userData?.public_repos}</span></p>
                        <p>Followers: <span className="font-bold">{userData?.followers}</span></p>
                        <p>Following: <span className="font-bold">{userData?.following}</span></p>
                    </div>

                    <div className="space-y-3">
                        <button className={`${buttonBase} bg-gray-800 hover:bg-gray-700 text-white`}>Change Password</button>
                        <button className={`${buttonBase} bg-red-700 hover:bg-red-600 text-white`}>Delete Account</button>
                        <button className={`${buttonBase} bg-indigo-700 hover:bg-indigo-600 text-white`}>MatchMaking</button>
                    </div>
                </div>

                {/* Partner Dev Card */}
                <div className={`w-full md:w-1/3 ${bobBg} ${darkMode ? 'text-white' : 'text-gray-900'} p-8 rounded-3xl shadow-xl relative overflow-hidden`}>
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-300 rounded-t-3xl opacity-80" />

                    <div className="relative mt-12">
                        <img
                            src={`https://github.com/${dev || 'octocat'}.png`}
                            alt={dev || 'Dev'}
                            className={`w-28 h-28 rounded-full mx-auto border-4 ${borderColor} shadow-md`}
                        />
                    </div>

                    <p className={`text-l mt-4 mb-2 animate-pulse text-center ${darkMode ? 'text-green-300' : 'text-green-800'}`}>YOU'RE PARTNERED WITH</p>
                    <h3 className="text-l text-center">{devData?.name || 'Unknown Dev'} {dev}</h3> <br/>
                    <p className={`text-center italic ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
                        {devData?.bio || '"Loading developer bio..."'}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Profile;
