import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import axios from 'axios';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, age, githubHandle, experienceLevel, password } = req.body;

        let githubExists = false;
        try {
            await axios.get(`https://api.github.com/users/${githubHandle}`, {
                headers: { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` }
            });
            githubExists = true;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return res.status(400).json({ error: 'GitHub handle does not exist' }); 
            }
            console.error('GitHub API error:', error.response?.status, error.response?.data);
            return res.status(500).json({ error: 'GitHub API request failed' });
        }

        if (!githubExists) {
            return res.status(400).json({ error: 'GitHub handle does not exist' });
        }

        const existingUser = await User.findOne({ githubHandle });
        if (existingUser) {
            return res.status(400).json({ error: 'GitHub handle already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            age,
            githubHandle,
            experienceLevel,
            password: hashedPassword
        });

        await newUser.save();
        const token = jwt.sign({ githubHandle }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ message: 'User registered successfully', token });

    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { githubHandle, password } = req.body;

        const user = await User.findOne({ githubHandle });
        if (!user) {
            return res.status(400).json({ error: 'No user found for this GitHub handle' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid Password' });
        }

        const token = jwt.sign({ githubHandle }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ 
            status: 1, 
            message: 'Login successful', 
            token,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                githubHandle: user.githubHandle,
                experienceLevel: user.experienceLevel,
                darkMode: user.darkMode
            }
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default router;
