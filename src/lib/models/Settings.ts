import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  freeShippingThreshold: { type: Number, default: 2000 },
  shippingFee: { type: Number, default: 200 },
  whatsappNumber: { type: String, default: '923000000000' },
  storeName: { type: String, default: 'KAARVAN' },
  contactEmail: { type: String, default: 'support@allnone.pk' },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
