/**
 * middleware/auth.js — JWT authentication
 * Fix #1: requireAuth verifies the Bearer token and attaches req.user.
 * optionalAuth populates req.user when a token is present but never blocks.
 */
import jwt from 'jsonwebtoken';

/**
 * Strict auth — returns 401/403 if no valid token is provided.
 * Use on any route that mutates or reads user-owned resources.
 */
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized — Bearer token required' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('[Auth] JWT_SECRET is not configured!');
    return res.status(500).json({ success: false, error: 'Server auth misconfiguration' });
  }

  try {
    req.user = jwt.verify(token, secret);
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    return res.status(401).json({ success: false, error: message });
  }
};

/**
 * Optional auth — populates req.user if a valid token is present.
 * Never blocks the request. Use on public routes that optionally
 * behave differently for authenticated users.
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (token && process.env.JWT_SECRET) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      // Invalid token — silently continue as unauthenticated
    }
  }
  next();
};
