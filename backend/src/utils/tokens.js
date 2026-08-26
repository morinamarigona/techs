import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export function signAuthToken(user) {
  return jwt.sign(
    { id: user._id.toString(), roli: user.roli },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

export function createEmailVerifyToken() {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  const minutes = Number(process.env.EMAIL_VERIFY_TOKEN_EXPIRES_MINUTES || 60);

  return {
    rawToken,
    hashedToken,
    expiresAt: new Date(Date.now() + minutes * 60 * 1000),
  };
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
