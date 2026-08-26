import express from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from '../controllers/productController.js';
import { protect, requireRole } from '../middleware/auth.js';

export const productRoutes = express.Router();

productRoutes.use(protect);
productRoutes.get('/', listProducts);
productRoutes.get('/:id', getProduct);
productRoutes.post('/', requireRole('menaxher'), createProduct);
productRoutes.put('/:id', requireRole('menaxher'), updateProduct);
productRoutes.delete('/:id', requireRole('menaxher'), deleteProduct);
