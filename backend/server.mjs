import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";

const apiKey = process.env.GOOGLE_API_KEY;
const mongoURI = process.env.MONGO_DB_URI;
const app = express();
const port = 3000;
const genAI = new GoogleGenerativeAI(apiKey);

// Refactoring Schema
const refactoringSchema = {
  description: "Refactor and optimize the provided code. Ensure the refactored code improves complexity, efficiency, and maintainability while being properly formatted. Return the programming language and the reasoning behind the changes.",
  type: "object",
  properties: {
    original_code: {
      description: "The original version of the provided code.",
      type: "string",
    },
    refactored_code: {
      description: "The refactored version of the provided code, with improvements in complexity, efficiency, and formatting.",
      type: "string",
    },
    language: {
      description: "The programming language of the provided code.",
      type: "string",
    },
    reason: {
      description: "Explanation of the improvements, including how complexity and efficiency were enhanced.",
      type: "string",
    },
  },
  required: ["original_code", "refactored_code", "language", "reason"],
};

// Metrics Schema
const metricsSchema = {
  description: "Provide code metrics for analysis, including line count, cyclomatic complexity, maintainability index, and code smells.",
  type: "object",
  properties: {
    original_code: {
      description: "The original version of the provided code.",
      type: "string",
    },
    line_count: {
      description: "The total number of lines in the code.",
      type: "integer",
    },
    cyclomatic_complexity: {
      description: "The cyclomatic complexity of the code.",
      type: "integer",
    },
    maintainability_index: {
      description: "The maintainability index of the code.",
      type: "number",
    },
    code_smells: {
      description: "The number and types of code smells found in the code.",
      type: "array",
      items: {
        type: "string",
      },
    },
    duplicate_lines: {
      description: "The number of duplicate lines in the code.",
      type: "integer",
    },
    unused_variables: {
      description: "The number of unused variables in the code.",
      type: "integer",
    },
  },
  required: ["original_code", "line_count", "cyclomatic_complexity", "maintainability_index", "code_smells", "duplicate_lines", "unused_variables"],
};


// Model for refactoring
const refactoringModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    response_mime_type: "application/json",
    response_schema: refactoringSchema,
  },
});

// Model for metrics
const metricsModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    response_mime_type: "application/json",
    response_schema: metricsSchema,
  },
});

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// POST endpoint for code refactoring
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  const formattedPrompt = `
    Refactor the following code to:
    1. Improve its time and space complexity where possible.
    2. Enhance its readability with proper indentation and new lines.
    3. Simplify its logic for better maintainability.

    Original Code:
    ${prompt}

    Provide the optimized code, programming language, and a short explanation for the changes.
  `;

  try {
    const result = await refactoringModel.generateContent(formattedPrompt);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error('Error generating refactored code:', error);
    res.status(500).json({ error: 'Failed to generate optimized code' });
  }
});

// POST endpoint for code metrics and analysis
app.post('/metrics', async (req, res) => {
  const { prompt } = req.body;

  const formattedPrompt = `
    Analyze the following code and provide the following metrics:
    1. Total number of lines in the code.
    2. Cyclomatic complexity of the code.
    3. Maintainability index.
    4. Number and types of code smells.
    5. Number of duplicate lines.
    6. Number of unused variables.

    Original Code:
    ${prompt}
  `;

  try {
    const result = await metricsModel.generateContent(formattedPrompt);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error('Error generating code metrics:', error);
    res.status(500).json({ error: 'Failed to generate code metrics' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
