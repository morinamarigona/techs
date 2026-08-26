import express from 'express';
import { createUser, deleteUser, listUsers, updateUser } from '../controllers/userController.js';
import { protect, requireRole } from '../middleware/auth.js';

export const userRoutes = express.Router();

userRoutes.get('/', protect, requireRole('menaxher'), listUsers);
userRoutes.post('/', protect, requireRole('menaxher'), createUser);
userRoutes.put('/:id', protect, requireRole('menaxher'), updateUser);
userRoutes.delete('/:id', protect, requireRole('menaxher'), deleteUser);

