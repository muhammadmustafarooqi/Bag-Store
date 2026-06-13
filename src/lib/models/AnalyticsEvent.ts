import mongoose from 'mongoose';

const analyticsEventSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    eventName: {
      type: String,
      required: true,
      enum: ['page_view', 'view_promotion', 'view_item_list', 'add_to_cart', 'initiate_checkout', 'purchase'],
      index: true,
    },
    path: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

analyticsEventSchema.index({ sessionId: 1, eventName: 1 });
analyticsEventSchema.index({ createdAt: -1 });

export default mongoose.models.AnalyticsEvent || mongoose.model('AnalyticsEvent', analyticsEventSchema);
