import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import Challenge from '../models/challenge.js'; 

dotenv.config();

const router = express.Router();

// 1. Get a random challenge
router.get('/challenge/random', async (req, res) => {
    try {
        const count = await Challenge.countDocuments();
        const random = Math.floor(Math.random() * count);
        const challenge = await Challenge.findOne().skip(random);
        res.json(challenge);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch challenge' });
    }
});

// 2. Submit a solution
router.post('/challenge/:id/submit', async (req, res) => {
    const { source_code, language_id } = req.body;
    const { id } = req.params;

    if (!source_code || !language_id) {
        return res.status(400).json({ error: 'Missing source code or language ID' });
    }

    try {
        const challenge = await Challenge.findById(id);
        if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

        const testCases = [...challenge.testCases, ...challenge.hiddenTests];

        const results = [];

        for (const test of testCases) {
            const inputStr = `${test.input.nums.join(' ')}\n${test.input.target}`;
            const expectedOutput = test.output.join(' ');

            const response = await axios.post(
                'https://judge0-ce.p.rapidapi.com/submissions',
                {
                    source_code,
                    language_id,
                    stdin: inputStr,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                    },
                    params: {
                        base64_encoded: 'false',
                        wait: 'true',
                    },
                }
            );

            const actualOutput = response.data.stdout?.trim().replace(/\s+/g, ' ');
            const passed = actualOutput === expectedOutput;

            results.push({
                input: test.input,
                expected: expectedOutput,
                actual: actualOutput,
                passed,
            });
        }

        const allPassed = results.every(r => r.passed);
        res.json({ allPassed, results });
    } catch (error) {
        console.error('Evaluation error:', error?.response?.data || error.message);
        res.status(500).json({ error: 'Failed to evaluate code' });
    }
});

export default router;
