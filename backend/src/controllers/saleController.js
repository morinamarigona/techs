import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { Sale } from '../models/Sale.js';
import { StockLog } from '../models/StockLog.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { fail, ok } from '../utils/apiResponse.js';
import { saleCreateSchema } from '../validators/entitySchemas.js';

async function nextInvoiceNumber() {
  const count = await Sale.countDocuments();
  return `TS-2026-${String(count + 101).padStart(5, '0')}`;
}

export const listSales = asyncHandler(async (req, res) => {
  const filter = req.user.roli === 'menaxher' ? {} : { punetoriId: req.user._id };
  const sales = await Sale.find(filter).sort({ createdAt: -1 });
  return ok(res, { sales });
});

export const createSale = asyncHandler(async (req, res) => {
  const payload = saleCreateSchema.parse(req.body);
  const ids = payload.items.map((item) => item.productId);

  if (ids.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
    return fail(res, 'Nje ose me shume product IDs nuk jane valide.', 400);
  }

  const products = await Product.find({ _id: { $in: ids } });
  const byId = new Map(products.map((product) => [product._id.toString(), product]));

  for (const item of payload.items) {
    const product = byId.get(item.productId);
    if (!product) return fail(res, 'Produkti nuk u gjet.', 404);
    if (product.stoku < item.sasia) {
      return fail(res, `Stoku nuk mjafton per ${product.emri}.`, 400);
    }
  }

  const items = payload.items.map((item) => {
    const product = byId.get(item.productId);
    return {
      productId: product._id,
      produktEmri: product.emri,
      sku: product.sku,
      sasia: item.sasia,
      cmimiNjesi: product.cmimi,
      total: Number((product.cmimi * item.sasia).toFixed(2)),
    };
  });

  const shumaBruto = Number(items.reduce((sum, item) => sum + item.total, 0).toFixed(2));
  const zbritjaEuro = payload.zbritja > 0 ? Number(((shumaBruto * payload.zbritja) / 100).toFixed(2)) : 0;
  const shumaNeto = Number((shumaBruto - zbritjaEuro).toFixed(2));
  const tvsh = Number((shumaNeto * 0.18).toFixed(2));
  const data = new Date().toISOString();
  const nrFatures = await nextInvoiceNumber();

  const sale = await Sale.create({
    nrFatures,
    punetoriId: req.user._id,
    punetoriEmri: `${req.user.emri} ${req.user.mbiemri}`,
    items,
    shumaBruto,
    zbritja: payload.zbritja,
    tvsh,
    shumaNeto,
    menyraPageses: payload.menyraPageses,
    klientEmri: payload.klientEmri,
    data,
  });

  const stockLogs = [];
  for (const item of items) {
    const product = byId.get(item.productId.toString());
    const oldStock = product.stoku;
    product.stoku = Math.max(0, product.stoku - item.sasia);
    await product.save();
    stockLogs.push({
      productId: product._id,
      produktEmri: product.emri,
      lloji: 'Dalje (Shitje)',
      sasia: item.sasia,
      sasiaVjetra: oldStock,
      sasiaRe: product.stoku,
      perdoruesi: `${req.user.emri} ${req.user.mbiemri}`,
      data,
      shenime: `Shitje fature #${nrFatures}`,
    });
  }

  await StockLog.insertMany(stockLogs);
  const updatedProducts = await Product.find({ _id: { $in: ids } });

  return ok(res, { sale, updatedProducts }, 201);
});
