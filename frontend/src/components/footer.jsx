import React from "react";

const Footer = () => {
    return (
        <footer className="bg-black text-white font-Poppins py-6">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center">
                    <p className="text-m">&copy; 2025 OptiCode. All rights reserved.</p>
                    <div className="text-m flex space-x-4">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">GitHub</a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">LinkedIn</a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">Twitter</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;