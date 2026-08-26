import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    emri: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    kategoria: {
      type: String,
      set: (value) => {
        if (typeof value !== 'string') return value;
        const normalized = value.trim();
        switch (normalized) {
          case 'Telefone & Tablete':
            return 'Telefonë & Tabletë';
          case 'Laptops & Kompjutere':
            return 'Laptops & Kompjuterë';
          case 'Audio & Degjuese':
            return 'Audio & Dëgjuese';
          case 'Pajisje Shtepiake':
            return 'Pajisje Shtëpiake';
          case 'Aksesore & Tjera':
            return 'Aksesorë & Tjera';
          default:
            return normalized;
        }
      },
      enum: [
        'Telefonë & Tabletë',
        'Laptops & Kompjuterë',
        'Audio & Dëgjuese',
        'TV & Video',
        'Pajisje Shtëpiake',
        'Aksesorë & Tjera',
      ],
      required: true,
    },
    cmimi: { type: Number, required: true, min: 0 },
    cmimiBlerjes: { type: Number, default: 0, min: 0 },
    stoku: { type: Number, default: 0, min: 0 },
    stokuMin: { type: Number, default: 2, min: 0 },
    pershkrimi: { type: String, default: '' },
    imazhi: { type: String, default: '' },
    dataShtimit: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

productSchema.virtual('id').get(function getId() {
  return this._id.toString();
});

productSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Product = mongoose.model('Product', productSchema, 'myapp_products');
