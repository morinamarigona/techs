import jwt from 'jsonwebtoken';
import { fail } from '../utils/apiResponse.js';
import { User } from '../models/User.js';

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return fail(res, 'Nuk jeni i kycur.', 401);
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-passwordHash');

    if (!user || user.statusi !== 'Aktiv') {
      return fail(res, 'Llogaria nuk eshte aktive.', 401);
    }

    req.user = user;
    next();
  } catch {
    return fail(res, 'Sesioni nuk eshte valid.', 401);
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.roli)) {
      return fail(res, 'Nuk keni qasje per kete veprim.', 403);
    }

    next();
  };
}
