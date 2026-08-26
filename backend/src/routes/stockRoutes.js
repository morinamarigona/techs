import express from 'express';
import { adjustStock, listStockLogs } from '../controllers/stockController.js';
import { protect, requireRole } from '../middleware/auth.js';

export const stockRoutes = express.Router();

stockRoutes.use(protect);
stockRoutes.get('/logs', listStockLogs);
stockRoutes.post('/adjust', requireRole('menaxher'), adjustStock);
