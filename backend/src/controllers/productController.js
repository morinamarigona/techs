import { Product } from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { fail, ok } from '../utils/apiResponse.js';
import { productSchema } from '../validators/entitySchemas.js';

const categoryMap = new Map([
  ['Telefone & Tablete', 'Telefonë & Tabletë'],
  ['Laptops & Kompjutere', 'Laptops & Kompjuterë'],
  ['Audio & Degjuese', 'Audio & Dëgjuese'],
  ['Pajisje Shtepiake', 'Pajisje Shtëpiake'],
  ['Aksesore & Tjera', 'Aksesorë & Tjera'],
]);

const normalizeCategory = (value) => categoryMap.get(value) || value;

export const listProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  return ok(res, { products });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return fail(res, 'Produkti nuk u gjet.', 404);
  return ok(res, { product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const payload = productSchema.parse(req.body);
  const product = await Product.create({
    ...payload,
    kategoria: normalizeCategory(payload.kategoria),
    cmimiBlerjes: payload.cmimiBlerjes ?? payload.cmimi * 0.75,
  });
  return ok(res, { product }, 201);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const payload = productSchema.partial().parse(req.body);
  if (payload.kategoria) payload.kategoria = normalizeCategory(payload.kategoria);
  const product = await Product.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  if (!product) return fail(res, 'Produkti nuk u gjet.', 404);
  return ok(res, { product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return fail(res, 'Produkti nuk u gjet.', 404);
  return ok(res, { message: 'Produkti u fshi.' });
});
