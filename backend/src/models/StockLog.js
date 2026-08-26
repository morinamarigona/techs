import mongoose from 'mongoose';

const stockLogSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    produktEmri: { type: String, required: true },
    lloji: {
      type: String,
      enum: ['Hyrje Furnizimi', 'Dalje (Shitje)', 'Korigjim Stokut'],
      required: true,
    },
    sasia: { type: Number, required: true },
    sasiaVjetra: { type: Number, required: true },
    sasiaRe: { type: Number, required: true },
    perdoruesi: { type: String, required: true },
    data: { type: String, default: () => new Date().toISOString() },
    shenime: { type: String, default: '' },
  },
  { timestamps: true }
);

stockLogSchema.virtual('id').get(function getId() {
  return this._id.toString();
});

stockLogSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    if (ret.productId) ret.productId = ret.productId.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const StockLog = mongoose.model('StockLog', stockLogSchema, 'myapp_stock_logs');
