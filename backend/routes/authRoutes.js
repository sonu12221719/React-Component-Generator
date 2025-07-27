// /routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser, getProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getProfile); // protected route

export default router;
