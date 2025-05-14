import express from 'express';
import cors from 'cors';
import { refactoringModel, metricsModel } from './config/genAI.js';
import { connectDB } from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import preference from './routes/preferenceRoutes.js';
import compilation from './routes/compile.js';
import challenges from './routes/challenge.js';

const app = express();
const port = 3000;

// Connect to DB (only when not in test mode, optional)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use('/auth', userRoutes);
app.use('/pref', preference);
app.use('/code', compilation);
app.use('/', challenges)

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

// Start the server only when run directly (not during tests)
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
  });
}

// Export app for testing
export default app;