import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  freeShippingThreshold: { type: Number, default: 2000 },
  shippingFee: { type: Number, default: 200 },
  whatsappNumber: { type: String, default: '923000000000' },
  whatsappConfirmTemplate: { type: String, default: 'Hi {{customerName}}!\n\nThank you for placing an order with KAARVAN.\nTo ensure a smooth delivery, please confirm your order *{{orderId}}* for the following items:{{products}}\n\n*Total: {{total}}*\n\nPlease reply with "YES" to confirm or "NO" to cancel.\n\nThank you!' },
  whatsappCustomerTemplate: { type: String, default: 'Hi {{customerName}}! \n\nThank you for shopping with KAARVAN. \nYour order *{{orderId}}* is currently *{{orderStatus}}*.\nOrder Total: {{total}}\n\nYou can track your order live here:\n{{trackingUrl}}\n\nFeel free to reply if you have any questions.' },
  storeName: { type: String, default: 'KAARVAN' },
  contactEmail: { type: String, default: 'support@allnone.pk' },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
