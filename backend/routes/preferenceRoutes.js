import express from 'express';
import User from '../models/user.js';

const router = express.Router();

router.put('/updateTheme', async (req, res) => {
  const { darkMode, githubHandle } = req.body;
  try {
    // Validate required fields
    if (!githubHandle || darkMode === undefined) {
      return res.status(400).json({ error: 'githubHandle and darkMode are required' });
    }

    // Validate darkMode type
    if (typeof darkMode !== 'boolean') {
      return res.status(400).json({ error: 'darkMode must be a boolean' });
    }

    const user = await User.findOne({ githubHandle });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.darkMode = darkMode;
    await user.save();

    res.status(200).json({ message: 'Dark mode updated successfully', darkMode: user.darkMode });
  } catch (error) {
    console.error('Error updating dark mode:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;