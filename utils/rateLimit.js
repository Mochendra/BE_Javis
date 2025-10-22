import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 1000, 
  max: 3, 
  message: { error: 'Terlalu banyak percobaan' },
  standardHeaders: true,
  legacyHeaders: false,
});
