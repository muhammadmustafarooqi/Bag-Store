const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' },
  street: { type: String, required: true },
  city: { type: String, required: true },
  province: {
    type: String,
    enum: ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'AJK', 'GB', 'Islamabad'],
    required: true,
  },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => /^03\d{9}$/.test(v),
        message: 'Phone must be Pakistani format: 03XXXXXXXXX',
      },
    },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    addresses: [addressSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
