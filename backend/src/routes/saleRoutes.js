import express from 'express';
import { createSale, listSales } from '../controllers/saleController.js';
import { protect } from '../middleware/auth.js';

export const saleRoutes = express.Router();

saleRoutes.use(protect);
saleRoutes.get('/', listSales);
saleRoutes.post('/', createSale);
