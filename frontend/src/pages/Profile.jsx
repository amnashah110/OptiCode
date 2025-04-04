import React, { useState, useEffect } from 'react';

const Profile = () => {
    const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('darkMode')) || false);

    const textColor = darkMode ? 'text-white' : 'text-black';
    const subTextColor = darkMode ? 'text-gray-300' : 'text-black';
    const bgColor = darkMode ? '#030712' : 'rgb(255, 255, 255)';

    return (
        <div className="h-screen overflow-y-auto relative">

        </div>
    )
}

export default Profile;