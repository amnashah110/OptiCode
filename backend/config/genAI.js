import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { refactoringSchema, metricsSchema } from '../schemas.js';

dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export const refactoringModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    response_mime_type: "application/json",
    response_schema: refactoringSchema,
  },
});

export const metricsModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    response_mime_type: "application/json",
    response_schema: metricsSchema,
  },
});
