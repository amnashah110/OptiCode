import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-black text-white font-Poppins py-6">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center">
                    <p className="text-m">&copy; 2025 OptiCode. All rights reserved.</p>
                    <div className="text-m flex space-x-4">
                        <a className="flex flex-row space-x-2 hover:text-blue-400 transition duration-200" href="https://linktr.ee/opticode_github" target="_blank" rel="noopener noreferrer">
                            <FaGithub size={24}/>
                            <p>GitHub</p>
                        </a>
                        <a className="flex flex-row space-x-2 hover:text-blue-400 transition duration-200" href="https://linktr.ee/opticode_linkedin" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin size={24} />
                            <p>LinkedIn</p>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;