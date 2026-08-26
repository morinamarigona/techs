import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { StockLog } from '../models/StockLog.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { fail, ok } from '../utils/apiResponse.js';
import { stockAdjustSchema } from '../validators/entitySchemas.js';

export const listStockLogs = asyncHandler(async (req, res) => {
  const stockLogs = await StockLog.find().sort({ createdAt: -1 });
  return ok(res, { stockLogs });
});

export const adjustStock = asyncHandler(async (req, res) => {
  const payload = stockAdjustSchema.parse(req.body);

  if (!mongoose.Types.ObjectId.isValid(payload.productId)) {
    return fail(res, 'Product ID nuk eshte valid.', 400);
  }

  const product = await Product.findById(payload.productId);
  if (!product) return fail(res, 'Produkti nuk u gjet.', 404);

  const oldStock = product.stoku;
  const newStock = Math.max(0, oldStock + payload.sasiaNdryshuar);
  product.stoku = newStock;
  await product.save();

  const stockLog = await StockLog.create({
    productId: product._id,
    produktEmri: product.emri,
    lloji: payload.lloji,
    sasia: Math.abs(payload.sasiaNdryshuar),
    sasiaVjetra: oldStock,
    sasiaRe: newStock,
    perdoruesi: `${req.user.emri} ${req.user.mbiemri}`,
    data: new Date().toISOString(),
    shenime:
      payload.shenime ||
      (payload.lloji === 'Hyrje Furnizimi' ? 'Furnizim i ri i stokut' : 'Korigjim manual i stokut'),
  });

  return ok(res, { product, stockLog });
});
