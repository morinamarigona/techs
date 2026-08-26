import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    produktEmri: { type: String, required: true },
    sku: { type: String, required: true },
    sasia: { type: Number, required: true, min: 1 },
    cmimiNjesi: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    nrFatures: { type: String, required: true, unique: true },
    punetoriId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    punetoriEmri: { type: String, required: true },
    items: { type: [saleItemSchema], required: true },
    shumaBruto: { type: Number, required: true, min: 0 },
    zbritja: { type: Number, default: 0, min: 0 },
    tvsh: { type: Number, default: 0, min: 0 },
    shumaNeto: { type: Number, required: true, min: 0 },
    menyraPageses: {
      type: String,
      enum: ['Kesh', 'Kartelë', 'Me Këste', 'Kartele', 'Me Keste'],
      required: true,
    },
    klientEmri: { type: String, default: '' },
    data: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

saleSchema.virtual('id').get(function getId() {
  return this._id.toString();
});

saleSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    if (ret.punetoriId) ret.punetoriId = ret.punetoriId.toString();
    ret.items = ret.items?.map((item) => ({
      ...item,
      productId: item.productId?.toString(),
    }));
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Sale = mongoose.model('Sale', saleSchema, 'myapp_sales');
