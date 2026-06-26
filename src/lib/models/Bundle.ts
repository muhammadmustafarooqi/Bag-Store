import mongoose from 'mongoose';
import slugify from 'slugify';

const bundleItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const bundleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true },
    image: {
      url: { type: String },
      publicId: { type: String },
    },
    bundlePrice: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
    items: [bundleItemSchema],
  },
  { timestamps: true }
);

bundleSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.models.Bundle || mongoose.model('Bundle', bundleSchema);
