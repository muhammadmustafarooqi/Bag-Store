const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
  color: { type: String },
});

const shippingAddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  province: {
    type: String,
    enum: ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'AJK', 'GB', 'Islamabad'],
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guestInfo: {
      name: String,
      email: String,
      phone: String,
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      enum: ['COD', 'JazzCash'],
      required: true,
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    jazzCashTransactionId: { type: String },
    orderStatus: {
      type: String,
      enum: [
        'placed',
        'confirmed',
        'packed',
        'shipped',
        'delivered',
        'cancelled',
        'returned',
      ],
      default: 'placed',
    },
    trackingNumber: { type: String },
    courierName: { type: String },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: { type: String },
    notes: { type: String },
    placedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto-generate orderId: KRV-YYYY-XXXX
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `KRV-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

orderSchema.index({ user: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ placedAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
