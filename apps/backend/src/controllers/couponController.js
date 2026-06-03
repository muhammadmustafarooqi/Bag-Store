const { Coupon } = require('@kaarvan/db');

// POST /api/v1/coupons/validate
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, orderTotal } = req.body;
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid or expired coupon' });
    if (orderTotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is Rs ${coupon.minOrderAmount}`,
      });
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }

    const discount =
      coupon.type === 'percent'
        ? Math.round((orderTotal * coupon.value) / 100)
        : coupon.value;

    res.json({ success: true, data: { coupon, discount } });
  } catch (err) { next(err); }
};

// POST /api/v1/coupons (admin)
exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (err) { next(err); }
};

// GET /api/v1/coupons (admin)
exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (err) { next(err); }
};

// DELETE /api/v1/coupons/:id (admin)
exports.deleteCoupon = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) { next(err); }
};
