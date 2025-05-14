import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/compile', async (req, res) => {
    const { source_code, language_id } = req.body; // Ensure that it matches the frontend
    if (!source_code || !language_id) {
        return res.status(400).json({ error: 'Missing source code or language id' });
    }

    try {
        // Step 1: Submit code for execution
        const submissionResponse = await axios.post(
          'https://judge0-ce.p.rapidapi.com/submissions',
          {
            source_code: source_code, // Use source_code here
            language_id: language_id,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, // your RapidAPI key
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            },
            params: {
              base64_encoded: 'false',
              wait: 'true', // if you want to wait for the result in the same request
            },
          }
        );

        const result = submissionResponse.data;
        res.json({ result });
    } catch (error) {
        console.error('Compilation error:', error?.response?.data || error.message);
        res.status(500).json({ error: 'Failed to compile code' });
    }
});

export default router;
