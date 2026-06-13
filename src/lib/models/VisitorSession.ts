import mongoose from 'mongoose';

const visitorSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    ip: { type: String },
    userAgent: { type: String },
    referrer: { type: String },
    hasCart: { type: Boolean, default: false },
    hasCheckout: { type: Boolean, default: false },
    hasOrdered: { type: Boolean, default: false },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

visitorSessionSchema.index({ lastActive: -1 });

export default mongoose.models.VisitorSession || mongoose.model('VisitorSession', visitorSessionSchema);
