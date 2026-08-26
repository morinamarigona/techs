import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { fail, ok } from '../utils/apiResponse.js';
import { createEmailVerifyToken, hashToken, signAuthToken } from '../utils/tokens.js';
import { loginSchema, resendVerificationSchema, signupSchema } from '../validators/authSchemas.js';
import { sendVerificationEmail, sendWelcomeEmail } from '../services/emailService.js';

function userResponse(user) {
  return user.toJSON ? user.toJSON() : user;
}

export const signup = asyncHandler(async (req, res) => {
  const payload = signupSchema.parse(req.body);
  const exists = await User.findOne({ email: payload.email });

  if (exists) {
    return fail(res, 'Ky email ekziston tashme.', 409);
  }

  const verify = createEmailVerifyToken();
  const passwordHash = await User.hashPassword(payload.password);
  const user = await User.create({
    ...payload,
    passwordHash,
    statusi: 'Aktiv',
    emailVerified: false,
    emailVerifyToken: verify.hashedToken,
    emailVerifyExpires: verify.expiresAt,
  });

  await sendVerificationEmail(user, verify.rawToken);

  return ok(
    res,
    {
      message: 'Llogaria u krijua. Kontrolloni email-in per verifikim.',
      user: userResponse(user),
    },
    201
  );
});

export const login = asyncHandler(async (req, res) => {
  const payload = loginSchema.parse(req.body);
  const user = await User.findOne({ email: payload.email }).select('+passwordHash');

  if (!user || !(await user.comparePassword(payload.password))) {
    return fail(res, 'Email ose fjalekalim i pasakte.', 401);
  }

  if (user.statusi !== 'Aktiv') {
    return fail(res, 'Kjo llogari eshte jo-aktive.', 403);
  }

  const token = signAuthToken(user);
  return ok(res, { token, user: userResponse(user) });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.query.token;

  if (!token || typeof token !== 'string') {
    return fail(res, 'Token mungon.', 400);
  }

  const user = await User.findOne({
    emailVerifyToken: hashToken(token),
    emailVerifyExpires: { $gt: new Date() },
  }).select('+emailVerifyToken +emailVerifyExpires');

  if (!user) {
    return fail(res, 'Token nuk eshte valid ose ka skaduar.', 400);
  }

  user.emailVerified = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyExpires = undefined;
  await user.save();
  await sendWelcomeEmail(user);

  return ok(res, { message: 'Email-i u verifikua me sukses.', user: userResponse(user) });
});

export const resendVerification = asyncHandler(async (req, res) => {
  const payload = resendVerificationSchema.parse(req.body);
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    return fail(res, 'Perdoruesi nuk u gjet.', 404);
  }

  if (user.emailVerified) {
    return ok(res, { message: 'Email-i eshte tashme i verifikuar.' });
  }

  const verify = createEmailVerifyToken();
  user.emailVerifyToken = verify.hashedToken;
  user.emailVerifyExpires = verify.expiresAt;
  await user.save();
  await sendVerificationEmail(user, verify.rawToken);

  return ok(res, { message: 'Email-i i verifikimit u dergua perseri.' });
});

export const me = asyncHandler(async (req, res) => {
  return ok(res, { user: userResponse(req.user) });
});

export const logout = asyncHandler(async (req, res) => {
  return ok(res, { message: 'Logout u krye. Fshini token-in ne klient.' });
});
