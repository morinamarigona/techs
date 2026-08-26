import express from 'express';
import {
  login,
  logout,
  me,
  resendVerification,
  signup,
  verifyEmail,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

export const authRoutes = express.Router();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.get('/verify-email', verifyEmail);
authRoutes.post('/resend-verification', resendVerification);
authRoutes.get('/me', protect, me);
authRoutes.post('/logout', protect, logout);
