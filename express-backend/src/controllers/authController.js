const { Op } = require('sequelize');
const { User } = require('../models');
const { generateToken } = require('../middleware/auth');

/**
 * Register a new user account.
 * POST /api/auth/register
 */
async function register(req, res) {
  try {
    const { username, email, password } = req.body || {};

    const cleanUsername = (username || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = password || '';

    // Field validation
    if (!cleanUsername || cleanUsername.length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Username must be at least 3 characters long.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      });
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.',
      });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username: cleanUsername },
          { email: cleanEmail },
        ],
      },
    });

    if (existingUser) {
      const isUsernameTaken = existingUser.username.toLowerCase() === cleanUsername.toLowerCase();
      return res.status(409).json({
        success: false,
        error: isUsernameTaken
          ? 'Username is already taken. Please choose another.'
          : 'Email is already registered. Please log in or use another email.',
      });
    }

    // Create user
    const newUser = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      password: cleanPassword,
    });

    // Generate JWT token
    const token = generateToken(newUser.id, newUser.username);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      user: newUser.toJSON(),
      token,
    });
  } catch (error) {
    console.error('[AUTH ERROR] Registration failed:', error);
    return res.status(500).json({
      success: false,
      error: `Registration failed: ${error.message}`,
    });
  }
}

/**
 * Authenticate existing user.
 * POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { identifier, password } = req.body || {};

    const cleanIdentifier = (identifier || '').trim();
    const cleanPassword = password || '';

    if (!cleanIdentifier || !cleanPassword) {
      return res.status(400).json({
        success: false,
        error: 'Username/Email and password are required.',
      });
    }

    // Find user by username OR email
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: cleanIdentifier },
          { email: cleanIdentifier.toLowerCase() },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username/email or password.',
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(cleanPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username/email or password.',
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.username);

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    console.error('[AUTH ERROR] Login failed:', error);
    return res.status(500).json({
      success: false,
      error: `Login failed: ${error.message}`,
    });
  }
}

/**
 * Get current authenticated user profile.
 * GET /api/auth/me
 */
async function getMe(req, res) {
  try {
    return res.status(200).json({
      success: true,
      user: req.user.toJSON(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Failed to fetch user profile: ${error.message}`,
    });
  }
}

module.exports = {
  register,
  login,
  getMe,
};
