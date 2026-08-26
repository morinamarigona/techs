import { fail } from '../utils/apiResponse.js';

export function notFound(req, res) {
  return fail(res, `Route nuk u gjet: ${req.originalUrl}`, 404);
}

export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'ZodError') {
    return fail(res, 'Te dhenat nuk jane valide.', 422, err.errors);
  }

  if (err.code === 11000) {
    return fail(res, 'Ekziston nje rekord me keto te dhena.', 409, err.keyValue);
  }

  return fail(res, err.message || 'Gabim ne server.', err.statusCode || 500);
}
