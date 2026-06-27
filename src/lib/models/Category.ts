import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    image: { type: String },
    imagePublicId: { type: String },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

categorySchema.pre('save', async function () {
  if (this.isModified('name') && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
