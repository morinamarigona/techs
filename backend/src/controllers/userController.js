import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { fail, ok } from '../utils/apiResponse.js';
import { userCreateSchema, userUpdateSchema } from '../validators/entitySchemas.js';

function getUserQuery(param) {
  if (mongoose.Types.ObjectId.isValid(param)) {
    return { _id: param };
  }
  return { email: param.toLowerCase() };
}

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  return ok(res, { users });
});

export const createUser = asyncHandler(async (req, res) => {
  const payload = userCreateSchema.parse(req.body);
  const exists = await User.findOne({ email: payload.email });

  if (exists) {
    return fail(res, 'Ky email ekziston tashme.', 409);
  }

  const passwordHash = await User.hashPassword(payload.password);
  const user = await User.create({
    ...payload,
    passwordHash,
    emailVerified: true,
  });

  return ok(res, { user }, 201);
});

export const updateUser = asyncHandler(async (req, res) => {
  const payload = userUpdateSchema.parse(req.body);
  const update = { ...payload };

  if (payload.password) {
    update.passwordHash = await User.hashPassword(payload.password);
    delete update.password;
  }

  const query = getUserQuery(req.params.id);
  const user = await User.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });

  if (!user) return fail(res, 'Perdoruesi nuk u gjet.', 404);
  return ok(res, { user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const query = getUserQuery(req.params.id);
  const targetUser = await User.findOne(query);

  if (!targetUser) {
    return fail(res, 'Perdoruesi nuk u gjet.', 404);
  }

  if (req.user.id === targetUser.id || req.user.email.toLowerCase() === targetUser.email.toLowerCase()) {
    return fail(res, 'Nuk mund ta fshini llogarine tuaj.', 400);
  }

  await User.findByIdAndDelete(targetUser._id);
  return ok(res, { message: 'Perdoruesi u fshi me sukses.' });
});

