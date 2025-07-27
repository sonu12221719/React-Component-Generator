// /middlewares/rateLimit.js
import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 300,                  // 300 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // login/register endpoints
  standardHeaders: true,
  legacyHeaders: false,
});

export const llmLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 5,              // 5 LLM ops/min per IP (tune as needed)
  standardHeaders: true,
  legacyHeaders: false,
});
