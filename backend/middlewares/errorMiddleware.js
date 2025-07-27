// /middlewares/errorMiddleware.js

// 404 handler
export function notFound(req, res, next) {
    res.status(404).json({ error: 'Route not found' });
  }
  
  // Global error handler
  export function errorHandler(err, req, res, next) {
    console.error('❌ Server error:', err);
  
    const status = err.status || 500;
    const payload = {
      error: err.message || 'Internal Server Error',
    };
  
    if (process.env.NODE_ENV !== 'production') {
      payload.stack = err.stack;
    }
  
    res.status(status).json(payload);
  }
  