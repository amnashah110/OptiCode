import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Typewriter } from 'react-simple-typewriter';
import { useUserContext } from '../../src/context/userContext';
import icon from '../assets/opti.png';
import loginImg from '../assets/login.jpg';
import showPasswordImg from '../assets/eye.png';
import hidePasswordImg from '../assets/hidden.png';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [pressed, setPressed] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [signUpError, setSignUpError] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [isError, setIsError] = useState(false);
    const { setUserData } = useUserContext();

    const navigate = useNavigate();

    const validateForm = () => {
        setIsError(false);
        const formErrors = {};
        if ((!username || !password) && !isSignup) {
            formErrors.required = 'All fields are required';
            setIsError(true);
        };
        if (isSignup && (!username || !password || !firstName || !lastName || !gender || !age)) {
            formErrors.required = 'All fields are required'
            setIsError(true);
        };
        if (isSignup && password !== confirmPassword) {
            formErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSignUp = async (event) => {
        event.preventDefault();
        setPressed(true);
        setSignUpError(false);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/', { username, password, isSignup, firstName, lastName, gender, age });

            if (response.data.status === 1) {
                setIsSignup(false);
                setLoginError(false);
            } else {
                setSignUpError(true);
            }
        } catch (error) {
            navigate('/');
        }
    };

    const handleLogin = async (event) => {
        console.log('login');
        event.preventDefault();
        setPressed(true);
        setLoginError(false);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/', { username: username, password, isSignup });

            if (response.data.status === 1) {
                const { USER_ID, PASSWORD, FIRST_NAME, LAST_NAME, GENDER, AGE, TOKEN_COUNT, THEME } = response.data.user;
                setUserData({ userID: USER_ID, username, password: PASSWORD, firstName: FIRST_NAME, lastName: LAST_NAME, gender: GENDER, age: AGE, theme: THEME, token: TOKEN_COUNT, logged: false, card: false });
                navigate('/dashboard');
            } else {
                setLoginError(true);
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginError(true);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        setUserData({});
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="h-screen overflow-y-auto relative" style={{ backgroundImage: `url(${loginImg})`, }}>
            <div className="flex w-full">
                {/* Left Side */}
                <div className="w-full flex flex-col text-center justify-center" style={{ alignItems: 'center' }}>
                    <img
                        src={`${icon}`}
                        alt="icon"
                        width={'70%'}
                    />
                    <div className="font-Poppins" style={{ maxWidth: '700px', fontSize: '2em', color: '#A9A9A9', overflowWrap: 'break-word', whiteSpace: 'normal', marginTop: '2%' }}>
                        <Typewriter
                            words={['Simplify. Optimize. Transform.']}
                            loop={false}
                            cursor
                            cursorStyle="|"
                            typeSpeed={100}
                            deleteSpeed={50}
                            delaySpeed={1000}
                        />
                    </div>
                </div>
                {/* Right Side */}
                <div className="w-3/4 shadow-lg font-Poppins flex flex-col justify-center" style={{ padding: '5%', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                    <h2 className="text-2xl font-bold mb-9 text-center" style={{ fontSize: '2.5em', color: '#A9A9A9' }}>
                        {isSignup ? 'Sign Up' : 'Login'}
                    </h2>
                    <form onSubmit={isSignup ? handleSignUp : handleLogin}>
                        <div className="mb-4">
                            <label className="block mb-1 font-Poppins" style={{ fontSize: '1.1em', color: '#A9A9A9' }}>Username</label>
                            <input
                                type="text"
                                className="w-full p-2 rounded-lg bg-gray-700 text-white font-PoppinsRegular focus:outline-white"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className={`flex mb-4 ${isSignup ? 'space-x-4' : 'flex-col'}`}>
                            <div className={`w-${isSignup ? '1/2' : 'full'}`}>
                                <label className="block mb-1 font-Poppins" style={{ fontSize: '1.1em', color: '#A9A9A9' }}>Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="w-full p-2 rounded-lg bg-gray-700 text-white font-PoppinsRegular focus:outline-white"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <img
                                        src={showPassword ? hidePasswordImg : showPasswordImg}
                                        alt={showPassword ? 'Hide password' : 'Show password'}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2 cursor-pointer"
                                        style={{ width: '24px', height: '24px' }}
                                    />
                                </div>
                            </div>
                            {isSignup && (
                                <div className="w-1/2">
                                    <label className="block mb-1 font-PoppinsBold" style={{ fontSize: '1.1em', color: '#A9A9A9' }}>Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            className="w-full p-2 rounded-lg bg-gray-700 text-white font-PoppinsRegular focus:outline-white"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <img
                                            src={showConfirmPassword ? hidePasswordImg : showPasswordImg}
                                            alt={showConfirmPassword ? 'Hide password' : 'Show password'}
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-2 cursor-pointer"
                                            style={{ width: '24px', height: '24px' }}
                                        />
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                                </div>
                            )}
                        </div>
                        {isSignup && (
                            <div className="flex mb-4 space-x-4">
                                <div className="w-1/2 pr-2">
                                    <label className="block mb-1 font-PoppinsBold" style={{ fontSize: '1.1em', color: '#A9A9A9' }}>First Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 rounded-lg bg-gray-700 text-white font-PoppinsRegular focus:outline-white"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="w-1/2 pl-2">
                                    <label className="block mb-1 font-PoppinsBold" style={{ fontSize: '1.1em', color: '#A9A9A9' }}>Last Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 rounded-lg bg-gray-700 text-white font-PoppinsRegular focus:outline-white"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                        {isSignup && (
                            <div className="flex mb-4 space-x-4">
                                <div className="w-1/2 pr-2">
                                    <label className="block mb-1 font-PoppinsBold" style={{ fontSize: '1.1em', color: '#A9A9A9' }}>Age</label>
                                    <input
                                        type="number"
                                        id="age"
                                        name="age"
                                        min="0"
                                        max="120"
                                        className="w-full p-2 rounded-lg bg-gray-700 text-white font-PoppinsRegular focus:outline-white pr-2"
                                        onChange={(e) => setAge(e.target.value)}
                                    />
                                </div>
                                <div className="w-1/2 pl-2">
                                    <label className="block mb-1 font-PoppinsBold" style={{ fontSize: '1.1em', color: '#A9A9A9' }}>Gender</label>
                                    <select
                                        className="w-full p-2 rounded-lg bg-gray-700 text-white font-PoppinsRegular focus:outline-white"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        <motion.button
                            whileTap={{ scale: 0.7 }}
                            type="submit"
                            className="w-full p-2 bg-gray-500 text-white rounded-lg font-PoppinsBold mt-4 hover:bg-gray-600 hover:duration-300"
                            disabled={loading}
                            style={{ fontSize: '1.2em' }}
                        >
                            {isSignup ? 'Sign Up' : 'Login'}
                        </motion.button>
                        {loginError && <p className="text-red-500 text-center mt-4">Username or Password is Incorrect</p>}
                        {isError && <p className="text-red-500 text-center mt-2">All Fields Are Required!</p>}
                        {signUpError && <p className="text-red-500 text-center mt-2">Username Already Taken</p>}
                    </form>
                    <p className="text-center mt-4">

                        <button
                            type="button"
                            onClick={() => { setIsSignup(!isSignup), setLoginError(false), setSignUpError(false), setIsError(false), setUsername(''), setPassword(''), setConfirmPassword(''), setAge('') }}
                            className="text-gray-500 font-PoppinsBold hover:text-gray-400 hover:duration-300"
                            style={{ fontSize: '1.1em', marginTop: '-5%' }}
                        >
                            {isSignup ? 'Already have an account? Login' : 'Don\'t have an account? Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;