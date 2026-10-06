const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'maternal_super_secret_jwt_key_2026';

/**
 * Extracts Bearer token from the Authorization header.
 */
function getTokenFromHeader(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return null;
}

/**
 * Middleware that requires a valid JWT token.
 */
async function authenticateToken(req, res, next) {
  const token = getTokenFromHeader(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication token missing. Please log in.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User account not found.',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token. Please log in again.',
    });
  }
}

/**
 * Middleware where authentication is optional.
 * If a valid token is present, req.user is set; otherwise req.user is null.
 */
async function optionalAuth(req, res, next) {
  const token = getTokenFromHeader(req);

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    req.user = user || null;
  } catch {
    req.user = null;
  }

  next();
}

/**
 * Helper to generate JWT token.
 */
function generateToken(userId, username) {
  const expirationHours = parseInt(process.env.JWT_EXPIRATION_HOURS || '24', 10);
  return jwt.sign(
    { userId, username },
    JWT_SECRET,
    { expiresIn: `${expirationHours}h` }
  );
}

module.exports = {
  authenticateToken,
  optionalAuth,
  generateToken,
};
