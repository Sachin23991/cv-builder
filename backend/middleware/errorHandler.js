/**
 * middleware/errorHandler.js — Centralized error handling for Express
 * Captures both synchronous and async errors, logs them, and returns a JSON payload.
 */
export function errorHandler(err, _req, res, _next) {
  console.error('[Error]', err);
  const status = err.status || 500;
  const response = {
    success: false,
    error: err.message || 'Internal Server Error',
  };
  // In development, include stack trace for debugging
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }
  res.status(status).json(response);
}

export function notFoundHandler(_req, res) {
  res.status(404).json({ success: false, error: 'Route not found' });
}
