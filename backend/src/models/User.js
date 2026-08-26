import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    emri: {
      type: String,
      required: true,
      trim: true,
    },
    mbiemri: {
      type: String,
      required: true,
      trim: true,
    },
    roli: {
      type: String,
      enum: ['menaxher', 'punetor'],
      default: 'punetor',
    },
    statusi: {
      type: String,
      enum: ['Aktiv', 'Jo-aktiv'],
      default: 'Aktiv',
    },
    numriTelefonit: {
      type: String,
      default: '',
      trim: true,
    },
    dataKrijimit: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifyToken: {
      type: String,
      select: false,
    },
    emailVerifyExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.virtual('id').get(function getId() {
  return this._id.toString();
});

userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    delete ret.emailVerifyToken;
    delete ret.emailVerifyExpires;
    return ret;
  },
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.hashPassword = function hashPassword(password) {
  return bcrypt.hash(password, 12);
};

export const User = mongoose.model('User', userSchema, 'myapp_users');
