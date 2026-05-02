const mongoose = require('mongoose');
const slugify = require('slugify');

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    category: {
      type: String,
      enum: [
        'handbag',
        'backpack',
        'laptop bag',
        'tote',
        'travel bag',
        'clutch',
        'wallet',
        'school bag',
      ],
      required: true,
    },
    brand: { type: String, default: 'KAARVAN' },
    sku: { type: String, unique: true, sparse: true },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    onSale: { type: Boolean, default: false },
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: [imageSchema],
    colors: [{ type: String }],
    material: { type: String },
    dimensions: { type: String },
    weight: { type: String },
    isFeatured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    reviews: [reviewSchema],
    tags: [{ type: String }],
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

// Auto-generate slug before save
productSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  // Recalculate average rating
  if (this.reviews && this.reviews.length > 0) {
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    this.ratings.average = +(total / this.reviews.length).toFixed(1);
    this.ratings.count = this.reviews.length;
  }
  next();
});

// Text index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isNew: 1 });

module.exports = mongoose.model('Product', productSchema);
